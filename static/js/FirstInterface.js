/*jslint browser: true*/
/*globals Poll*/

function InterfaceCandidate(givenDumpId, givenCandidateValue, givenCandidate, givenForeColor, givenBackColor) {
	'use strict';

	var dumpId = givenDumpId,

		candidateValue = givenCandidateValue,
		candidate = givenCandidate,

		name = candidateValue.name,
		image = candidateValue.image || '/savedimages/default.gif',

		foreColor = givenForeColor,
		backColor = givenBackColor,

		parentElement,
		candidateButton,
		candidateText,
		candidateName,
		candidateVotes,
		displayedVotes;

	this.getCandidateButton = function () {
		return candidateButton;
	};

	this.setLeaderState = function (isLeader) {
		if (isLeader) {
			candidateText.style.color = backColor;
			candidateText.style.backgroundColor = foreColor;
		} else {
			candidateText.style.color = foreColor;
			candidateText.style.backgroundColor = backColor;
		}
	};

	this.removeIfNotLeader = function (isLeader) {
		candidateButton.disabled = true;
		if (!isLeader) {
			candidateButton.style.opacity = 0;
			candidateButton.style.width = '0em';
			setTimeout(function () {
				candidateButton.style.display = 'none';
			}, 500);
		}
	};
	
	this.showOnUi = function (width) {
		candidateButton.disabled = false;
			candidateButton.style.opacity = 1;
			candidateButton.style.width = width;
			candidateButton.style.display = 'inline-block';
	};

	this.updateVotes = function () {
		candidateVotes.removeChild(displayedVotes);
		displayedVotes = document.createTextNode(candidate.getVotes());
		candidateVotes.appendChild(displayedVotes);
	};

	this.getCandidateDetails = function () {
		return {
			'name': name,
			'image': image,
			'votes': candidate.getVotes()
		};
	};

	candidateName = document.createElement('div');
	candidateName.className = 'candidateName';
	candidateName.appendChild(document.createTextNode(name));

	displayedVotes = document.createTextNode(candidate.getVotes());

	candidateVotes = document.createElement('div');
	candidateVotes.className = 'candidateVotes';
	candidateVotes.appendChild(displayedVotes);

	candidateText = document.createElement('div');
	candidateText.className = 'candidateText';
	candidateText.style.backgroundColor = backColor;
	candidateText.appendChild(candidateName);
	candidateText.appendChild(candidateVotes);

	candidateButton = document.createElement('button');
	candidateButton.className = 'candidateButton';
	candidateButton.style.backgroundColor = foreColor;
	candidateButton.style.backgroundImage = 'url(\'' + image + '\')';
	candidateButton.style.borderColor = foreColor;
	candidateButton.appendChild(candidateText);
	candidateButton.addEventListener('click', function () {
		candidate.vote();
		candidateVotes.removeChild(displayedVotes);
		displayedVotes = document.createTextNode(candidate.getVotes());
		candidateVotes.appendChild(displayedVotes);
	});

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(candidateButton);
}

function InterfacePoll(givenDumpId, givenPollValue, givenIndex) {
	'use strict';

	var dumpId = givenDumpId,
		id = givenPollValue.name.replace(/\s/g, '') + givenIndex,
		pollIndex = givenIndex,
		pollValue = givenPollValue,
		poll = new Poll(pollValue.candidates.length),

		name = pollValue.name,
		message = pollValue.message,
		foreColor = pollValue.foreColor,
		backColor = pollValue.backColor,
		candidates = pollValue.candidates,

		interfaceCandidates = [],
		votes = 0,

		parentElement,

		headingSlide,
		centeredContainer,
		titleBox,
		messageBox,
		startButton,

		electionSlide,
		winnerDeclaration,
		candidateButtonGroup,

		controls,
		resetPollButton,
		endPollButton,
		undoButton,
		nextPollButton,

		width;

	function updateServer(candidateIndex,voteCount) {
		var xhr,
			instruction = {
					'action': 'update',
					'update': 'votes',
					'value': voteCount
				};

		instruction.pollIndex = pollIndex;
		instruction.candidateIndex = candidateIndex;

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/candidateAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}
	
	function updateEnded(givenInstruction) {
		var xhr,
			instruction = {
			'action': 'update',
			'update': 'ended',
			'value': true
		};

		instruction.pollIndex = pollIndex;

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/pollAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}
	function vote(givenIndex) {
		poll.addToVotes(givenIndex);
		poll.getWhetherLeaders(true).forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
		});
		votes += 1;
		if (votes === 1) {
			undoButton.style.display = 'inline-block';
			endPollButton.style.display = 'inline-block';
			endPollButton.disabled = false;
			resetPollButton.style.display = 'inline-block';
		}
	}

	function undoVote() {
		poll.undo();
		poll.getWhetherLeaders(true).forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
			interfaceCandidates[index].updateVotes();
		});
		votes -= 1;
		if (votes === 0) {
			undoButton.style.display = 'none';
			endPollButton.style.display = 'none';
			resetPollButton.style.display = 'none';
		}
	}

	function centerElements() {
		centeredContainer.style.bottom = (window.innerHeight - centeredContainer.offsetHeight) / 2 + "px";
		candidateButtonGroup.style.bottom = (window.innerHeight - candidateButtonGroup.offsetHeight) / 2 + "px";
	}

	function createNewInterfaceCandidate(givenCandidateValue, index) {
		var tempInterfaceCandidate = new InterfaceCandidate(id, givenCandidateValue, poll.getCandidates()[index], foreColor, backColor);

		tempInterfaceCandidate.getCandidateButton().addEventListener('click', function () {
			vote(index);
		});

		interfaceCandidates.push(tempInterfaceCandidate);
	}

	function declareResults() {
		poll.getWhetherLeaders(false).forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
			interfaceCandidates[index].removeIfNotLeader(isLeader);
		});
		if (poll.getWinnerIndexes().length === 1) {
			winnerDeclaration.appendChild(document.createTextNode('We have our winner!'));
		} else {
			winnerDeclaration.appendChild(document.createTextNode('We have our winners!'));
		}
		winnerDeclaration.style.opacity = 1;
	}

	this.getHeadingSlide = function () {
		return headingSlide;
	};

	this.getElectionSlide = function () {
		return electionSlide;
	};

	this.getStartButton = function () {
		return startButton;
	};

	this.getEndPollButton = function () {
		return endPollButton;
	};

	this.getResetPollButton = function () {
		return resetPollButton;
	};

	this.getControls = function () {
		return controls;
	};

	this.getNextPollButton = function () {
		return nextPollButton;
	};

	this.getName = function () {
		return name;
	};

	this.getForeColor = function () {
		return foreColor;
	};

	this.getBackColor = function () {
		return backColor;
	};

	this.getWinnerDetails = function () {
		var indexes = poll.getWinnerIndexes(),
			winnerDetails = [];

		indexes.forEach(function (index) {
			winnerDetails.push(interfaceCandidates[index].getCandidateDetails());
		});

		return winnerDetails;
	};

	this.reset = function () {
		votes = 0;
		poll.reset();
		poll.getWhetherLeaders(true).forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
			interfaceCandidates[index].updateVotes();
		});
		poll.getCandidates().forEach(function (candidate, index) {
			updateServer(index,candidate.getVotes());
		});
		winnerDeclaration.removeChild(winnerDeclaration.firstChild);
		interfaceCandidates.forEach(function (candidate, index) {
			candidate.showOnUi(width);
		});
		undoButton.style.display = 'none';
		endPollButton.style.display = 'none';
		resetPollButton.style.display = 'none';
		nextPollButton.style.display = 'none';
	};

	this.end = function () {
		endPollButton.style.display = 'none';
		endPollButton.disabled = true;
		undoButton.style.display = 'none';
		resetPollButton.style.display = 'inline-block';
		declareResults();
		poll.getCandidates().forEach(function (candidate, index) {
			updateServer(index,candidate.getVotes());
		});
	};

	titleBox = document.createElement('h1');
	titleBox.appendChild(document.createTextNode(name.concat(' Election')));

	messageBox = document.createElement('h2');
	messageBox.appendChild(document.createTextNode(message));

	startButton = document.createElement('button');
	startButton.appendChild(document.createTextNode('Start Election'));
	startButton.className = 'startButton';
	startButton.style.backgroundColor = foreColor;
	startButton.style.color = backColor;
	startButton.addEventListener('click', function () {
		headingSlide.style.left = '-100%';
		electionSlide.style.left = '0em';
		this.disabled = true;
	});

	centeredContainer = document.createElement('div');
	centeredContainer.className = 'centeredContainer';
	centeredContainer.appendChild(titleBox);
	centeredContainer.appendChild(messageBox);
	centeredContainer.appendChild(startButton);

	headingSlide = document.createElement('div');
	headingSlide.className = 'slide';
	headingSlide.style.backgroundColor = backColor;
	headingSlide.style.color = foreColor;
	headingSlide.appendChild(centeredContainer);

	winnerDeclaration = document.createElement('h2');
	winnerDeclaration.className = 'winnerDeclaration';

	candidateButtonGroup = document.createElement('div');
	candidateButtonGroup.className = 'candidateButtonGroup';
	candidateButtonGroup.id = id;
	candidateButtonGroup.appendChild(winnerDeclaration);

	resetPollButton = document.createElement('button');
	resetPollButton.style.backgroundColor = backColor;
	resetPollButton.style.color = foreColor;
	resetPollButton.style.display = 'none';
	resetPollButton.appendChild(document.createTextNode('Reset This Election'));

	endPollButton = document.createElement('button');
	endPollButton.className = 'endPollButton';
	endPollButton.style.backgroundColor = backColor;
	endPollButton.style.color = foreColor;
	endPollButton.style.display = 'none';
	endPollButton.appendChild(document.createTextNode('End This Election'));

	undoButton = document.createElement('button');
	undoButton.appendChild(document.createTextNode('Undo'));
	undoButton.style.backgroundColor = backColor;
	undoButton.style.borderColor = foreColor;
	undoButton.style.display = 'none';
	undoButton.addEventListener('click', undoVote);

	nextPollButton = document.createElement('button');
	nextPollButton.appendChild(document.createTextNode('Next Election'));
	nextPollButton.style.backgroundColor = backColor;
	nextPollButton.style.borderColor = foreColor;
	nextPollButton.style.display = 'none';
	nextPollButton.addEventListener('click', function () {
		electionSlide.style.left = '-100%';
		this.disabled = true;
	});

	controls = document.createElement('div');
	controls.className = 'controls';
	controls.appendChild(undoButton);
	controls.appendChild(nextPollButton);

	electionSlide = document.createElement('div');
	electionSlide.className = 'slide';
	electionSlide.style.backgroundColor = backColor;
	electionSlide.style.color = foreColor;
	electionSlide.style.left = '100%';
	electionSlide.appendChild(candidateButtonGroup);
	electionSlide.appendChild(controls);

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(headingSlide);
	parentElement.appendChild(electionSlide);

	candidates.forEach(function (candidate, index) {
		createNewInterfaceCandidate(candidate, index);
	});

	width = (Math.floor(100 / interfaceCandidates.length) - 1) + '%';
	interfaceCandidates.forEach(function (interfaceCandidate) {
		interfaceCandidate.getCandidateButton().style.width = width;
	});

	centerElements();
	window.addEventListener('resize', centerElements);
}

function FirstInterface(givenDumpId) {
	'use strict';

	var dumpId = givenDumpId,

		xhr,
		data,

		interfacePolls = [],
		slides = [],
		currentSlide = 0,

		parentElement,
		navBar,
		navBarHeading,
		pollNameHeading,
		pollName,
		navBarButtonGroup,
		resetThisElectionButton,
		endThisElectionButton,

		introSlide,
		centeredContainer,
		welcomeHeading,
		messageHeading,
		startElectionsButton,

		resultsButton,
		resultsSlide,
		resultsTable,
		headerRow,
		officeNameTd,
		winnerTd,
		votesTd;
	
	function setNavColorsAndContents() {
		navBar.style.color = slides[currentSlide].style.backgroundColor;
		navBar.style.backgroundColor = slides[currentSlide].style.color;

		if (endThisElectionButton !== undefined) {
			navBarButtonGroup.removeChild(endThisElectionButton);
			navBarButtonGroup.removeChild(resetThisElectionButton);
			pollNameHeading.removeChild(pollName);
		}
		if (currentSlide > 0 && currentSlide < slides.length - 1) {
			resetThisElectionButton = interfacePolls[currentSlide - 1].getResetPollButton();

			navBarButtonGroup.appendChild(resetThisElectionButton);
			endThisElectionButton = interfacePolls[currentSlide - 1].getEndPollButton();
			navBarButtonGroup.appendChild(endThisElectionButton);

			pollName = document.createTextNode('- ' + interfacePolls[currentSlide - 1].getName() + ' Elections');
			pollNameHeading.appendChild(pollName);
		}
	}

	function nextSlide() {
		currentSlide += 1;
		slides[currentSlide - 1].style.left = '-100%';
		slides[currentSlide].style.left = '0%';

		setNavColorsAndContents();
	}

	function confirm(givenMessage, givenIfFunction, givenElseFunction) {
		var container,
			messageBox,
			message,
			messageText = document.createTextNode(givenMessage),
			controls,
			okButton,
			cancelButton;

		givenElseFunction = givenElseFunction || function () {};

		message = document.createElement('p');
		message.className = 'confirmMessage';
		message.appendChild(messageText);

		okButton = document.createElement('button');
		okButton.appendChild(document.createTextNode('Okay'));
		okButton.addEventListener('click', function () {
			parentElement.removeChild(container);
			givenIfFunction();
		});

		cancelButton = document.createElement('button');
		cancelButton.appendChild(document.createTextNode('Cancel'));
		cancelButton.addEventListener('click', function () {
			parentElement.removeChild(container);
			givenElseFunction();
		});

		controls = document.createElement('div');
		controls.className = 'confirmControls';
		controls.appendChild(okButton);
		controls.appendChild(cancelButton);

		messageBox = document.createElement('div');
		messageBox.className = 'confirmMessageBox';
		messageBox.appendChild(message);
		messageBox.appendChild(controls);

		container = document.createElement('div');
		container.className = 'confirmContainer';
		container.appendChild(messageBox);

		parentElement.appendChild(container);

		messageBox.style.top = (window.innerHeight - messageBox.offsetHeight) / 2 + "px";
		messageBox.style.left = (window.innerWidth - messageBox.offsetWidth) / 2 + "px";

		window.addEventListener('resize', function () {
			messageBox.style.top = (window.innerHeight - messageBox.offsetHeight) / 2 + "px";
			messageBox.style.left = (window.innerWidth - messageBox.offsetWidth) / 2 + "px";
		});
	}

	function createNewInterfacePoll(pollValue, index) {
		var tempInterfacePoll = new InterfacePoll(dumpId, pollValue, index);

		slides.push(tempInterfacePoll.getHeadingSlide());
		tempInterfacePoll.getNextPollButton().addEventListener('click', nextSlide);

		tempInterfacePoll.getEndPollButton().addEventListener('click', function () {
			this.disabled = true;
			confirm('This will end this election and no further votes will be registered. This cannot be undone. Continue?', function () {
				tempInterfacePoll.end();// <----------------------<--------------------
				if (currentSlide !== slides.length - 2) {
					tempInterfacePoll.getNextPollButton().style.display = 'inline-block';
				} else {
					tempInterfacePoll.getControls().appendChild(resultsButton);
				}
			}, function () {
				tempInterfacePoll.getEndPollButton().disabled = false;
			});
		});

		tempInterfacePoll.getResetPollButton().addEventListener('click', function () {
			this.disabled = true;
			confirm('This will reset all progress in the election for this office. This action cannot be undone. Continue?', function () {
				tempInterfacePoll.reset();
				tempInterfacePoll.getResetPollButton().disabled = false;
			}, function () {
				tempInterfacePoll.getResetPollButton().disabled = false;
			});
		});

		interfacePolls.push(tempInterfacePoll);
	}

	function adjustSlides() {
		slides.forEach(function (slide, index) {
			if (index > 0) {
				slide.style.left = '100%';
			} else {
				slide.style.left = '0%';
			}
		});
	}

	function centerElements() {
		centeredContainer.style.bottom = (window.innerHeight - centeredContainer.offsetHeight) / 2 + "px";
		resultsTable.style.bottom = (window.innerHeight - resultsTable.offsetHeight) / 2 + "px";
	}

	function prepSlidesAndNav() {
		slides.unshift(introSlide);
		slides.push(resultsSlide);

		introSlide.style.backgroundImage = 'url(\'' + data.image + '\')';
		resultsSlide.style.backgroundImage = 'url(\'' + data.image + '\')';
		welcomeHeading.appendChild(document.createTextNode('Welcome to the ' + data.name + ' elections'));
		messageHeading.appendChild(document.createTextNode(data.message));

		centerElements();
		adjustSlides();
		setNavColorsAndContents();
	}

	function displayResults() {
		interfacePolls.forEach(function (interfacePoll) {
			var tempTrs = [],
				tempPollNameTd;

			tempPollNameTd = document.createElement('td');
			tempPollNameTd.style.backgroundColor = interfacePoll.getBackColor();
			tempPollNameTd.style.color = interfacePoll.getForeColor();
			tempPollNameTd.appendChild(document.createTextNode(interfacePoll.getName()));
			tempPollNameTd.rowSpan = interfacePoll.getWinnerDetails().length;

			interfacePoll.getWinnerDetails().forEach(function (winnerDetails) {
				var tempTr = document.createElement('tr'),
					tempCandidateImage = document.createElement('img'),
					tempCandidateImageAndNameTd = document.createElement('td'),
					tempCandidateVotesTd = document.createElement('td');

				tempCandidateImage.src = winnerDetails.image || '/static/images/default.gif';

				tempCandidateImageAndNameTd.className = 'imageAndNameTd';
				tempCandidateImageAndNameTd.appendChild(tempCandidateImage);
				tempCandidateImageAndNameTd.appendChild(document.createTextNode(winnerDetails.name));

				tempCandidateVotesTd.appendChild(document.createTextNode(winnerDetails.votes));

				tempTr.appendChild(tempCandidateImageAndNameTd);
				tempTr.appendChild(tempCandidateVotesTd);
				tempTrs.push(tempTr);
			});

			tempTrs[0].insertBefore(tempPollNameTd, tempTrs[0].firstElementChild);
			tempTrs.forEach(function (tr) {
				resultsTable.appendChild(tr);
			});
		});
	}

	navBarHeading = document.createElement('h3');
	navBarHeading.className = 'navBarHeading';
	navBarHeading.appendChild(document.createTextNode('Edison'));

	pollName = document.createTextNode('');

	pollNameHeading = document.createElement('h3');
	pollNameHeading.className = 'pollNameHeading';
	pollNameHeading.appendChild(pollName);

	navBarButtonGroup = document.createElement('div');
	navBarButtonGroup.id = 'navBarButtonGroup';

	navBar = document.createElement('div');
	navBar.id = 'nav';
	navBar.appendChild(navBarHeading);
	navBar.appendChild(pollNameHeading);
	navBar.appendChild(navBarButtonGroup);

	startElectionsButton = document.createElement('button');
	startElectionsButton.className = 'startButton';
	startElectionsButton.style.color = '#000000';
	startElectionsButton.style.backgroundColor = '#FFFFFF';
	startElectionsButton.appendChild(document.createTextNode('Start Elections'));
	startElectionsButton.addEventListener('click', function () {
		nextSlide();
		this.disabled = true;
	});

	welcomeHeading = document.createElement('h1');

	messageHeading = document.createElement('h2');

	centeredContainer = document.createElement('div');
	centeredContainer.className = 'centeredContainer';
	centeredContainer.appendChild(welcomeHeading);
	centeredContainer.appendChild(messageHeading);
	centeredContainer.appendChild(startElectionsButton);

	introSlide = document.createElement('div');
	introSlide.className = 'slide';
	introSlide.id = 'introSlide';
	introSlide.style.backgroundColor = '#000000';
	introSlide.style.color = '#FFFFFF';
	introSlide.appendChild(centeredContainer);

	resultsButton = document.createElement('button');
	resultsButton.id = 'resultsButton';
	resultsButton.appendChild(document.createTextNode('See all results'));
	resultsButton.addEventListener('click', function () {
		displayResults();
		nextSlide();
		interfacePolls[interfacePolls.length - 1].getElectionSlide().style.left = '-100%';
	});

	officeNameTd = document.createElement('td');
	officeNameTd.appendChild(document.createTextNode('Office'));

	winnerTd = document.createElement('td');
	winnerTd.appendChild(document.createTextNode('Candidate'));

	votesTd = document.createElement('td');
	votesTd.appendChild(document.createTextNode('Votes'));

	headerRow = document.createElement('tr');
	headerRow.id = 'headerRow';
	headerRow.appendChild(officeNameTd);
	headerRow.appendChild(winnerTd);
	headerRow.appendChild(votesTd);

	resultsTable = document.createElement('table');
	resultsTable.id = 'resultsTable';
	resultsTable.appendChild(headerRow);

	resultsSlide = document.createElement('div');
	resultsSlide.className = 'slide';
	resultsSlide.id = 'resultsSlide';
	resultsSlide.style.backgroundColor = '#000000';
	resultsSlide.style.color = '#FFFFFF';
	resultsSlide.appendChild(resultsTable);

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(navBar);
	parentElement.appendChild(introSlide);
	parentElement.appendChild(resultsSlide);

	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			data.polls.forEach(function (poll, index) {
				createNewInterfacePoll(poll, index);
			});
			prepSlidesAndNav();
		}
	};
	xhr.open('GET', '/getcandidates', true);
	xhr.send();
}