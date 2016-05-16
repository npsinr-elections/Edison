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
	this.currentAddSlide = 1;
	this.currentSlide = 0;
	this.viewport = Id("viewport");
	this.newSlide = function(type,data) {
		var n_slide,slide_cont;
		
		slide_cont = document.createElement("div");
		slide_cont.id = "slide" + this.currentAddSlide;
		slide_cont.className = "slide";
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
	}
	
	this.previousSlide = function() {
			var i;
			console.log(this.currentSlide);
		if (this.currentSlide !== 1) {
		for (i = 0; i < this.slides.length; i++) {
		this.slides[i].style.left = (Number(this.slides[i].style.left.replace("%","")) + 100) + "%";
		}
		this.currentSlide --;
	}
	}
}

function center() {
	center_elem = Cl("center");
	var i;
	for (i=0;i<center_elem.length;i++) {
		center_elem[i].style.marginTop = (window.innerHeight - center_elem[i].offsetHeight)/2 + "px";
		center_elem[i].style.marginLeft = (window.innerWidth - center_elem[i].offsetWidth)/2 + "px";
	}
}