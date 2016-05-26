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
		candidateName;

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

	this.updateVotes = function () {};

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

	candidateText = document.createElement('div');
	candidateText.className = 'candidateText';
	candidateText.style.backgroundColor = backColor;
	candidateText.appendChild(candidateName);

	candidateButton = document.createElement('button');
	candidateButton.className = 'candidateButton';
	candidateButton.style.backgroundColor = foreColor;
	candidateButton.style.backgroundImage = 'url(\'' + image + '\')';
	candidateButton.style.borderColor = foreColor;
	candidateButton.appendChild(candidateText);
	candidateButton.addEventListener('click', function () {
		candidate.vote();
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
		ended = pollValue.ended,

		interfaceCandidates = [],
		votes = 0,

		parentElement,

		started = false,

		electionSlide,
		candidateButtonGroup,

		controls,
		previousButton,
		nextButton,

		width;

	function updateEnded(value) {
		var xhr,
			instruction = {
				'action': 'update',
				'update': 'ended',
				'value': value
			};

		instruction.pollIndex = pollIndex;

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/pollAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}

	this.updateServer = function () {
		var xhr,
			instructions = {};

		instructions.pollIndex = pollIndex;
		instructions.candidateIndex = poll.getWinnerIndexes()[0];

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/voteCandidates', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instructions));
	};

	function vote(givenIndex) {
		poll.addToVotes(givenIndex);
		poll.getWhetherLeaders(true).forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
		});
		votes += 1;
	}

	function undoVote() {
		poll.undo();
		poll.getWhetherLeaders(true).forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
			interfaceCandidates[index].updateVotes();
		});
		votes -= 1;
	}

	function centerElements() {
		candidateButtonGroup.style.bottom = (window.innerHeight - candidateButtonGroup.offsetHeight) / 2 + "px";
	}

	function createNewInterfaceCandidate(givenCandidateValue, index) {
		var tempInterfaceCandidate = new InterfaceCandidate(id, givenCandidateValue, poll.getCandidates()[index], foreColor, backColor);

		tempInterfaceCandidate.getCandidateButton().addEventListener('click', function () {
			if (votes !== 0) {
				undoVote();
			}
			vote(index);
			nextButton.style.display = 'inline-block';
		});

		interfaceCandidates.push(tempInterfaceCandidate);
	}

	this.getCandidateButtons = function () {
		var candidateButtons = [];
		interfaceCandidates.forEach(function (interfaceCandidate) {
			candidateButtons.push(interfaceCandidate.getCandidateButton());
		});
		return candidateButtons;
	};

	this.getElectionSlide = function () {
		return electionSlide;
	};

	this.getEnded = function () {
		return ended;
	};

	this.getForeColor = function () {
		return foreColor;
	};

	this.getBackColor = function () {
		return backColor;
	};

	this.getControls = function () {
		return controls;
	};

	this.getNextButton = function () {
		return nextButton;
	};

	this.getPreviousButton = function () {
		return previousButton;
	};

	this.getName = function () {
		return name;
	};

	this.getWinnerDetails = function () {
		var indexes = poll.getWinnerIndexes(),
			winnerDetails = [];

		indexes.forEach(function (index) {
			winnerDetails.push(interfaceCandidates[index].getCandidateDetails());
		});

		return winnerDetails;
	};

	candidateButtonGroup = document.createElement('div');
	candidateButtonGroup.className = 'candidateButtonGroup';
	candidateButtonGroup.id = id;

	nextButton = document.createElement('button');
	nextButton.appendChild(document.createTextNode('Next'));
	nextButton.style.backgroundColor = backColor;
	nextButton.style.borderColor = foreColor;
	nextButton.style.display = 'none';
	nextButton.addEventListener('click', function () {
		electionSlide.style.left = '-100%';
	});

	previousButton = document.createElement('button');
	previousButton.appendChild(document.createTextNode('Previous'));
	previousButton.style.backgroundColor = backColor;
	previousButton.style.borderColor = foreColor;
	previousButton.style.display = 'none';
	previousButton.addEventListener('click', function () {
		electionSlide.style.left = '100%';
	});

	controls = document.createElement('div');
	controls.className = 'controls';
	controls.appendChild(previousButton);
	controls.appendChild(nextButton);

	electionSlide = document.createElement('div');
	electionSlide.className = 'slide';
	electionSlide.style.backgroundColor = backColor;
	electionSlide.style.color = foreColor;
	electionSlide.appendChild(candidateButtonGroup);
	electionSlide.appendChild(controls);

	parentElement = document.getElementById(dumpId);
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
		navBarHomeLink,
		pollNameHeading,
		pollName,
		navBarButtonGroup,
		submitButton,
		nextPersonDiv,
		nextPersonHeading,
		jsonDownload,
		reloadPage;

	function setNavColorsAndContents() {
		navBar.style.color = slides[currentSlide].style.backgroundColor;
		navBar.style.backgroundColor = slides[currentSlide].style.color;
		pollNameHeading.removeChild(pollName);
		pollName = document.createTextNode('- ' + interfacePolls[currentSlide].getName());
		pollNameHeading.appendChild(pollName);

		if (currentSlide > 0) {
			interfacePolls[currentSlide].getPreviousButton().style.display = 'inline-block';
		}
		if (currentSlide === slides.length - 1) {
			interfacePolls[currentSlide].getControls().removeChild(interfacePolls[currentSlide].getNextButton());
			interfacePolls[currentSlide].getControls().appendChild(submitButton);

			interfacePolls[currentSlide].getCandidateButtons().forEach(function (candidateButton) {
				candidateButton.addEventListener('click', function () {
					submitButton.style.display = 'inline-block';
				});
			});
		}
	}

	function nextSlide() {
		currentSlide += 1;
		slides[currentSlide].style.left = '0%';

		setNavColorsAndContents();
	}

	function previousSlide() {
		currentSlide -= 1;
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

		slides.push(tempInterfacePoll.getElectionSlide());

		tempInterfacePoll.getNextButton().addEventListener('click', nextSlide);
		tempInterfacePoll.getPreviousButton().addEventListener('click', previousSlide);

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

	function prepSlidesAndNav() {
		adjustSlides();
		setNavColorsAndContents();
	}

	navBarHeading = document.createElement('h3');
	navBarHeading.className = 'navBarHeading';

	navBarHomeLink = document.createElement('a');
	navBarHomeLink.href = "/";
	navBarHomeLink.appendChild(document.createTextNode('NPS Indiranagar Elections'));

	navBarHeading.appendChild(navBarHomeLink);

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

	jsonDownload = document.createElement('button');
	jsonDownload.className = "postvotebutton";
	jsonDownload.style.backgroundColor = "#000";
	jsonDownload.addEventListener('click', function () {
		window.open('/json/download');
		window.location = "http://localhost:8080/downloadComplete";
	});
	jsonDownload.appendChild(document.createTextNode("Download Data"));

	reloadPage = document.createElement('button');
	reloadPage.className = "postvotebutton";
	reloadPage.style.backgroundColor = "#00cc66";
	reloadPage.addEventListener('click', function () {
		location.href = '/elections'
	});
	reloadPage.appendChild(document.createTextNode("Next Candidate"));

	nextPersonHeading = document.createElement('h1');
	nextPersonHeading.style.color = '#00cc66';
	nextPersonHeading.appendChild(document.createTextNode("Thank You for voting :)"));
	nextPersonHeading.appendChild(document.createElement('br'));
	nextPersonHeading.appendChild(document.createTextNode("Next Voter Please."));
	nextPersonHeading.appendChild(document.createElement('br'));
	nextPersonHeading.appendChild(reloadPage);
	nextPersonHeading.appendChild(document.createElement('br'));
	nextPersonHeading.appendChild(jsonDownload);

	nextPersonDiv = document.createElement('div');
	nextPersonDiv.style.backgroundColor = '#ffffff';
	nextPersonDiv.style.position = 'fixed';
	nextPersonDiv.style.top = '0em';
	nextPersonDiv.style.bottom = '0em';
	nextPersonDiv.style.left = '0em';
	nextPersonDiv.style.right = '0em';
	nextPersonDiv.style.zIndex = 999999;
	nextPersonDiv.style.display = 'none';
	nextPersonDiv.appendChild(nextPersonHeading);

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(navBar);
	parentElement.appendChild(nextPersonDiv);

	submitButton = document.createElement('button');
	submitButton.appendChild(document.createTextNode('Submit'));
	submitButton.style.backgroundColor = '#000000';
	submitButton.style.display = 'none';
	submitButton.addEventListener('click', function () {
		confirm('Are you sure you want to submit your votes?', function () {
			nextPersonDiv.style.display = 'block';
			interfacePolls.forEach(function (interfacePoll, index) {
				interfacePoll.updateServer();
			});

		});
	});

	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			data.polls.forEach(function (poll, index) {
				createNewInterfacePoll(poll, index);
			});
			interfacePolls.forEach(function (tempInterfacePoll, index) {
				if (tempInterfacePoll.getEnded()) {
					if (index !== slides.length - 1) {
						tempInterfacePoll.getNextPollButton().style.display = 'inline-block';
					}
				}
			});
			prepSlidesAndNav();
		}
	};
	xhr.open('GET', '/getcandidates', true);
	xhr.send();
}