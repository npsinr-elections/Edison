/*jslint browser: true*/
/*globals
	FormData
*/

function Candidate(givenIndex, givenPollIndex, givenDumpId, givenValue, s) {
	'use strict';

	var value = givenValue,

		parentElement,
		containerElement,

		img,
		imageBox,
		fileInput,
		backgroundTextBox,
		errorBox,
		textBox,

		candidateIndex = givenIndex,
		pollIndex = givenPollIndex;

	this.setIndex = function (i) {
		candidateIndex = i;
	};

	this.getIndex = function () {
		return candidateIndex;
	};

	function updateServer(givenInstruction) {
		var xhr,
			instruction = givenInstruction;

		instruction.pollIndex = pollIndex;
		instruction.candidateIndex = candidateIndex;

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/candidateAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}

	img = document.createElement('img');
	img.className = 'candidateImg';
	img.src = value.image || '/candidateimages/default.gif';

	backgroundTextBox = document.createElement('button');
	backgroundTextBox.innerHTML = 'Upload Image';
	backgroundTextBox.className = 'backgroundTextBox';
	if (!value.image) {
		backgroundTextBox.style.opacity = 1;
	}

	fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.innerHTML = 'Update Image';
	fileInput.className = 'fileInput';
	fileInput.addEventListener('change', function () {
		var formData,
			xhr,
			image,
			imagePath;

		image = this.files[0];

		formData = new FormData();
		formData.append('file', image);

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/uploadimage', true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				imagePath = xhr.responseText;
				value.image = imagePath;
				img.src = imagePath;
				backgroundTextBox.removeAttribute('style');
				backgroundTextBox.innerHTML = 'Update Image';

				updateServer({
					'action': 'update',
					'update': 'image',
					'value': imagePath
				});
			}
		};
		xhr.send(formData);
	});

	imageBox = document.createElement('div');
	imageBox.className = 'imageBox';
	imageBox.appendChild(img);
	imageBox.appendChild(backgroundTextBox);
	imageBox.appendChild(fileInput);

	errorBox = document.createElement('p');
	errorBox.className = 'errorBox';

	this.textBox = document.createElement('input');
	this.textBox.className = 'textBox';
	this.textBox.type = 'text';
	this.textBox.placeholder = 'Enter a name.';
	this.textBox.value = value.name || '';
	this.textBox.addEventListener('input', function () {
		var text = this.value.replace(' ', '');

		if (!(/[\d\f\n\r\t\v_]/gi.test(text))) {
			updateServer({
				'action': 'update',
				'update': 'name',
				'value': this.value.trim()
			});
			errorBox.innerHTML = '';
		} else {
			errorBox.innerHTML = 'Please enter only Latin letters, periods and spaces. Otherwise, the name will not be stored correctly.';
		}
	});

	this.deleteCandidateButton = document.createElement('button');
	this.deleteCandidateButton.innerHTML = '&#10799;';
	this.deleteCandidateButton.title = 'Delete this candidate.';
	this.deleteCandidateButton.className = 'deleteCandidateButton';

	containerElement = document.createElement('div');
	containerElement.className = 'candidateContainerElement';
	containerElement.appendChild(imageBox);
	containerElement.appendChild(this.deleteCandidateButton);
	containerElement.appendChild(errorBox);
	containerElement.appendChild(this.textBox);

	parentElement = document.getElementById(givenDumpId);
	parentElement.insertBefore(containerElement, parentElement.lastChild);

	this.deleteCandidateButton.addEventListener('click', function () {
		parentElement.removeChild(containerElement);
		updateServer({
			'action': 'delete'
		});
	});
}

function Poll(givenIndex, givenDumpId, givenValue) {
	'use strict';

	var value = givenValue,
		candidates = [],
		office = value.name || '',
		foreColor = value.foreColor || '#FFFFFF',
		backColor = value.backColor || '#000000',
		index = givenIndex,

		dumpId = givenDumpId,
		id = office.replace(/\s/g, '') + index,

		parentElement,
		officeErrorBox,
		panel,
		panelHeading,
		panelBody,
		addNewCandidateButton;

	this.setIndex = function (i) {
		index = i;
	};

	this.getIndex = function () {
		return index;
	};

	this.getCandidates = function () {
		return candidates;
	};

	function updateServer(givenInstruction) {
		var xhr,
			instruction = givenInstruction;

		instruction.pollIndex = index;

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/pollAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}

	function enableAddButton() {
		addNewCandidateButton.disabled = false;
		addNewCandidateButton.title = 'Add a candidate.';
	}

	function disableAddButton() {
		addNewCandidateButton.disabled = true;
		addNewCandidateButton.title = 'Please fill in the names of all the candidates first.';
	}

	function aCandidateIsEmpty() {
		var isEmpty = true;

		candidates.forEach(function (candidate) {
			isEmpty = isEmpty && !candidate.textBox.value.trim();
		});

		return isEmpty;
	}

	this.aCandidateIsEmpty = function () {
		return aCandidateIsEmpty();
	};

	this.hasNoCandidates = function () {
		if ((candidates.length !== 0) && aCandidateIsEmpty()) {
			return candidates.length === 1;
		}


		return candidates.length === 0;
	};

	function addNewCandidate(candidateValue) {
		var tempCandidate = new Candidate(candidates.length, index, id, candidateValue);

		if (!candidateValue.name) {
			disableAddButton();
			updateServer({
				'action': 'createCandidate',
				'value': {
					'name': '',
					'image': '',
					'votes': ''
				}
			});
		}

		tempCandidate.deleteCandidateButton.addEventListener('click', function () {
			candidates.splice(tempCandidate.getIndex(), 1);
			candidates.forEach(function (candidate, index) {
				candidates[index].setIndex(index);
			});
			if (aCandidateIsEmpty() && (candidates.length !== 0)) {
				disableAddButton();
			} else {
				enableAddButton();
			}
		});

		tempCandidate.textBox.addEventListener('input', function () {
			if (!this.value.trim() || aCandidateIsEmpty()) {
				disableAddButton();
			} else {
				enableAddButton();
			}
		});
		candidates.push(tempCandidate);
	}

	officeErrorBox = document.createElement('p');
	officeErrorBox.className = 'officeErrorBox';

	this.officeTextBox = document.createElement('input');
	this.officeTextBox.className = 'officeTextBox';
	this.officeTextBox.type = 'text';
	this.officeTextBox.placeholder = 'Enter a name.';
	this.officeTextBox.value = value.name || '';
	this.officeTextBox.addEventListener('input', function () {
		var text = this.value.replace(' ', '');

		if (text === '') {
			officeErrorBox.innerHTML = 'Please do not leave this field empty. Otherwise, this office may not be stored correctly.';
		} else if (!(/[\d\f\n\r\t\v_]/gi.test(text))) {
			updateServer({
				'action': 'update',
				'update': 'name',
				'value': this.value.trim()
			});
			officeErrorBox.innerHTML = '';
		} else {
			officeErrorBox.innerHTML = 'Please enter only Latin letters, periods and spaces. Otherwise, the name will not be stored correctly.';
		}
	});

	this.deletePollButton = document.createElement('button');
	this.deletePollButton.className = 'deletePollButton';
	this.deletePollButton.innerHTML = '&#10799;';
	this.deletePollButton.addEventListener('click', function () {
		parentElement.removeChild(panel);
		updateServer({
			'action': 'delete'
		});
	});

	panelHeading = document.createElement('div');
	panelHeading.className = 'panel-heading';
	panelHeading.style.backgroundColor = backColor;
	panelHeading.style.color = foreColor;
	panelHeading.appendChild(this.deletePollButton);
	panelHeading.appendChild(this.officeTextBox);

	addNewCandidateButton = document.createElement('button');
	addNewCandidateButton.className = 'addNewCandidateButton';
	addNewCandidateButton.innerHTML = '+';
	addNewCandidateButton.title = 'Add a candidate';
	addNewCandidateButton.addEventListener('click', function () {
		addNewCandidate({});
	});

	panelBody = document.createElement('div');
	panelBody.className = 'panel-body';
	panelBody.id = id;
	panelBody.appendChild(officeErrorBox);
	panelBody.appendChild(addNewCandidateButton);

	panel = document.createElement('div');
	panel.className = 'panel panel-default';
	panel.appendChild(panelHeading);
	panel.appendChild(panelBody);

	parentElement = document.getElementById(dumpId);
	parentElement.insertBefore(panel, parentElement.lastChild);

	value.candidates.forEach(function (candidateValue) {
		addNewCandidate(candidateValue);
	});
}

function Interface(givenDumpId) {
	'use strict';

	var dumpId = givenDumpId,
		xhr,
		data,
		polls = [],
		blankValue = {
			'name': '',
			'foreColor': '',
			'backColor': '',
			'candidates': []
		},

		parentElement,
		addNewPollButton;

	function createOnServer() {
		var instruction = {
			'action': 'create',
			'value': {
				'name': '',
				'foreColor': '',
				'backColor': '',
				'candidates': []
			}
		};

		xhr = new XMLHttpRequest();
		xhr.open('POST', '/pollAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}

	function enableAddButton() {
		addNewPollButton.disabled = false;
		addNewPollButton.title = 'Add an office';
	}

	function disableAddButton() {
		addNewPollButton.disabled = true;
		addNewPollButton.title = 'Please write the name of each office and add at least one candidate to each';
	}

	function aPollIsEmpty() {
		var isEmpty = true;

		polls.forEach(function (poll) {
			isEmpty = isEmpty && (!poll.officeTextBox.value.trim() || poll.hasNoCandidates());
		});

		return isEmpty;
	}

	function addNewPoll(pollValue) {
		var tempPoll;

		if (!pollValue.name) {
			tempPoll = new Poll(polls.length, dumpId, blankValue);
			disableAddButton();
			createOnServer();
		} else {
			tempPoll = new Poll(polls.length, dumpId, pollValue);
		}

		tempPoll.deletePollButton.addEventListener('click', function () {
			polls.splice(tempPoll.getIndex(), 1);
			polls.forEach(function (poll, index) {
				polls[index].setIndex(index);
			});
			if (aPollIsEmpty() && (polls.length !== 0)) {
				disableAddButton();
			} else {
				enableAddButton();
			}
		});

		tempPoll.officeTextBox.addEventListener('input', function () {
			if (!this.value.trim() || aPollIsEmpty()) {
				disableAddButton();
			} else {
				enableAddButton();
			}
		});

		tempPoll.getCandidates().forEach(function (candidate) {
			candidate.textBox.addEventListener('input', function () {
				if (tempPoll.hasNoCandidates()) {
					disableAddButton();
				} else {
					enableAddButton();
				}
			});
		});

		polls.push(tempPoll);
	}

	addNewPollButton = document.createElement('button');
	addNewPollButton.className = 'addNewPollButton';
	addNewPollButton.innerHTML = '+';
	addNewPollButton.addEventListener('click', function () {
		addNewPoll({});
	});

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(addNewPollButton);

	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			data.polls.forEach(function (pollValue, index) {
				addNewPoll(pollValue);
			});
		}
	};
	xhr.open('GET', '/getcandidates', true);
	xhr.send();
}

function exit() {
	'use strict';

	var xhr;

	xhr = new XMLHttpRequest();
	xhr.open('POST', '/exit', true);
	xhr.send();
}

window.addEventListener('unload', exit);
window.addEventListener('beforeunload', function (event) {
	'use strict';

	event.returnValue = 'All candidates without a name entered, and all office without both a name and a candidate will be deleted. Continue?';
	exit();
});