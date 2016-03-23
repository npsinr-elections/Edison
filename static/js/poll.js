/*jslint browser: true */
//defines an error
function Err(message) {
    'use strict';
    
    window.alert(message);
    console.log(message);
    throw new Error(message);
}

function validate(office, house) {
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
}

//defines a generic candidate
function Candidate(number, details, office, group) {
    'use strict';

    //validate(office, group);

    //if (!nam) {
    //    throw new Err("No name specified");
    //}

    this.office = office;
    this.group = group;

    this.name = details.name;
    this.image = details.image;
    this.votes = 0;
    
    this.cl = "candidate " + this.group + " " + this.office.replace(' ', '');
    this.id = this.name.replace(" ", "");
    this.dumpString = "<button id=\"" + this.id + "\" class=\"" + this.cl + "\">" + this.name + "</button>";

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
function Poll(number, group, office) {
    'use strict';
    var i; //remove

    //validate(details[0], details[1]);

    this.office = office;
    this.group = group;
	this.number = number;

    this.candidates = []; //reset
    this.totalVotes = 0;
    this.specificVotes = [];
    this.finalWinner = "";
    
    this.cl = "poll " + this.group;
    this.id = this.group.replace(' ', '') + this.office.replace(' ', '');
	this.dumpString = "<div id=\"" + this.id + "\" class=\"" + this.cl + "\"></div>";
    
    this.dump = function (id) {
        document.getElementById(id).innerHTML += this.dumpString;
		
		this.candidates.forEach(
			function (candidate, i, arr) {
				document.getElementById(this.id).innerHTML += candidate.dumpString;
			},
			this
		);
    };

    this.addCandidate = function (number, details) {
        this.candidates.push(new Candidate(number, details, this.office, this.group));
    };

    this.vote = function (i) {
        this.totalVotes += 1;
        this.specificVotes[i] = this.candidates[i].vote();
        this.evaluateWinner();
    };

    this.unvote = function (i) {
        this.totalVotes -= 1;
        this.specificVotes[i] = this.candidates[i].unvote();
        this.evaluateWinner();
    };

    this.getVotes = function () {
        return this.totalVotes;
    };

    this.evaluateWinner = function () {
        var winners = [],
            maxVotes = Math.max.apply(Math, this.specificVotes),
            candidate,
            i,
            l;

        for (i = 0, l = this.candidates.length; i < l; i = i + 1) {
            if (this.candidates[i].getVotes() === maxVotes) {
                winners.push(this.candidates[i].getName());
                //do something in the graphics, or leave it to the calling function
            }
        }
        return winners;
    };

    this.declareWinner = function () {
        var winner = this.evaluateWinner();
        if (winner.length === 1) {
            this.finalWinner = winner[0];
            window.alert("The winner is " + winner[0]);
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
            candidateNumber = 0,
            temporaryPoll,
            data = { //this is the dummy data to be replaced.
                "Group 1": {
                    "Office 1": [
                        {"name": "foo", "image": "url"},
                        {"name": "bar", "image": "url"},
                        {"name": "baz", "image": "url"}
                    ],
                    "Office 2": [
                        {"name": "foo", "image": "url"},
                        {"name": "bar", "image": "url"},
                        {"name": "baz", "image": "url"}
                    ],
                    "Office 3": [
                        {"name": "foo", "image": "url"},
                        {"name": "bar", "image": "url"},
                        {"name": "baz", "image": "url"}
                    ]
                },
                "Group 2": {
                    "Office 1": [
                        {"name": "foo", "image": "url"},
                        {"name": "bar", "image": "url"},
                        {"name": "baz", "image": "url"}
                    ],
                    "Office 2": [
                        {"name": "foo", "image": "url"},
                        {"name": "bar", "image": "url"},
                        {"name": "baz", "image": "url"}
                    ],
                    "Office 3": [
                        {"name": "foo", "image": "url"},
                        {"name": "bar", "image": "url"},
                        {"name": "baz", "image": "url"}
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
                            function(candidate, i, arr) {
                                temporaryPoll.addCandidate(candidateNumber, candidate);
                                candidateNumber += 1;
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
    
    this.fetchAndSet();
    this.dumpPolls();
    //this.setPollsAndCandidates();
}