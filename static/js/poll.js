/*jslint browser: true */
//defines an error

//defines a generic candidate
function Candidate(candidateNumber, pollNumber, details, office) {
	'use strict';

	//validate(office, group);

	//if (!nam) {
	//    throw new Err("No name specified");
	//}

	this.office = office;

	this.candidateNumber = candidateNumber;
	this.pollNumber = pollNumber;
	this.name = details.name;
	if (details.image === "") {
		this.image = "/candidateimages/default.gif";
	} else  {
		this.image = details.image;
	}
	this.votes = 0;

	this.isWinner = false;

	this.cl = "candidate " + /*this.group.replace(/\s/g, "") +*/ " " + this.office.replace(/\s/g, "");
	this.id = /*this.group.replace(/\s/g, "") +*/ this.office.replace(/\s/g, "") + this.candidateNumber;

	this.vote = function () {
		this.votes += 1;
		return this.votes;
	};

	this.unvote = function () {
		this.votes -= 1;
		return this.votes;
	};

	this.getVotes = function () {
		return this.votes;
	};

	this.getName = function () {
		return this.name;
	};
}

//defines a generic poll
function Poll(number, office, foreColor, backColor, message) {
	'use strict';

	//validate(details[0], details[1]);
	var candidateNumber = 0;
	this.votes = [];

	this.office = office;
	/*this.group = group;*/
	this.number = number;

	this.foreColor = foreColor;
	this.backColor = backColor;

	this.message = message;

	this.candidates = []; //reset
	this.totalVotes = 0;
	this.specificVotes = [];
	this.finalWinner = {};
	
	this.id = this.office.replace(/\s/g, "");
	
	this.startId = this.id + "start";
	this.undoId = this.id + "undo";
	this.endId = this.id + "end";
	this.statusId = this.id + "status";
	this.resultId = this.id + "result";
	this.cand_class = this.id + "candidates";
	
	this.getTotalVotes = function () {
		return this.votes.length;
	};
	
	this.ready_ui = function () {
		console.log("Attaching event handlers");
		Id(this.startId).onclick = function () {
			start_elections(this.dataset.number);
		};
		Id(this.undoId).style.display = "none";
		Id(this.endId).style.display = "none";
		Id(this.resultId).style.display = "none";
	};
	
	this.start_elections = function () {
		Id(this.statusId).innerHTML = "Elections have begun!";
		var candidate_ui = Cl(this.cand_class);
		Id(this.startId).style.display = "none";
		
		Id(this.undoId).style.display = "inline-block";
		Id(this.undoId).onclick = function () {
			undo_vote(this.dataset.number);
		}
		
		Id(this.endId).style.display = "inline-block";
		Id(this.endId).onclick = function () {
		if (confirm("This action will end the elections for this office. Are you sure?")) {
			end_elections(this.dataset.number)
			
		}
		}
		
		for (var i=0;i<candidate_ui.length;i++) {
			candidate_ui[i].id = "candidate_anim";
			candidate_ui[i].onclick = function () {
				vote_candidate(this.dataset.number,this.dataset.candNumber);
			}
		}
	}
	
	this.end_elections = function () {
		Id(this.statusId).innerHTML = "Elections have ended!";
		
		Id(this.endId).style.display = "none";
		Id(this.undoId).style.display = "none";
		
		Id(this.resultId).style.display = "inline-block";
		Id(this.resultId).onclick = function () {
			decl_result(this.dataset.number);
		}
		var candidate_ui = Cl(this.cand_class);
		for (var i=0;i<candidate_ui.length;i++) {
			candidate_ui[i].id = "";
			candidate_ui[i].onclick = function () {
			}
		}
		
	}
	
	this.update_status = function () {
		if (this.votes.length == 1) {
			Id(this.statusId).innerHTML = "1 vote has been registered.";
		} else {
			Id(this.statusId).innerHTML = this.votes.length + " votes have been registered";
		}
	}
	
	this.addCandidate = function (details) {
		this.candidates.push(new Candidate(candidateNumber, this.number, details, this.office));
		this.specificVotes.push(0);
		candidateNumber += 1;
	};

	this.vote = function (i) {
		this.specificVotes[i] = this.candidates[i].vote();
		this.evaluateWinner();
		this.votes.push(i);
		console.log("Voted for " + this.candidates[i].name + " in " + this.office + " office");
		if (this.votes.length == 1) {
			Id(this.undoId).className = "btn btn-warning btn-lg undo_btn"
			}
		this.update_status();
	};

	this.unvote = function (i) {
		this.specificVotes[i] = this.candidates[i].unvote();
		this.votes.pop();
	};

	this.undo = function () {
		this.unvote(this.votes[this.votes.length - 1]);
		if (this.votes.length == 0) {
			Id(this.undoId).className = "btn btn-warning btn-lg undo_btn disabled"
			}
		this.update_status();
	};

	this.getVotes = function () {
		return this.totalVotes;
	};

	this.evaluateWinner = function () {
		var winners = [],
			maxVotes = Math.max.apply(Math, this.specificVotes),
			candidate;

		this.candidates.forEach(
			function (candidate, i, arr) {
				if (candidate.getVotes() === maxVotes) {
					winners.push(candidate);
					candidate.isWinner = true;
				} else {
					candidate.isWinner = false;
				}
				if (winners.length === this.candidates.length) {
					winners = [];
					this.candidates.forEach(
						function (candidate1, j, arr1) {
							candidate1.isWinner = false;
						}
					);
				}
			},
			this
		);

		return winners;
	};

	this.declareWinner = function () {
		var winner = this.evaluateWinner();
		if (winner.length === 1) {
			this.finalWinner = winner[0];
			window.alert("The winner is " + winner[0].name);
			//fix interface (remove the window.alert())
			//to go to the next poll, maybe the Interface object or normal scripting JS should handle
		} else {
			window.alert("There has been a tie!");
			//fix interface (remove the window.alert(), add something to continue the vote, or a recount or something)
		}
	};

	this.getFinalWinner = function () {
		return this.finalWinner;
	};
}

function resetDisplayedVotes(candidate) {
	'use strict';

	document.getElementById("votes" + candidate.id).innerHTML = candidate.votes;
}

function showIfWinner(candidate) {
	'use strict';

	if (candidate.isWinner) {
		document.getElementById(candidate.id).classList.add("winner");
	} else {
		document.getElementById(candidate.id).classList.remove("winner");
	}
	resetDisplayedVotes(candidate);
}