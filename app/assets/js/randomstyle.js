function randomStyle() {
	var linkTags = document.getElementsByTagName("link");
	var styleList = new Array();
	for (i=0; i<linkTags.length; i++) {
		if (linkTags[i].title.indexOf("randomstyle") >= 0) {
			linkTags[i].disabled = true;
			styleList.push(linkTags[i]);
		}
	}
	styleList[Math.floor(Math.random() * styleList.length)].disabled = false;
	
}