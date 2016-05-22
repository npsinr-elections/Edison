/*jslint browser: true*/
/*globals Poll*/

function InterfaceCandidate(givenDumpId, givenCandidateValue, givenCandidate, givenForeColor, givenBackColor) {
	'use strict';

	var dumpId = givenDumpId,

		candidateValue = givenCandidateValue,
		candidate = givenCandidate,

		name = candidateValue.name,
		image = candidateValue.image || '/candidateimages/default.gif',
		votes = candidateValue.votes = 0,

		foreColor = givenForeColor,
		backColor = givenBackColor,

		parentElement,
		candidateButton,
		candidateText,
		candidateName,
		candidateVotes;

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

	this.updateVotes = function () {
		candidateVotes.innerHTML = candidate.getVotes();
	};

	candidateName = document.createElement('div');
	candidateName.className = 'candidateName';
	candidateName.appendChild(document.createTextNode(name));

	candidateVotes = document.createElement('div');
	candidateVotes.className = 'candidateVotes';
	candidateVotes.appendChild(document.createTextNode('0'));

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
		candidateVotes.innerHTML = candidate.getVotes();
	});

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(candidateButton);
}

function InterfacePoll(givenDumpId, givenPollValue, givenIndex) {
	'use strict';

	var dumpId = givenDumpId,
		id = givenPollValue.name.replace(/\s/g, '') + givenIndex,

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
		endPollButton,
		undoButton,
		nextPollButton,

		width;

	this.getHeadingSlide = function () {
		return headingSlide;
	};

	this.getStartButton = function () {
		return startButton;
	};

	this.getEndPollButton = function () {
		return endPollButton;
	};

	this.getNextPollButton = function () {
		return nextPollButton;
	};

	function vote(givenIndex) {
		poll.addToVotes(givenIndex);
		poll.getWhetherLeaders().forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
		});
		votes += 1;
		if (votes === 1) {
			undoButton.style.display = 'inline-block';
		}
	}

	function undoVote() {
		poll.undo();
		poll.getWhetherLeaders().forEach(function (isLeader, index) {
			interfaceCandidates[index].setLeaderState(isLeader);
			interfaceCandidates[index].updateVotes();
		});
		votes -= 1;
		if (votes === 0) {
			undoButton.style.display = 'none';
		}
	}

	function centerAndResizeElements() {
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
		poll.getWhetherLeaders().forEach(function (isLeader, index) {
			interfaceCandidates[index].removeIfNotLeader(isLeader);

		});
		winnerDeclaration.appendChild(document.createTextNode('We Have a Winner!'));
	}

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

	endPollButton = document.createElement('button');
	endPollButton.className = 'endPollButton';
	endPollButton.style.backgroundColor = backColor;
	endPollButton.style.color = foreColor;
	endPollButton.style.display = 'none';
	endPollButton.appendChild(document.createTextNode('End This Election'));
	endPollButton.addEventListener('click', function () {
		this.style.display = 'none';
		undoButton.style.display = 'none';
		declareResults();
		centerAndResizeElements();
	});

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

	centerAndResizeElements();
	window.addEventListener('resize', centerAndResizeElements);
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
		navBarButtonGroup,
		endThisElectionButton;

	function showNavBar() {
		navBar.style.opacity = 1;
	}

	function hideNavBar() {
		navBar.style.opacity = 0;
	}

	function setNavColorsAndContents() {
		navBar.style.color = slides[currentSlide].style.backgroundColor;
		navBar.style.backgroundColor = slides[currentSlide].style.color;

		if (endThisElectionButton !== undefined) {
			navBarButtonGroup.removeChild(endThisElectionButton);
		}
		endThisElectionButton = interfacePolls[currentSlide].getEndPollButton();
		navBarButtonGroup.appendChild(endThisElectionButton);
	}

	function nextSlide() {
		currentSlide += 1;
		slides[currentSlide].style.left = '0%';
		showNavBar();
		setNavColorsAndContents();
	}

	function createNewInterfacePoll(pollValue, index) {
		var tempInterfacePoll = new InterfacePoll(dumpId, pollValue, index);

		slides.push(tempInterfacePoll.getHeadingSlide());
		tempInterfacePoll.getStartButton().addEventListener('click', function () {
			setTimeout(hideNavBar, 500);
			tempInterfacePoll.getEndPollButton().style.display = 'inline-block';
		});
		tempInterfacePoll.getNextPollButton().addEventListener('click', nextSlide);
		tempInterfacePoll.getEndPollButton().addEventListener('click', function () {
			if (currentSlide !== slides.length - 1) {
				tempInterfacePoll.getNextPollButton().style.display = 'inline-block';
			}
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

	navBarHeading = document.createElement('h3');
	navBarHeading.appendChild(document.createTextNode('Edison'));

	navBarButtonGroup = document.createElement('div');
	navBarButtonGroup.id = 'navBarButtonGroup';

	navBar = document.createElement('div');
	navBar.id = 'nav';
	navBar.appendChild(navBarHeading);
	navBar.appendChild(navBarButtonGroup);

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(navBar);

	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			data.polls.forEach(function (poll, index) {
				createNewInterfacePoll(poll, index);
			});
			adjustSlides();
			setNavColorsAndContents();
		}
	};
	xhr.open('GET', '/getcandidates', true);
	xhr.send();
}