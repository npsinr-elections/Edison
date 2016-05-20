function Candidate() {
	'use strict';

	var votes = 0;

	this.vote = function () {
		votes += 1;
	};

	this.unvote = function () {
		votes -= 1;
	};

	this.getVotes = function () {
		return votes;
	};
}

function Poll(noOfCandidates) {
	'use strict';

	var i,
		candidates = [],
		votes = [];

	for (i = 0; i < noOfCandidates; i += 1) {
		candidates.push(new Candidate());
	}

	this.getCandidates = function () {
		return candidates;
	};

	this.addToVotes = function (i) {
		votes.push(candidates[i]);
	};

	this.undo = function () {
		var candidate = votes.pop();
		candidate.unvote();
	};
}