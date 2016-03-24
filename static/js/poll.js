/*jslint browser: true */
//defines an error
/*function Err(message) {
    'use strict';

    window.alert(message);
    console.log(message);
    throw new Error(message);
}*/

/*function validate(office, house) {
    'use strict';

    var listOfOffices = ["Captain", "Vice Captain", "Prefect", "Vice Prefect Female", "Vice Prefect Male"],
        listOfPrefects = ["Prefect", "Vice Prefect Female", "Vice Prefect Male"],
        listOfGroups = ["Challengers", "Explorers", "Pioneers", "Voyagers"];

    if (!office) {
        throw new Err("No office specified");
    }
    if (listOfOffices.indexOf(office) === -1) {
        throw new Err("Office name not in order");
    }

    if (!house && listOfPrefects.indexOf(office) === -1) {
        throw new Err("No house specified");
    }
    if (house && listOfGroups.indexOf(house) === -1) {
        throw new Err("House name not in order");
    }
}*/

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

    this.cl = "candidate " + this.group.replace(' ', '') + " " + this.office.replace(' ', '');
    this.id = this.group.replace(" ", "") + this.office.replace(" ", '') + this.candidateNumber;

    this.dumpString = "<button id=\"" + this.id + "\"" + //sets the id
        "class=\"" + this.cl + "\"" + //sets the class
        "data-candidate-number=\"" + this.candidateNumber + "\"" + //sets data-candidate-number
        "data-poll-number=\"" + this.pollNumber + "\"" +
        "\">" + //ends the starting tag
        this.name + ": " + //sets the content
        "<div id=\"votes" + this.id + "\">" + this.votes + "</div>" + 
        "</button>"; //ends the button

    this.vote = function () {
        this.votes += 1;
        this.innerHTML = this.name + ": " + this.votes;
        return this.votes;
    };

    this.unvote = function () {
        this.votes -= 1;
        this.innerHTML = this.name + ": " + this.votes;
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
function Poll(number, group, office) {
    'use strict';

    //validate(details[0], details[1]);
    var candidateNumber = 0,
        votes = [];

    this.office = office;
    this.group = group;
    this.number = number;

    this.candidates = []; //reset
    this.totalVotes = 0;
    this.specificVotes = [];
    this.finalWinner = {};

    this.cl = "poll " + this.group.replace(" ", "");
    this.id = this.group.replace(' ', '') + this.office.replace(' ', '');

    this.dumpString = "<div id=\"" + this.id + "\"" + //sets the id
        "class=\"" + this.cl + " row\"" + //sets the class
        "data-poll-number=\"" + this.number + "\">" + //sets data-poll-number
        "<button disabled=\"true\" class=\"undo\" id=\"undo" + this.id + "\">" + //adds undo button
        "Undo" +
        "</button>" +
        "<button class=\"end\" id=\"end" + this.id + "\">" + //adds end button
        "End" +
        "</button>" +
        "</div>"; //ends the div

    this.dump = function (id) {
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

function Interface(electionId, dumpId) {

    'use strict';
    var i = 0;

    this.electionId = electionId;
    this.dumpId = dumpId;

    this.polls = [];

    this.fetchAndSet = function () {


        var group,
            office,
            candidate,
            pollNumber = 0,
            temporaryPoll,
            data = { //this is the dummy data to be replaced.
                "Group 1": {
                    "Office 1": [
                        {
                            "name": "foo",
                            "image": "url"
                        },
                        {
                            "name": "bar",
                            "image": "url"
                        },
                        {
                            "name": "baz",
                            "image": "url"
                        }
                    ],
                    "Office 2": [
                        {
                            "name": "foo",
                            "image": "url"
                        },
                        {
                            "name": "bar",
                            "image": "url"
                        },
                        {
                            "name": "baz",
                            "image": "url"
                        }
                    ],
                    "Office 3": [
                        {
                            "name": "foo",
                            "image": "url"
                        },
                        {
                            "name": "bar",
                            "image": "url"
                        },
                        {
                            "name": "baz",
                            "image": "url"
                        }
                    ]
                },
                "Group 2": {
                    "Office 1": [
                        {
                            "name": "foo",
                            "image": "url"
                        },
                        {
                            "name": "bar",
                            "image": "url"
                        },
                        {
                            "name": "baz",
                            "image": "url"
                        }
                    ],
                    "Office 2": [
                        {
                            "name": "foo",
                            "image": "url"
                        },
                        {
                            "name": "bar",
                            "image": "url"
                        },
                        {
                            "name": "baz",
                            "image": "url"
                        }
                    ],
                    "Office 3": [
                        {
                            "name": "foo",
                            "image": "url"
                        },
                        {
                            "name": "bar",
                            "image": "url"
                        },
                        {
                            "name": "baz",
                            "image": "url"
                        }
                    ]
                }
            };

        //request the server for groups and their offices
        //process the incoming data to form object literal with key-value pairs
        //set the data variable to the object literal

        for (group in data) {
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
        }
    };


    this.dumpPolls = function () {
        this.polls.forEach(
            function (poll, i, arr) {
                poll.dump(this.dumpId);
            },
            this
        );
    };

    this.addEvents = function () {
        var polls = this.polls,
            winners = [],
            candidates = [],
            theButton,
            theCandidate,
            pollElement,
            iterator,
            length;

        this.polls.forEach(
            function (poll, i, arr) {
                //for clicking on the candidates
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
                        pollElement = document.getElementById(poll.id);
                        for (iterator = 0, length = pollElement.children.length; iterator < length; iterator += 1) {
                            if (pollElement.children[iterator].tagName === "BUTTON") {
                                pollElement.children[iterator].disabled = true;
                            }
                        }
                        poll.declareWinner();
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

    this.fetchAndSet();
    this.dumpPolls();
    this.addEvents();
    //this.setPollsAndCandidates();
}