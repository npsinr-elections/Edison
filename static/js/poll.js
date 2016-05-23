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

	this.reset = function () {
		votes = 0;
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

	this.getWhetherLeaders = function (isAllTieNotAllowed) {
		var leaders = [],
			scores = [],
			max = 0,
			noOfLeaders = 0;

		candidates.forEach(function (candidate) {
			scores.push(candidate.getVotes());
		});
		max = Math.max.apply(null, scores);
		candidates.forEach(function (candidate, index) {
			if (candidate.getVotes() === max) {
				leaders.push(true);
				noOfLeaders += 1;
			} else {
				leaders.push(false);
			}
		});
		if (isAllTieNotAllowed && noOfLeaders === candidates.length) {
			leaders = [];
			candidates.forEach(function () {
				leaders.push(false);
			});
		}

		return leaders;
	};

	this.getWinnerIndexes = function () {
		var scores = [],
			indexes = [],
			max = 0;

		candidates.forEach(function (candidate) {
			scores.push(candidate.getVotes());
		});
		max = Math.max.apply(null, scores);
		candidates.forEach(function (candidate, index) {
			if (candidate.getVotes() === max) {
				indexes.push(index);
			}
		});
		return indexes;
	};

	this.reset = function () {
		votes = [];
		candidates.forEach(function (candidate) {
			candidate.reset();
		});
	};
}