// ==UserScript==
// @name			Paste Image into Google Image Search
// @version			1.1
// @description		Performs a reverse Google Image Search with the image from the clipboard.
// @author			Kartik Soneji
// @icon			https://images.google.com/favicon.ico
// @license			GPL-3.0-or-later
// @match			https://www.google.com/search*tbm=isch*
// @match			https://www.google.com/imghp*
// @match			https://images.google.com*
// @grant			none
// @run-at			document-start
// @supportURL		https://gitlab.com/KartikSoneji/userscripts/issues
// @updateURL		https://openuserjs.org/meta/KartikSoneji/Paste_Image_into_Google_Image_Search.meta.js
// @downloadURL		https://openuserjs.org/install/KartikSoneji/Paste_Image_into_Google_Image_Search.user.js
// ==/UserScript==

(() => {
	window.addEventListener("load", e => {
		//Show and hide the "Search by image" box
		window.google.qb.tp();
		window.google.qb.tp();
	
		document.querySelector("input[title = Search]").addEventListener("paste", handlePasteEvent);
		document.querySelector("[name = image_url]").addEventListener("paste", handlePasteEvent)
	});

	function handlePasteEvent(e){
		getImageURLFromPasteEvent(e).then(url => searchByImageURL(url)).catch(e => e);
	}

	function searchByImageURL(url){
		document.querySelector("[name = image_url]").value = url;
		document.querySelector("[value = 'Search by image']").click();
	}

	function getImageURLFromPasteEvent(e){
		for(let i of e.clipboardData.items)
			if(i.type.indexOf("image") > -1)
				return getBase64(i.getAsFile());

		throw "No Image on clipboard";
	}

	async function getBase64(file){
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
				if(encoded.length % 4 > 0)
					encoded += '='.repeat(4 - (encoded.length % 4));
				resolve(reader.result);
			};
			reader.onerror = reject;
		});
	}
})();
