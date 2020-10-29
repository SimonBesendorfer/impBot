let menuOpen = false;
/**
 * the button for the burger menue in the uper right corner
 */
function onClickMenu(){
	document.getElementById("menu").classList.toggle("change");
	
	if (!menuOpen){
		document.getElementById("slideInMenu").style.height = "100vh";
		menuOpen = true;
		setTimeout(function(){
			document.getElementById('menuOptions').classList.remove('d-none');
		}, 200);
	} else {
		document.getElementById('slideInMenu').style.height = "0vh";
		document.getElementById('menuOptions').classList.add('d-none');
		menuOpen = false;
	}


}

