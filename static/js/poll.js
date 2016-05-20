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
	} else {
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
	
	this.started = false;
	this.ended = false;
	
	this.undo = false;

	this.candidates = []; //reset
	this.totalVotes = 0;
	this.specificVotes = [];
	this.finalWinner = {};

	this.id = this.office.replace(/\s/g, "");

	this.statusId = this.id + "status";
	this.cand_class = this.id + "candidates";

	this.getTotalVotes = function () {
		return this.votes.length;
	};


	this.start_elections = function () {
		this.started = true;
		
		document.getElementByid(this.statusId).innerHTML = "Elections have begun!";
		var candidate_ui = document.getElementsByClassName(this.cand_class);
/* jshint loopfunc:true */
		for (var i = 0; i < candidate_ui.length; i++) {
			candidate_ui[i].id = "candidate_anim";
			candidate_ui[i].onclick = function () {
            	slide_map[elections.currentSlide-1].vote(childIndex(this));
            };
		}
		this.navBtnUpdate();
	};

	this.end_elections = function () {
		this.ended = true;
		
		id(this.statusId).innerHTML = "Elections have ended!";

		var candidate_ui = cl(this.cand_class);
		for (var i = 0; i < candidate_ui.length; i++) {
			candidate_ui[i].id = "";
			candidate_ui[i].onclick = function () {};
		}
		this.navBtnUpdate();
	};
	
	this.navBtnUpdate = function () {
		if (this.started === true) {
    		id("start").style.display = "none";
    		if (this.ended === true) {
    			id("end").style.display = "none";
    			id("decl").style.display = "inline-block";
    			id("undo").style.display = "none";
    		} else {
    			id("end").style.display = "inline-block";
    			id("decl").style.display = "none";
    			id("undo").style.display = "inline-block";
    			this.undoBtnUpdate();
    		}
    	} else {
    		id("start").style.display = "inline-block";
    		id("end").style.display = "none";
    		id("decl").style.display = "none";
    		id("undo").style.display = "none";
    	}
	};
	
	this.undoBtnUpdate = function () {
		if (this.votes.length === 0) {
			id("undo").className = "btn btn-warning btn-lg undo_btn disabled";
		} else if (this.votes.length == 1) {
			id("undo").className = "btn btn-warning btn-lg undo_btn";
		}
	};

	this.update_status = function () {
		if (this.votes.length == 1) {
			document.getElementByid(this.statusId).innerHTML = "1 vote has been registered.";
		} else {
			document.getElementByid(this.statusId).innerHTML = this.votes.length + " votes have been registered";
		}
	};

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
		this.undoBtnUpdate();
		this.update_status();
	};

	this.unvote = function (i) {
		this.specificVotes[i] = this.candidates[i].unvote();
		this.votes.pop();
	};

	this.undo = function () {
		this.unvote(this.votes[this.votes.length - 1]);
		this.undoBtnUpdate();
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

	document.getElementByid("votes" + candidate.id).innerHTML = candidate.votes;
}

function showIfWinner(candidate) {
	'use strict';

	if (candidate.isWinner) {
		document.getElementByid(candidate.id).classList.add("winner");
	} else {
		document.getElementByid(candidate.id).classList.remove("winner");
	}
	resetDisplayedVotes(candidate);
}