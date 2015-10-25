var sidebarstate = "Closed";
	function togglesidebar() {
		if (sidebarstate === "Closed") {
			document.getElementsByClassName("sidebar")[0].style.left = "0px";
			document.getElementsByClassName("side-icon")[0].style.marginLeft = "300px";
			sidebarstate = "Open";
		} else {
			document.getElementsByClassName("sidebar")[0].style.left = "-300px";
			document.getElementsByClassName("side-icon")[0].style.marginLeft = "50px";
			sidebarstate = "Closed";
		}
	}
	function hidesidebar() {
			document.getElementsByClassName("sidebar")[0].style.left = "-300px";
			document.getElementsByClassName("side-icon")[0].style.marginLeft = "50px";
			sidebarstate = "Closed";
	}