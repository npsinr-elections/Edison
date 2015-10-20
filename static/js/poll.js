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
    
    this.cl = "candidate " + (this.house || "canpre") + " " + this.office + " " + (this.house || "pre") + this.office;
    this.id = this.name.replace(" ", "");
    this.dumpString = "";

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
function Poll(office, house) {
    'use strict';

    validate(office, house);

    this.office = office;
    this.house = house || "";

    this.candidates = [];
    this.totalVotes = 0;
    this.specificVotes = [];
    this.finalWinner = "";
    
    this.cl = "poll " + (this.house || "pre");
    this.id = this.house + this.office.replace(' ', '');
    
    this.dumpString = "<div id=\"" + this.id + "\" class=\"" + this.cl + "></div>";
    
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
}

function Interface() {
    'use strict';
    var i = 0,
        j = 0,
        k = 0,
        l = 0;
    this.dummyCandidates = [
        'foo',
        'bar',
        'baz'
    ];
    
    this.polls = 

    this.setPollsAndCandidates = function () {
        /*add code to set this.polls to the value it needs to be, here is an example:
        [
            //makes a poll for P, VPF, VPM
            new Poll("Prefect"),
            new Poll("Vice Prefect Female"),
            new Poll("Vice Prefect Male"),

            //makes a poll for VC for each house
            new Poll("Vice Captain", "Challengers"),
            new Poll("Vice Captain", "Explorers"),
            new Poll("Vice Captain", "Pioneers"),
            new Poll("Vice Captain", "Voyagers"),

            //makes a poll for C for each house
            new Poll("Captain", "Challengers"),
            new Poll("Captain", "Explorers"),
            new Poll("Captain", "Pioneers"),
            new Poll("Captain", "Voyagers")
        ]
        Also, set the values for all this.polls[i].candidates[]
        */
    }
}