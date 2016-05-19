function addSlide(type, data) {
    switch (type) {
        case "title":
            return titleSlide(data.heading, data.subheading, data.b_col, data.t_col,data.poll);
        case "election":
            return electionSlide(data.heading, data.b_col, data.t_col, data.poll)
    }
}

function titleSlide(heading, subheading, b_col, t_col,poll) {
    var div, head_cont, h1, h2;

    b_col = b_col || "#FFF";
    t_col = t_col || "#000";

    div = document.createElement("div");
    div.className = "full-size";
    div.id = poll.id+"title";
    div.style.background = b_col;
    div.style.color = t_col;

    head_cont = document.createElement("div");
    head_cont.className = "head_cont center text-center";

    // Creating the actual heading
    h1 = document.createElement("h1");
    h1.className = "title_h1";
    h1.innerHTML = heading;

    // Creating the subheading
    h2 = document.createElement("h2");
    h2.className = "title_h2";
    h2.innerHTML = subheading;

    head_cont.appendChild(h1);
    head_cont.appendChild(h2);

    div.appendChild(head_cont);

    return div;
}

function electionSlide(heading, b_col, t_col, poll) {
    var div, head_cont, h1, h2, row_1, row_2, cand_width, c_name, c_image,start_button,end_button,undo_button,result_button;

    b_col = b_col || "#FFF";
    t_col = t_col || "#000";

    div = document.createElement("div");
    div.className = "full-size";
    div.id = poll.id+"election";
    div.style.color = t_col;
    div.style.background = b_col;

    head_cont = document.createElement("div");
    head_cont.className = "title_top text-center";

    // Creating the actual heading
    h1 = document.createElement("h1");
    h1.className = "title_h1";
    h1.innerHTML = heading;

    // Creating the subheading
    h2 = document.createElement("h2");
    h2.className = "title_h2";
    h2.innerHTML = "Candidates";
    h2.id = poll.statusId;

    candidate_cont = document.createElement("div");
    candidate_cont.className = "candidates fill-height";
// <button type="button" class="btn btn-primary btn-lg">Large button</button>

		start_button = document.createElement("button");
		start_button.type = "button";
		start_button.className = "btn btn-primary btn-lg start_btn";
		start_button.id = poll.startId;
		start_button.innerHTML = "Start Elections";
		start_button.onclick = function () {
			slide_map[elections.currentSlide-1].start_elections();
		}
		
		end_button = document.createElement("button");
		end_button.type = "button";
		end_button.className = "btn btn-danger btn-lg end_btn";
		end_button.id = poll.endId;
		end_button.innerHTML = "End Elections"
		end_button.style.display = "none";
		end_button.onclick = function () {
			slide_map[elections.currentSlide-1].end_elections();
		}
		
		undo_button = document.createElement("button");
		undo_button.type = "button";
		undo_button.className = "btn btn-warning btn-lg undo_btn disabled";
		undo_button.id = poll.undoId;
		undo_button.innerHTML = "Undo Vote";
		undo_button.style.display = "none";
		undo_button.onclick = function () {
			slide_map[elections.currentSlide-1].undo();
		}
		
		result_button = document.createElement("button");
		result_button.type = "button";
		result_button.className = "btn btn-success btn-lg result_btn";
		result_button.id = poll.resultId;
		result_button.innerHTML = "Declare Results!";
		result_button.style.display = "none";
		result_button.onclick = function () {
			slide_map[elections.currentSlide-1].declareWinner();
		}
		
    if (poll.candidates.length <= 3) {
        cand_width = (Math.floor(100 / poll.candidates.length) - 1) + "%";

        for (var candidate in poll.candidates) {
            candidate_obj = document.createElement("div");
            candidate_obj.className = "candidate " + poll.cand_class;
            candidate_obj.style.width = cand_width;
            candidate_obj.style.height = "80%";
            candidate_obj.style.marginLeft = "1%";

            c_name = document.createElement("div");
            c_name.className = "cand-name";
            c_name.innerHTML = poll.candidates[candidate].name;
            
            c_image = document.createElement("img");
            c_image.src = poll.candidates[candidate].image;
            c_image.className = "cand-image";
						
						candidate_obj.appendChild(c_image);
            candidate_obj.appendChild(c_name);

            candidate_cont.appendChild(candidate_obj);
        }
    } else {
        row_1 = document.createElement("div");
        row_1.style.height = "50%";
        row_1.className = "row1";

        row_2 = document.createElement("div");
        row_2.style.height = "50%";
        row_2.className = "row2";

        cand_width = ((Math.floor(100 / Math.ceil(poll.candidates.length / 2))) - 1);
        for (var i = 0; i <= Math.ceil(poll.candidates.length / 2) - 1; i++) {
            candidate_obj = document.createElement("div");
            candidate_obj.className = "candidate " + poll.cand_class;
            candidate_obj.style.width = cand_width + "%";
            candidate_obj.style.height = "80%";
            candidate_obj.style.marginLeft = "1%";

            c_name = document.createElement("div");
            c_name.className = "cand-name";
            c_name.innerHTML = poll.candidates[i].name;
            
            c_image = document.createElement("img");
            c_image.src = poll.candidates[i].image;
            c_image.className = "cand-image";
						
						candidate_obj.appendChild(c_image);

            candidate_obj.appendChild(c_name);
            row_1.appendChild(candidate_obj);
        }
        var total_width = -1;
        for (i = Math.ceil(poll.candidates.length / 2); i <= poll.candidates.length - 1; i++) {
            candidate_obj = document.createElement("div");
            candidate_obj.className = "candidate " + poll.cand_class;
            candidate_obj.style.width = cand_width + "%";
            candidate_obj.style.height = "80%";
            candidate_obj.style.marginLeft = "1%";

            c_name = document.createElement("div");
            c_name.className = "cand-name";
            c_name.innerHTML = poll.candidates[i].name;
            
            c_image = document.createElement("img");
            c_image.src = poll.candidates[i].image;
            c_image.className = "cand-image";
						
						candidate_obj.appendChild(c_image);

            candidate_obj.appendChild(c_name);
            row_2.appendChild(candidate_obj);
            
            total_width += cand_width+1;
        }
        
        row_2.style.marginLeft = ((100-total_width)/2) + "%";
        candidate_cont.appendChild(row_1);
        candidate_cont.appendChild(row_2);
    }

    head_cont.appendChild(h1);
    head_cont.appendChild(h2);
    head_cont.appendChild(start_button);
    head_cont.appendChild(undo_button);
    head_cont.appendChild(end_button);
    head_cont.appendChild(result_button);

    div.appendChild(head_cont);
    div.appendChild(candidate_cont);

    return div;
}


function Presentation() {
    this.currentAddSlide = 1;
    this.currentSlide = 0;
    this.viewport = Id("viewport");
    this.slide_types = [];
    this.newSlide = function(type, data, poll) {
        var n_slide, slide_cont;
        
				this.slide_types.push(type);
				
        slide_cont = document.createElement("div");
        slide_cont.id = "slide" + this.currentAddSlide;
        slide_cont.className = "slide";
        slide_cont.style.left = "100%";

        slide = addSlide(type, data);

        slide_cont.appendChild(slide);

        this.viewport.appendChild(slide_cont);
        this.currentAddSlide++;
    }
    this.start = function() {
        this.slides = Cl("slide");
         this.currentSlide = 0;
        this.nextSlide();

    }
    this.nextSlide = function() {
        var i;
        if (this.currentSlide == 0) {
        	this.slides[0].style.left = 0;
        	this.currentSlide ++;
        } else if (this.currentSlide !== this.currentAddSlide-1) {
        	this.slides[this.currentSlide-1].style.left = "-100%";
        	this.slides[this.currentSlide].style.left = "0";
        	this.currentSlide ++;
        }
        this.hideShowlogo();
    }

    this.previousSlide = function() {
        var i;
      	if (this.currentSlide !== 1) {
      		this.slides[this.currentSlide-1].style.left = "100%";
      		this.slides[this.currentSlide-2].style.left = "0";
      		this.currentSlide --
      	}
       this.hideShowlogo();
    }
    
    this.hideShowlogo = function() {
    	if (this.slide_types[this.currentSlide-1] == "election") {
    		Id("school_logo").style.opacity = "0";
    	} else {
    		Id("school_logo").style.opacity = "1";
    	}
    }
}