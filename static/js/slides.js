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
	div.className = "flex-container";
	div.style.background = b_col;
	
	head_cont = document.createElement("div");
	head_cont.className = "flex-center text-center";
	
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
	
	console.log(poll);
	b_col = b_col || "#FFF";
	t_col = t_col || "#000";
	
	div = document.createElement("div");
	div.className = "flex-container-h flex-top";
	div.style.background = b_col;
	
	head_cont = document.createElement("div");
	head_cont.className = "flex-center text-center title_top";
	
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
	
	head_cont.appendChild(h1);
	head_cont.appendChild(h2);
	
	div.appendChild(head_cont);
	
	return div;
}


function Presentation() {
	this.currentSlide = 0;
	this.currentAddSlide = 1;
	this.animations = new AnimationHandler();
	this.viewport = document.getElementById("viewport");
	this.newSlide = function(type,data) {
		var n_slide,slide_cont;
		
		slide_cont = document.createElement("div");
		slide_cont.id = "slide" + this.currentAddSlide;
		slide_cont.className = "slide";
		
		slide = addSlide(type,data);
		
		slide_cont.appendChild(slide);
		
		this.viewport.appendChild(slide_cont);
		
		this.currentAddSlide ++;
	}
	this.start = function() {
		this.currentSlide = 0;
		this.nextSlide();
		this.animations.start_election();
	}
	this.nextSlide = function() {
		this.currentSlide ++;
		if (this.currentSlide == this.currentAddSlide) {
			this.currentSlide = 1;
			this.animations.next(this.currentAddSlide-1,this.currentSlide);
		} else {
		this.animations.next(this.currentSlide-1,this.currentSlide);
		}
	}
	
	this.previousSlide = function() {
		this.currentSlide --;
		if (this.currentSlide === 0) {
			this.currentSlide = this.currentAddSlide-1
			this.animations.previous(1,this.currentSlide);
		} else {
			this.animations.previous(this.currentSlide+1,this.currentSlide);
		}
	}
}

function AnimationHandler() {
	this.next_anim = function() {
	}
	this.start_election = function() {
		$(".slide").css({display:"initial"})
		$("#slide1").animate({left:0},600);
	}
	this.next = function(currentSlide,nextSlide) {
		$("#slide"+(nextSlide)).css({left:"100%"});
		$("#slide"+(currentSlide)).animate({left:"-100%"},600)
		$("#slide"+(nextSlide)).animate({left:"0"},600)
	}
	this.previous = function(currentSlide,previousSlide) {
		$("#slide"+(previousSlide)).css({left:"-100%"});
		$("#slide"+(currentSlide)).animate({left:"100%"},600)
		$("#slide"+(previousSlide)).animate({left:"0"},600)
	}
}