function addSlide(type,data) {
	switch (type) {
		case "title":
			return titleSlide(data.heading,data.subheading,data.b_col,data.t_col);
		case "election":
			return electionSlide(data.heading,data.b_col,data.t_col,data.poll)
	}
}

function titleSlide(heading,subheading,b_col,t_col) {
	var div,head_cont,h1,h2;
	
	b_col = b_col || "#FFF";
	t_col = t_col || "#000";
	
	div = document.createElement("div");
	div.className = "full-size";
	div.style.background = b_col;
	
	head_cont = document.createElement("div");
	head_cont.className = "head_cont center text-center";
	
	// Creating the actual heading
	h1 = document.createElement("h1");
	h1.className = "title_h1";
	h1.innerHTML = heading;
	h1.style.color = t_col
	h1.dataset.animate = 1;
	
	// Creating the subheading
	h2 = document.createElement("h2");
	h2.className = "title_h2";
	h2.innerHTML = subheading;
	h2.style.color = t_col
	h2.dataset.animate = 2;
	
	head_cont.appendChild(h1);
	head_cont.appendChild(h2);
	
	div.appendChild(head_cont);
	
	return div;
}

function electionSlide(heading,b_col,t_col,poll) {
	var div,head_cont,h1,h2;

	b_col = b_col || "#FFF";
	t_col = t_col || "#000";
	
	div = document.createElement("div");
	div.className = "full-size";
	div.style.background = b_col;
	
	head_cont = document.createElement("div");
	head_cont.className = "title_top text-center";
	
	// Creating the actual heading
	h1 = document.createElement("h1");
	h1.className = "title_h1";
	h1.innerHTML = heading;
	h1.style.color = t_col
	h1.dataset.animate = 1;
	
	// Creating the subheading
	h2 = document.createElement("h2");
	h2.className = "title_h2";
	h2.innerHTML = "Candidates";
	h2.style.color = t_col
	h2.dataset.animate = 2;
	
	candidate_cont = document.createElement("div");
	candidate_cont.className = "candidates fill-height";
	
	for (var candidate in poll.candidates) {
		candidate_obj = document.createElement("div");
		candidate_obj.className = "candidate";
		candidate_cont.appendChild(candidate_obj);
	}
	
	head_cont.appendChild(h1);
	head_cont.appendChild(h2);
	
	div.appendChild(head_cont);
	div.appendChild(candidate_cont);
	
	return div;
}


function Presentation() {
	this.currentAddSlide = 1;
	this.currentSlide = 0;
	this.viewport = Id("viewport");
	this.newSlide = function(type,data) {
		var n_slide,slide_cont;
		
		slide_cont = document.createElement("div");
		slide_cont.id = "slide" + this.currentAddSlide;
		slide_cont.className = "slide";
		slide_cont.dataset.type = type;
		slide_cont.style.left = (100+(100*(this.currentAddSlide-1))) + "%";
		
		slide = addSlide(type,data);
		
		slide_cont.appendChild(slide);
		
		this.viewport.appendChild(slide_cont);
		
		
		this.currentAddSlide ++;
	}
	this.start = function() {
		this.slides = Cl("slide");
		this.nextSlide();
	
	}
	this.nextSlide = function() {
		var i;
		if (this.currentSlide !== this.currentAddSlide-1) {
		for (i = 0; i < this.slides.length; i++) {
		this.slides[i].style.left = (Number(this.slides[i].style.left.replace("%","")) - 100) + "%";
		}
		this.currentSlide ++;
		}
		if (Id("slide" + this.currentSlide).dataset.type == "election") {
			Id("school_logo").style.opacity = "0";
		} else {
			Id("school_logo").style.opacity = "1";
		}
	}
	
	this.previousSlide = function() {
			var i;
		if (this.currentSlide !== 1) {
		for (i = 0; i < this.slides.length; i++) {
		this.slides[i].style.left = (Number(this.slides[i].style.left.replace("%","")) + 100) + "%";
		}
		this.currentSlide --;
	}
	if (Id("slide" + this.currentSlide).dataset.type == "election") {
			Id("school_logo").style.opacity = "0";
		} else {
			Id("school_logo").style.opacity = "1";
		}
	}
}


