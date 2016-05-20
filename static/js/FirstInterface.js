/*jslint browser: true*/
/*globals Poll*/

function InterfaceCandidate(givenDumpId, givenCandidateValue, givenCandidate, givenForeColor, givenBackColor) {
	'use strict';

	var dumpId = givenDumpId,

		candidateValue = givenCandidateValue,
		candidate = givenCandidate,

		name = candidateValue.name,
		image = candidateValue.image,
		votes = candidateValue.votes = 0,

		foreColor = givenForeColor,
		backColor = givenBackColor,

		parentElement,
		candidateButton;

	this.getCandidateButton = function () {
		return candidateButton;
	};

	candidateButton = document.createElement('button');
	candidateButton.appendChild(document.createTextNode(name));
	candidateButton.addEventListener('click', function () {
		candidate.vote();
	});

	parentElement = document.getElementById('container');
	parentElement.appendChild(candidateButton);
}

function InterfacePoll(givenDumpId, givenPollValue, givenIndex) {
	'use strict';

	var dumpId = givenDumpId,
		id = dumpId.replace(/\s/g, '') + givenIndex,

		pollValue = givenPollValue,
		poll = new Poll(pollValue.candidates.length),

		name = pollValue.name,
		foreColor = pollValue.foreColor,
		backColor = pollValue.backColor,
		candidates = pollValue.candidates,

		interfaceCandidates = [],

		parentElement,
		headingSlide,
		electionSlide;

	headingSlide = document.createElement('div');

	electionSlide = document.createElement('div');
	electionSlide.id = id;

	parentElement = document.getElementById(dumpId);
	parentElement.appendChild(headingSlide);
	parentElement.appendChild(electionSlide);

	function createNewInterfaceCandidate(givenCandidateValue, index) {
		var tempInterfaceCandidate = new InterfaceCandidate(id, givenCandidateValue, pollValue.candidates[index]);

		tempInterfaceCandidate.getCandidateButton().addEventListener('click', function () {
			poll.addToVotes(index);
		});

		interfaceCandidates.push(tempInterfaceCandidate);
	}

	candidates.forEach(function (candidate, index) {
		createNewInterfaceCandidate(candidate, index);
	});
}

function FirstInterface(givenDumpId) {
	'use strict';

	var dumpId = givenDumpId,

		xhr,
		data,

		interfacePolls = [];

	function createNewInterfacePoll(pollValue, index) {
		var tempInterfacePoll = new InterfacePoll(dumpId, pollValue, index);
		interfacePolls.push(tempInterfacePoll);
	}

	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			data.polls.forEach(function (poll) {
				createNewInterfacePoll(poll);
			});
		}
	};
	xhr.open('GET', '/getcandidates', true);
	xhr.send();
}