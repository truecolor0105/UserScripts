// ==UserScript==
// @name			YouTube Favicon to Channel logo
// @version			1.3
// @description		Changes the YouTube Favicon to the Channel Logo
// @author			Kartik Soneji
// @icon			https://www.youtube.com/s/desktop/90b31458/img/favicon_144x144.png
// @license			GPL-3.0-or-later
// @match			https://www.youtube.com/*
// @exclude			https://www.youtube.com/
// @exclude			https://www.youtube.com/tv*
// @exclude			https://www.youtube.com/embed/*
// @exclude			https://www.youtube.com/live_chat*
// @grant			none
// @run-at			document-start
// @noframes
// @supportURL		https://gitlab.com/KartikSoneji/userscripts/issues
// @updateURL		https://openuserjs.org/meta/KartikSoneji/YouTube_Favicon_to_Channel_logo.meta.js
// @downloadURL		https://openuserjs.org/install/KartikSoneji/YouTube_Favicon_to_Channel_logo.user.js
// ==/UserScript==

(() => {
	window.addEventListener("load", () => {
		let { thumbnails } =
			window.ytInitialData.header?.c4TabbedHeaderRenderer?.avatar ??
			window.ytInitialData.contents?.twoColumnWatchNextResults?.results.results
				.contents.find(e => "videoSecondaryInfoRenderer" in e)
				.videoSecondaryInfoRenderer.owner.videoOwnerRenderer.thumbnail;
		setRoundFavicon(thumbnails[thumbnails.length - 1]?.url);

		let observer = new MutationObserver(() =>
			setTimeout(() => {
				setRoundFavicon(document.querySelector("#meta-contents #avatar img[src]")?.src);
			}, 100)
		);
		observer.observe(document.querySelector("title"), {
			childList: true,
			attributes: true,
			characterData: true
		});
	});

	function setRoundFavicon(dataUrl){
		roundImageToDataUrl(dataUrl).then(setFavicon);
	}

	async function roundImageToDataUrl(url){
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.crossOrigin = "anonymous";
			img.src = url.src ?? url;

			img.onload = () => {
				let canvas = document.createElement("canvas"),
					g = canvas.getContext("2d");

				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;

				g.beginPath();
				g.arc(
					canvas.width/2,
					canvas.height/2,
					canvas.width/2,
					0,
					Math.PI * 2
				);
				g.clip();

				g.drawImage(img, 0, 0);

				resolve(canvas.toDataURL());
			};
		});
	}

	function setFavicon(url){
		let a = document.querySelectorAll("link[rel *= icon]");

		if(a.length == 0){
			let link = document.createElement("link");
			link.type = "image/x-icon";
			link.rel = "icon";
			document.head.appendChild(link);
			a = [link];
		}

		for(let i of a)
			i.href = url;
	}
})();
