/*jslint browser: true*/
/*globals Poll, Candidate*/

function InterfacePoll(givenPollValue) {
	'use strict';

	var pollValue = givenPollValue,
		poll = new Poll(pollValue.candidates.length),

		interfaceCandidates = [];

	function createNewInterfaceCandidate(givenCandidateValue) {
		console.log(givenCandidateValue.name);
	}

	pollValue.candidates.forEach(function (candidate) {
		createNewInterfaceCandidate(candidate);
	});
}

function FirstInterface(givenDumpId) {
	'use strict';

	var dumpId = givenDumpId,

		xhr,
		data,

		interfacePolls = [];

	function createNewInterfacePoll(pollValue) {
		var tempInterfacePoll = new InterfacePoll(pollValue);
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