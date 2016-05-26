/*jslint browser: true*/
/*globals FormData*/

function Candidate(givenIndex, givenPollIndex, givenDumpId, givenValue) {
	'use strict';

	var value = givenValue,

		parentElement,
		containerElement,

		img,
		imageBox,
		fileInput,
		backgroundTextBox,
		errorBox,

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

	function clearErrors() {
		while (errorBox.lastChild) {
			errorBox.removeChild(errorBox.lastChild);
		}
	}

	img = document.createElement('img');
	img.className = 'candidateImg';
	img.src = value.image || '/savedimages/default.gif';

	backgroundTextBox = document.createElement('button');
	backgroundTextBox.className = 'backgroundTextBox';
	if (!value.image) {
		backgroundTextBox.style.opacity = 1;
	}

	fileInput = document.createElement('input');
	fileInput.type = 'file';
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
				backgroundTextBox.removeChild(backgroundTextBox.lastChild);
				backgroundTextBox.appendChild(document.createTextNode('Update Image'));
				fileInput.title = 'Update Image';

				updateServer({
					'action': 'update',
					'update': 'image',
					'value': imagePath
				});
			}
		};
		xhr.send(formData);
	});

	if (value.image) {
		backgroundTextBox.appendChild(document.createTextNode('Update Image'));
		fileInput.title = 'Update Image';
	} else {
		backgroundTextBox.appendChild(document.createTextNode('Upload Image'));
		fileInput.title = 'Upload Image';
	}

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

		if (text === '') {
			clearErrors();
			errorBox.appendChild(document.createTextNode('Please do not leave this field empty. Otherwise, the candidate may not be stored correctly.'));
		} else if (!(/[\d\f\n\r\t\v_]/gi.test(text))) {
			updateServer({
				'action': 'update',
				'update': 'name',
				'value': this.value.trim()
			});
			clearErrors();
		} else {
			clearErrors();
			errorBox.appendChild(document.createTextNode('Please enter only Latin letters, periods and spaces. Otherwise, the name will not be stored correctly.'));
		}
	});

	this.deleteCandidateButton = document.createElement('button');
	this.deleteCandidateButton.appendChild(document.createTextNode('\u00D7'));
	this.deleteCandidateButton.title = 'Delete this candidate.';
	this.deleteCandidateButton.className = 'deleteCandidateButton';
	this.deleteCandidateButton.addEventListener('click', function () {
		parentElement.removeChild(containerElement);
		updateServer({
			'action': 'delete'
		});
	});

	containerElement = document.createElement('div');
	containerElement.className = 'candidateContainerElement';
	containerElement.appendChild(imageBox);
	containerElement.appendChild(this.deleteCandidateButton);
	containerElement.appendChild(errorBox);
	containerElement.appendChild(this.textBox);

	parentElement = document.getElementById(givenDumpId);
	parentElement.insertBefore(containerElement, parentElement.lastChild);
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
		deletePollButton,
		officeTextBox,
		messageTextBox,
		textBoxContainer,
		officeErrorBox,
		panel,
		panelHeading,
		panelBody,

		controls,
		foreColorDiv,
		foreColorInput,
		foreColorInputButton,
		backColorDiv,
		backColorInput,
		backColorInputButton,
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

	function updateForeColor(color) {
		foreColor = color;
		deletePollButton.style.color = foreColor;
		officeTextBox.style.borderBottomColor = foreColor;
		panelHeading.style.color = foreColor;
		foreColorInputButton.style.color = foreColor;
		backColorInputButton.style.color = foreColor;

		updateServer({
			'action': 'update',
			'update': 'foreColor',
			'value': foreColor
		});
	}

	function updateBackColor(color) {
		backColor = color;
		panelHeading.style.backgroundColor = backColor;
		foreColorInputButton.style.backgroundColor = backColor;
		backColorInputButton.style.backgroundColor = backColor;

		updateServer({
			'action': 'update',
			'update': 'backColor',
			'value': backColor
		});
	}

	function aCandidateIsEmpty() {
		var isEmpty = true;

		candidates.forEach(function (candidate) {
			isEmpty = isEmpty && !candidate.textBox.value.trim();
		});

		return isEmpty;
	}

	this.hasNoCandidates = function () {
		if ((candidates.length !== 0) && aCandidateIsEmpty()) {
			return candidates.length === 1;
		}


		return candidates.length === 0;
	};

	this.getOfficeTextBox = function () {
		return officeTextBox;
	};

	this.getDeletePollButton = function () {
		return deletePollButton;
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
					'votes': 0
				}
			});
		}

		tempCandidate.deleteCandidateButton.addEventListener('click', function () {
			candidates.splice(tempCandidate.getIndex(), 1);
			candidates.forEach(function (candidate, index) {
				candidate.setIndex(index);
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

	function clearErrors() {
		while (officeErrorBox.lastChild) {
			officeErrorBox.removeChild(officeErrorBox.lastChild);
		}
	}

	officeErrorBox = document.createElement('p');
	officeErrorBox.className = 'officeErrorBox';

	officeTextBox = document.createElement('input');
	officeTextBox.className = 'officeTextBox';
	officeTextBox.style.borderBottom = '1px solid ' + foreColor;
	officeTextBox.type = 'text';
	officeTextBox.placeholder = 'Enter a name.';
	officeTextBox.value = value.name || '';
	officeTextBox.addEventListener('input', function () {
		var text = this.value.replace(' ', '');

		if (text === '') {
			clearErrors();
			officeErrorBox.appendChild(document.createTextNode('Please do not leave this field empty. Otherwise, this office may not be stored correctly.'));
		} else if (!(/[\d\f\n\r\t\v_]/gi.test(text))) {
			updateServer({
				'action': 'update',
				'update': 'name',
				'value': this.value.trim()
			});
			clearErrors();
		} else {
			clearErrors();
			officeErrorBox.appendChild(document.createTextNode('Please enter only Latin letters, periods and spaces. Otherwise, the name will not be stored correctly.'));
		}
	});
	officeTextBox.addEventListener('focus', function () {
		this.style.borderColor = foreColor;
	});
	officeTextBox.addEventListener('mouseover', function () {
		this.style.borderColor = foreColor;
	});
	officeTextBox.addEventListener('blur', function () {
		this.style.borderColor = 'transparent';
		this.style.borderBottomColor = foreColor;
	});
	officeTextBox.addEventListener('mouseout', function () {
		this.style.borderColor = 'transparent';
		this.style.borderBottomColor = foreColor;
	});

	textBoxContainer = document.createElement('div');
	textBoxContainer.className = 'textBoxContainer';
	textBoxContainer.appendChild(officeTextBox);

	messageTextBox = document.createElement('input');
	messageTextBox.className = 'messageBox';
	messageTextBox.placeholder = 'Enter an optional message';
	messageTextBox.value = value.message;
	messageTextBox.addEventListener('input', function () {
		updateServer({
			'action': 'update',
			'update': 'message',
			'value': this.value
		});
	});
	messageTextBox.addEventListener('focus', function () {
		this.style.borderColor = foreColor;
	});
	messageTextBox.addEventListener('mouseover', function () {
		this.style.borderColor = foreColor;
	});
	messageTextBox.addEventListener('blur', function () {
		this.style.borderColor = 'transparent';
	});
	messageTextBox.addEventListener('mouseout', function () {
		this.style.borderColor = 'transparent';
	});

	deletePollButton = document.createElement('button');
	deletePollButton.className = 'deletePollButton';
	deletePollButton.style.color = foreColor;
	deletePollButton.appendChild(document.createTextNode('\u00D7'));
	deletePollButton.addEventListener('click', function () {
		parentElement.removeChild(panel);
		updateServer({
			'action': 'delete'
		});
	});

	panelHeading = document.createElement('div');
	panelHeading.className = 'panel-heading';
	panelHeading.style.backgroundColor = backColor;
	panelHeading.style.color = foreColor;
	panelHeading.appendChild(deletePollButton);
	panelHeading.appendChild(textBoxContainer);
	panelHeading.appendChild(messageTextBox);

	foreColorInputButton = document.createElement('button');
	foreColorInputButton.className = 'foreColorInputButton';
	foreColorInputButton.style.color = foreColor;
	foreColorInputButton.style.backgroundColor = backColor;
	foreColorInputButton.appendChild(document.createTextNode('Choose Foreground Color'));

	foreColorInput = document.createElement('input');
	foreColorInput.className = 'foreColorInput';
	foreColorInput.type = 'color';
	foreColorInput.value = '!';

	backColorInputButton = document.createElement('button');
	backColorInputButton.className = 'backColorInputButton';
	backColorInputButton.style.color = foreColor;
	backColorInputButton.style.backgroundColor = backColor;
	backColorInputButton.appendChild(document.createTextNode('Choose Background Color'));

	backColorInput = document.createElement('input');
	backColorInput.className = 'backColorInput';
	backColorInput.type = 'color';
	backColorInput.value = '!';

	if (foreColorInput.value === '!') {
		foreColorInput.type = 'text';
		foreColorInput.className += ' jscolor';
		foreColorInput.addEventListener('change', function () {
			updateForeColor('#' + this.value);
		});

		backColorInput.type = 'text';
		backColorInput.className += ' jscolor';
		backColorInput.addEventListener('change', function () {
			updateBackColor('#' + this.value);
		});
	} else {
		foreColorInput.value = foreColor;
		foreColorInput.addEventListener('change', function () {
			updateForeColor(this.value);
		});
		backColorInput.value = backColor;
		backColorInput.addEventListener('change', function () {
			updateBackColor(this.value);
		});
	}

	foreColorDiv = document.createElement('div');
	foreColorDiv.className = 'foreColorDiv';
	foreColorDiv.appendChild(foreColorInputButton);
	foreColorDiv.appendChild(foreColorInput);

	backColorDiv = document.createElement('div');
	backColorDiv.className = 'backColorDiv';
	backColorDiv.appendChild(backColorInputButton);
	backColorDiv.appendChild(backColorInput);

	addNewCandidateButton = document.createElement('button');
	addNewCandidateButton.className = 'addNewCandidateButton';
	addNewCandidateButton.appendChild(document.createTextNode('+'));
	addNewCandidateButton.title = 'Add a candidate';
	addNewCandidateButton.addEventListener('click', function () {
		addNewCandidate({});
	});

	controls = document.createElement('div');
	controls.appendChild(foreColorDiv);
	controls.appendChild(backColorDiv);
	controls.appendChild(addNewCandidateButton);

	panelBody = document.createElement('div');
	panelBody.className = 'panel-body';
	panelBody.id = id;
	panelBody.appendChild(officeErrorBox);
	panelBody.appendChild(controls);

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
			'message': '',
			'candidates': []
		},

		parentElement,
		addNewPollButton;

	function createOnServer() {
		var instruction = {
			'action': 'create',
			'value': blankValue
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
			isEmpty = isEmpty && (!poll.getOfficeTextBox().value.trim() || poll.hasNoCandidates());
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

		tempPoll.getDeletePollButton().addEventListener('click', function () {
			polls.splice(tempPoll.getIndex(), 1);
			polls.forEach(function (poll, index) {
				poll.setIndex(index);
			});
			if (aPollIsEmpty() && (polls.length !== 0)) {
				disableAddButton();
			} else {
				enableAddButton();
			}
		});

		tempPoll.getOfficeTextBox().addEventListener('input', function () {
			if (!this.value.trim() || aPollIsEmpty()) {
				disableAddButton();
			} else {
				enableAddButton();
			}
		});

		tempPoll.getCandidates().forEach(function (candidate) {
			candidate.textBox.addEventListener('input', function () {
				if (aPollIsEmpty()) {
					disableAddButton();
				} else {
					enableAddButton();
				}
			});
		});

		polls.push(tempPoll);
	}
	function createNameMessage(givenValue,givenDumpId) {
		var value = givenValue,

		parentElement,
		containerElement,

		img,
		imageBox,
		fileInput,
		backgroundTextBox,
		errorBox,messageTextBox,textBox,panel,panelBody,panelHeading;
		function updateServer(givenInstruction) {
		var xhr,
			instruction = givenInstruction;
		xhr = new XMLHttpRequest();
		xhr.open('POST', '/electionAction', true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(instruction));
	}

	function clearErrors() {
		while (errorBox.lastChild) {
			errorBox.removeChild(errorBox.lastChild);
		}
	}

	img = document.createElement('img');
	img.className = 'candidateImg';
	img.src = value.image || '/savedimages/default.gif';

	backgroundTextBox = document.createElement('button');
	backgroundTextBox.className = 'backgroundTextBox';
	if (!value.image) {
		backgroundTextBox.style.opacity = 1;
	}

	fileInput = document.createElement('input');
	fileInput.type = 'file';
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
				backgroundTextBox.removeChild(backgroundTextBox.lastChild);
				backgroundTextBox.appendChild(document.createTextNode('Update Image'));
				fileInput.title = 'Update Image';

				updateServer({
					'update': 'image',
					'value': imagePath
				});
			}
		};
		xhr.send(formData);
	});

	if (value.image) {
		backgroundTextBox.appendChild(document.createTextNode('Update Image'));
		fileInput.title = 'Update Image';
	} else {
		backgroundTextBox.appendChild(document.createTextNode('Upload Image'));
		fileInput.title = 'Upload Image';
	}

	imageBox = document.createElement('div');
	imageBox.className = 'imageBox';
	imageBox.appendChild(img);
	imageBox.appendChild(backgroundTextBox);
	imageBox.appendChild(fileInput);

	errorBox = document.createElement('p');
	errorBox.className = 'errorBox';

	textBox = document.createElement('input');
	textBox.className = 'textBox';
	textBox.type = 'text';
	textBox.placeholder = 'Enter a name.';
	textBox.value = value.name || '';
	textBox.addEventListener('input', function () {
		var text = this.value.replace(' ', '');

		if (text === '') {
			clearErrors();
			errorBox.appendChild(document.createTextNode('Please do not leave this field empty. Otherwise, the election name may not be stored correctly.'));
		} else if (!(/[\d\f\n\r\t\v_]/gi.test(text))) {
			updateServer({
				'update': 'name',
				'value': this.value.trim()
			});
			clearErrors();
		} else {
			clearErrors();
			errorBox.appendChild(document.createTextNode('Please enter only Latin letters, periods and spaces. Otherwise, the name will not be stored correctly.'));
		}
	});
	
	messageTextBox = document.createElement('input');
	messageTextBox.className = 'textBox';
	messageTextBox.placeholder = 'Enter an optional message';
	messageTextBox.value = value.message;
	messageTextBox.addEventListener('input', function () {
		updateServer({
			'update': 'message',
			'value': this.value
		});
	});
	containerElement = document.createElement('div');
	containerElement.appendChild(imageBox);
	containerElement.appendChild(errorBox);
	containerElement.appendChild(textBox);
	containerElement.appendChild(messageTextBox);
	
	panelHeading = document.createElement('div');
	panelHeading.className = 'panel-heading';
	panelHeading.appendChild(document.createTextNode('Election Details'));
	
	panelBody = document.createElement('div');
	panelBody.className = 'panel-body';
	panelBody.appendChild(containerElement);

	panel = document.createElement('div');
	panel.className = 'panel panel-primary';
	panel.appendChild(panelHeading);
	panel.appendChild(panelBody);

	parentElement = document.getElementById(givenDumpId);
	parentElement.insertBefore(panel, parentElement.lastChild);
	}

	addNewPollButton = document.createElement('button');
	addNewPollButton.className = 'addNewPollButton';
	addNewPollButton.title = 'Add an Office';
	addNewPollButton.appendChild(document.createTextNode('+'));
	addNewPollButton.addEventListener('click', function () {
		addNewPoll({});
	});
	
	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(addNewPollButton);

	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			createNameMessage(data,givenDumpId);
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