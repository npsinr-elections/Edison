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
        listOfHouses = ["Challengers", "Explorers", "Pioneers", "Voyagers"];

    if (!office) {
        throw new Err("No office specified");
    }
    if (listOfOffices.indexOf(office) === -1) {
        throw new Err("Office name not in order");
    }

    if (!house && listOfPrefects.indexOf(office) === -1) {
        throw new Err("No house specified");
    }
    if (house && listOfHouses.indexOf(house) === -1) {
        throw new Err("House name not in order");
    }
}

//defines a generic candidate
function Candidate(nam, office, house) {
    'use strict';

    validate(office, house);

    if (!nam) {
        throw new Err("No name specified");
    }

    this.office = office;
    this.house = house || "";

    this.name = nam;
    this.votes = 0;
    
    this.cl = "candidate " + (this.house || "canpre") + " " + this.office.replace(' ', '');
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
function Poll(details) {
    'use strict';

    validate(details[0], details[1]);

    this.office = details[0];
    this.house = details[1] || "";

    this.candidates = []; //reset
    this.totalVotes = 0;
    this.specificVotes = [];
    this.finalWinner = "";
    
    this.cl = "poll " + (this.house || "pre");
    this.id = this.house + this.office.replace(' ', '');
	this.dumpString = "<div>Not Evaluated</div>";
    
    this.evalDumpString = function () {
		this.dumpString = "<div id=\"" + this.id + "\" class=\"" + this.cl + "\">";
		
		this.candidates.forEach(
			function(candidate, i, arr) {
				this.dumpString += candidate.dumpString;
			},
			this
		)
		
		this.dumpString += "</div>";
		
		return this.dumpString;
	}
    
    this.dump = function (id) {
        var i = 0,
            j = 0;
        
        document.getElementById(id).innerHTML += this.dumpString;
        
        for (i = 0, j = this.candidates.length; i < j; i += 1) {
            this.candidates[i].dump(this.id);
        }
    };

    this.addCandidate = function (nam) {
        this.candidates.push(new Candidate(nam, this.office, this.house));
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
            m = Math.max.apply(Math, this.specificVotes),
            candidate,
            i,
            l;

        for (i = 0, l = this.candidates.length; i < l; i = i + 1) {
            if (this.candidates[i].getVotes() === m) {
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
    
    //remove this
    for (var i = 0; i < 3; i += 1) {
        this.addCandidate(this.office + this.house + i);
    }
}

function Interface() {
    'use strict';
    var i = 0,
        j = 0,
        k = 0,
        l = 0,
        poll = "";
    
    this.pollDetails = [
        ["Prefect"], ["Vice Prefect Female"], ["Vice Prefect Male"],
        ["Vice Captain", "Challengers"], ["Vice Captain", "Explorers"], ["Vice Captain", "Pioneers"], ["Vice Captain", "Voyagers"],
        ["Captain", "Challengers"], ["Captain", "Explorers"], ["Captain", "Pioneers"], ["Captain", "Voyagers"]
    ];
    
    this.polls = [];

    this.setPollsAndCandidates = function () {
        this.pollDetails.forEach(
            function (details, i, arr) {
                this.polls[i] = new Poll(details);
            },
            this
        );
    };
    
    this.setPollsAndCandidates();
}