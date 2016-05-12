/*jslint browser: true */
//defines an error

//defines a generic candidate
function Candidate(candidateNumber, pollNumber, details, office, group) {
    'use strict';

    //validate(office, group);

    //if (!nam) {
    //    throw new Err("No name specified");
    //}

    this.office = office;
	
    this.group = group;

    this.candidateNumber = candidateNumber;
    this.pollNumber = pollNumber;
    this.name = details.name;
    this.image = details.image;
    this.votes = 0;

    this.isWinner = false;

    this.cl = "candidate " + /*this.group.replace(/\s/g, "") +*/ " " + this.office.replace(/\s/g, "");
    this.id = /*this.group.replace(/\s/g, "") +*/ this.office.replace(/\s/g, "") + this.candidateNumber;

    this.dumpString = "<button id=\"" + this.id + "\"" + //sets the id
        "class=\"" + this.cl + "\"" + //sets the class
        "data-candidate-number=\"" + this.candidateNumber + "\"" + //sets data-candidate-number
        "data-poll-number=\"" + this.pollNumber + "\"" +
		"style=\"background-image:url(\'" + this.image + "\');\"" +
        ">" + //ends the starting tag
        "<div class=\"candidateContent\">" +this.name + //sets the content
        "<div id=\"votes" + this.id + "\">" + this.votes + "</div>" +
        "</button>"; //ends the button

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
function Poll(number, /*group,*/ office) {
    'use strict';

    //validate(details[0], details[1]);
    var candidateNumber = 0,
        votes = [];

    this.office = office;
    /*this.group = group;*/
    this.number = number;

    this.candidates = []; //reset
    this.totalVotes = 0;
    this.specificVotes = [];
    this.finalWinner = {};

    this.cl = "poll " + /*this.group.replace(" ", "");*/ this.office.replace(/\s/g, "");
    this.id = /*this.group.replace(' ', '') +*/ this.office.replace(/\s/g, "");
//		var headingTag = document.createElement("h2");
//		headingTag.innerHTML = office;
    this.dumpString = "<h2>" + this.office + "</h2><div id=\"" + this.id + "\"" + //sets the id
        "class=\"" + this.cl + "\"" + //sets the class
        "data-poll-number=\"" + this.number + "\">" + //sets data-poll-number
        "<div class=\"floaters\">" +
        "<button disabled=\"true\" class=\"undo\" id=\"undo" + this.id + "\">" + //adds undo button
        "Undo" +
        "</button>" +
        "<button class=\"end\" id=\"end" + this.id + "\">" + //adds end button
        "End" +
        "</button>" +
        "</div>" +
        "</div>"; //ends the div

    this.dump = function (id) {
//    		document.getElementById(id).appendChild(headingTag);
        document.getElementById(id).innerHTML += this.dumpString;

        this.candidates.forEach(
            function (candidate, i, arr) {
                document.getElementById(this.id).innerHTML += candidate.dumpString;
            },
            this
        );
    };

    this.getTotalVotes = function () {
        return votes.length;
    };

    this.addCandidate = function (details) {
        this.candidates.push(new Candidate(candidateNumber, this.number, details, this.office, this.group));
        this.specificVotes.push(0);
        candidateNumber += 1;
    };

    this.vote = function (i) {
        this.specificVotes[i] = this.candidates[i].vote();
        this.evaluateWinner();
        votes.push(i);
    };

    this.unvote = function (i) {
        this.specificVotes[i] = this.candidates[i].unvote();
        this.evaluateWinner();
        votes.pop();
    };
    
    this.undo = function () {
        this.unvote(votes[votes.length - 1]);
        this.evaluateWinner();
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

function Interface(/*electionId, */dumpId, data) {

    'use strict';
    var i = 0,
        data,
        polls = [];

    this.electionId = electionId;
    this.dumpId = dumpId;

    this.set = function () {


        var group,
            office,
            candidate,
            pollNumber = 0,
            temporaryPoll,
            xhr,
            url,
            value,data2,office_names;
						data2 = {"values":[]};
						office_names = ["Prefect", "VicePrefectM", "VicePrefectF","ChallengersC","ChallengersVC","ExplorersC","ExplorersVC","PioneersC","PioneersVC","VoyagersC", "VoyagersVC"]
						for (var obj in office_names) {
							var construct = {};
							construct[office_names[obj]] = data[office_names[obj]];
							console.log(construct);
							data2.values.push(construct);
						}
            data2.values.forEach(function(value) {
                for (office in value) {
                    if (value.hasOwnProperty(office)) {
                        console.log("here");
                        temporaryPoll = new Poll(pollNumber, office);
                        pollNumber += 1;

                        value[office].forEach(function(candidate) {
                            temporaryPoll.addCandidate(candidate);
                        });

                        polls.push(temporaryPoll);
                        temporaryPoll = {};
                    }
                }
            }
            );
        
        console.log(polls)
        //request the server for groups and their offices
        //process the incoming data to form object literal with key-value pairs
        //set the data variable to the object literal

        /*for (group in data.values) {
            if (data.hasOwnProperty(group)) {
                for (office in data[group]) {
                    if (data[group].hasOwnProperty(office)) {

                        temporaryPoll = new Poll(pollNumber, group, office);
                        pollNumber += 1;

                        data[group][office].forEach(
                            function (candidate, i, arr) {
                                temporaryPoll.addCandidate(candidate);
                            },
                            this
                        );

                        this.polls.push(temporaryPoll);
                        temporaryPoll = {};
                    }
                }
            }
        }*/
        
    };

    this.dumpPolls = function () {
        polls.forEach(
            function (poll, i, arr) {
                poll.dump(this.dumpId);
            },
            this
        );
    };

    this.addEvents = function () {
        var winners = [],
            candidates = [],
            theButton,
            theCandidate,
            pollElement,
            iterator,
			iterator1,
			length1,
            length,
			pollDoneCounter = 1;

        polls.forEach(
            function (poll, i, arr) {
                //for clicking on the candidates
                var n = poll.candidates.length,
                    h = window.innerHeight,
                    w = window.innerWidth;

                console.log(h + ", " + w);

                if(w > h) {
                    poll.candidates.forEach(
                        function(candidate, i, arr) {
                            document.getElementById(candidate.id).style.height = (91.5-Math.ceil(n/2))/(Math.ceil(n/2)) + "%";
							console.log(91.5-Math.ceil(n/2))/(Math.ceil(n/2));
                        }
                    );
                } else {
                    poll.candidates.forEach(
                        function(candidate, i, arr) {
                            document.getElementById(candidate.id).style.height = (92.5-n-1)/n + "%";
                        }
                    );
                }
                poll.candidates.forEach(
                    function (candidate, j, arr1) {
                        document.getElementById(candidate.id).addEventListener("click",
                            function () {
                                //votes
                                polls[this.dataset.pollNumber].vote(this.dataset.candidateNumber);
                                
                                //enables the undo button
                                document.getElementById("undo" + polls[this.dataset.pollNumber].id).disabled = false;
                                
                                poll.candidates.forEach(
                                    function (candidate1, k, arr2) {
                                        showIfWinner(candidate1);
                                    }
                                );
                            }
                            );
                    }
                );
                //for clicking on undo
                document.getElementById("undo" + poll.id).addEventListener("click",
                    function () {
                        poll.undo();
                        poll.candidates.forEach(
                            function (candidate, j, arr1) {
                                showIfWinner(candidate);
                            }
                        );
                        //disables the undo button if the total number of votes = 0
                        if (poll.getTotalVotes() === 0) {
                            document.getElementById("undo" + poll.id).disabled = true;
                        }
                    }
                );
                //for clicking on end
                document.getElementById("end" + poll.id).addEventListener("click",
                    function() {
						var div,
							table,
							tempRow,
							tempTd1,
							tempTd2,tempTd3;
                        pollElement = document.getElementById(poll.id);
						pollDoneCounter += 1;
                        for (iterator = 0, length = pollElement.children.length; iterator < length; iterator += 1) {
                            if (pollElement.children[iterator].tagName === "BUTTON") {
                                pollElement.children[iterator].disabled = true;
                            }
                        }
						for (iterator = 0, length = this.parentElement.children.length; iterator < length; iterator += 1) {
                            if (this.parentElement.children[iterator].tagName === "BUTTON") {
                                this.parentElement.children[iterator].disabled = true;
                            }
                        }
						this.disabled = true;
                        poll.declareWinner();
						if(pollDoneCounter === polls.length + 1) {
							div = document.createElement("div");
							div.className = "poll";
							
							table = document.createElement("table");
							
							polls.forEach(function(poll) {
								tempRow = document.createElement("tr");
								tempTd3 = document.createElement("th");
								tempTd3.innerHTML = poll.office;
								tempRow.appendChild(tempTd3);
								poll.candidates.forEach(function(candidate) {
									tempTd1 = document.createElement("td");
									tempTd1.innerHTML = candidate.name;
									
									tempTd2 = document.createElement("td");
									tempTd2.innerHTML = candidate.getVotes();
									
									tempRow.appendChild(tempTd1);
									tempRow.appendChild(tempTd2);
								});
								
								table.appendChild(tempRow);
							});
							
							div.appendChild(table);
							
							document.getElementById("body").appendChild(div);
						}
                    }
                );
                //for resizing on window resizing
                window.addEventListener("resize",
                    function () {
                        var n = poll.candidates.length,
                        h = window.innerHeight,
                        w = window.innerWidth;

                        if(w > h) {
                            poll.candidates.forEach(
                                function(candidate, i, arr) {
                                    document.getElementById(candidate.id).style.height = (91.5-Math.ceil(n/2))/(Math.ceil(n/2)) + "%";
                                }
                            );
                        } else {
                            poll.candidates.forEach(
                                function(candidate, i, arr) {
                                    document.getElementById(candidate.id).style.height = (92.5-n-1)/n + "%";
                                }
                            );
                        }
                    }
                );
            }
        );
        
    };
    
    function showIfWinner(candidate) {
        if (candidate.isWinner) {
            document.getElementById(candidate.id).classList.add("winner");
        } else {
            document.getElementById(candidate.id).classList.remove("winner");
        }
        resetDisplayedVotes(candidate);
    }
    
    function resetDisplayedVotes(candidate) {
        document.getElementById("votes" + candidate.id).innerHTML = candidate.votes;
    }

    this.set();
    this.dumpPolls();
    this.addEvents();
    //this.setPollsAndCandidates();
}

function InterfaceCreator(dumpId) {
    var theInterface,
        xhr,
        url,
        data;

    xhr = new XMLHttpRequest(),
    url = "/getcandidates";

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
            theInterface = new Interface(dumpId, data);
            console.log("done till here")
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}
