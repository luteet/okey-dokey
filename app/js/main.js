
const 
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	burger = document.querySelector('.header__burger'),
	header = document.querySelector('.header');



function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveID = (typeof arg == 'object') ? (arg['saveID']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				if(popup.classList.contains('popup')) {

					popup.style.display = 'flex';

					body.classList.remove('_popup-active');
					html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
					body.classList.add('_popup-active');

					if (saveID) history.pushState('', "", id);

					setTimeout(() => {
						if (!initStart) {
							popup.classList.add('_active');
							function openFunc() {
								popupCheck = true;
								popup.removeEventListener('transitionend', openFunc);
							}
							popup.addEventListener('transitionend', openFunc)
						} else {
							popup.classList.add('_transition-none');
							popup.classList.add('_active');
							popupCheck = true;
						}

					}, 0)
				}

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveID) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.style.display = 'none';
					popup.removeEventListener('transitionend', closeFunc)
				}

				popup.addEventListener('transitionend', closeFunc)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			body.addEventListener('keyup', function (event) {

				if(event.code == 27 && document.querySelector('.popup._active')) {
					close(document.querySelector('.popup._active'));
				}

			});

			if (saveID) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup();

popup.init()

	
// =-=-=-=-=-=-=-=-=-=- <Get-device-type> -=-=-=-=-=-=-=-=-=-=-

const getDeviceType = () => {

	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}

	if (
		/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
		ua
		)
	) {
		return "mobile";
	}
	return "desktop";

};

// =-=-=-=-=-=-=-=-=-=- </Get-device-type> -=-=-=-=-=-=-=-=-=-=-
	


// =-=-=-=-=-=-=-=-=-=-=-=- <get-coords> -=-=-=-=-=-=-=-=-=-=-=-=

function getCoords(elem) {
	let box = elem.getBoundingClientRect();

	return {
	top: box.top + window.pageYOffset,
	right: box.right + window.pageXOffset,
	bottom: box.bottom + window.pageYOffset,
	left: box.left + window.pageXOffset
	};
}

// =-=-=-=-=-=-=-=-=-=-=-=- </get-coords> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=- <image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-

const imageAspectRatio = document.querySelectorAll('.image-aspect-ratio, figure');
imageAspectRatio.forEach(imageAspectRatio => {
	const img = imageAspectRatio.querySelector('img'), style = getComputedStyle(imageAspectRatio);
	if(img) {
		if(img.getAttribute('width') && img.getAttribute('height') && style.position == "relative")
		imageAspectRatio.style.setProperty('--padding-aspect-ratio', Number(img.getAttribute('height')) / Number(img.getAttribute('width')) * 100 + '%');
	}
	
})

// =-=-=-=-=-=-=-=-=-=- </image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger')) {
		menu.forEach(element => {
			element.classList.toggle('_mob-menu-active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-




	// =-=-=-=-=-=-=-=-=-=-=-=- <header-lang> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerLangTarget = $(".header__lang--target")
	if(headerLangTarget && getDeviceType() != "desktop") {
	
		headerLangTarget.classList.toggle('is-active');
	
	} else if(!$('.header__lang') && document.querySelector('.header__lang--target.is-active')) {

		document.querySelector('.header__lang--target.is-active').classList.remove('is-active');

	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-lang> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-tel> -=-=-=-=-=-=-=-=-=-=-=-=

	const headerTelTarget = $(".header__tel--target")
	if(headerTelTarget && getDeviceType() != "desktop") {
	
		headerTelTarget.classList.toggle('is-active');
	
	} else if(!$('.header__tel') && document.querySelector('.header__tel--target.is-active')) {

		document.querySelector('.header__tel--target.is-active').classList.remove('is-active');

	}

	// =-=-=-=-=-=-=-=-=-=-=-=- </header-tel> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-nav> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerNavLink = $(".header__nav--list a")
	if(headerNavLink) {
	
		if(headerNavLink.getAttribute('href').indexOf("#") != -1) {
			if(document.querySelector(`#${headerNavLink.getAttribute('href').split('#').pop()}`)) {
				event.preventDefault()
				document.querySelector(`#${headerNavLink.getAttribute('href').split('#').pop()}`).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
				history.pushState('', "", `#${headerNavLink.getAttribute('href').split('#').pop()}`);
			}
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-nav> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <reviews-video> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const reviewsVideoPreview = $(".reviews__video--preview")
	if(reviewsVideoPreview) {
	
		reviewsVideoPreview.classList.add('_play');
		reviewsVideoPreview.parentElement.querySelector('video').play();
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </reviews-video> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <faq> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const faqTarget = $(".faq__target")
	if(faqTarget) {
	
		if(faqTarget.closest('.faq__list').querySelector('.faq__target._active')) {
			if(!faqTarget.classList.contains('_active')) {
				faqTarget.closest('.faq__list').querySelector('.faq__target._active').classList.remove('_active')
			}
		}

		faqTarget.classList.toggle('_active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </faq> -=-=-=-=-=-=-=-=-=-=-=-=

	
	

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-


const pupils = document.querySelectorAll(".eye .eye-element");
window.addEventListener("mousemove", (e) => {
  pupils.forEach((pupil) => {
	const areaSize = pupil.parentElement.offsetWidth - pupil.offsetWidth / 2,
	rectCoords = getCoords(pupil);
    
	
    var x = (e.pageX - rectCoords.left) / (window.innerHeight/40);
    var y = (e.pageY - rectCoords.top) / (window.innerHeight/40);
	if(x > areaSize/4) {
		x = areaSize/4;
	}
	if(-areaSize/4 > x) {
		x = -areaSize/4;
	}

	if(y > areaSize/3) {
		y = areaSize/3;
	}
	
	if(y < -areaSize/4) {
		y = -areaSize/4;
	}

	x = x + 'px';
	y = y + 'px';

	pupil.setAttribute('data-x', x);
	pupil.setAttribute('data-y', y); 

    pupil.style.transform = "translate3d(" + pupil.dataset.x + "," + pupil.dataset.y + ", 0px)";
  });
});



// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let windowSize = 0;

function resize() {

	html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
	if(windowSize != window.innerWidth) {
		html.style.setProperty("--svh", window.innerHeight * 0.01 + "px");
	}
	
	windowSize = window.innerWidth;
	
}

resize();

window.addEventListener('resize', resize)

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

if(document.querySelector('.our-teachers__slider')) {

	const slider = new Splide('.our-teachers__slider', {

		type: "loop",
		perPage: 1,
		perMove: 1,
		gap: 30,

		easing: "ease",
		speed: 700,

		pagination: false,
		arrows: true,

		mediaQuery: "min",

		breakpoints: {
			1300: {
				perPage: 4,
			},

			992: {
				perPage: 3,
			},

			768: {
				perPage: 2,
			}
		}

	});

	slider.mount();

}

if(document.querySelector('.reviews__slider')) {

	const slider = new Splide('.reviews__slider', {

		type: "fade",
		rewind: true,
		perPage: 1,
		easing: "ease",
		speed: 700,

		arrows: true,
		pagination: false,

		breakpoints: {
			992: {
				// params
			},

			550: {
				// params
			}
		}

	});

	slider.on('inactive', function (slide) {
		if(slide.slide.querySelector('.reviews__video--preview') && slide.slide.querySelector('.reviews__video video')) {
			slide.slide.querySelector('.reviews__video--preview').classList.remove('_play');
			slide.slide.querySelector('.reviews__video video').pause();
			slide.slide.querySelector('.reviews__video video').currentTime = 0;
		}
	})

	slider.mount();

}

if(document.querySelector('.reviews__slider-mob')) {

	const slider = new Splide('.reviews__slider-mob', {

		type: "loop",
		perPage: 1,
		speed: 700,
		easing: "ease",
		arrows: false,
		pagination: false,
		gap: 20,

		breakpoints: {
			992: {
				// params
			},

			550: {
				// params
			}
		}

	});

	slider.mount();

}

if(document.querySelector('.related-articles__slider')) {

	const slider = new Splide('.related-articles__slider', {

		type: "loop",
		perPage: 3,
		perMove: 1,
		speed: 700,
		easing: "ease",
		pagination: false,
		gap: 30,

		breakpoints: {
			992: {
				perPage: 2,
			},

			550: {
				perPage: 1,
				gap: 20,
			}
		}

	});

	slider.mount();

}

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <select> -=-=-=-=-=-=-=-=-=-=-=-=

document.querySelectorAll('.custom-select').forEach(select => {
	new SlimSelect({
		select: select,
		settings: {
			showSearch: false,
		  }
	  })
})

// =-=-=-=-=-=-=-=-=-=-=-=- </select> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <clipboard> -=-=-=-=-=-=-=-=-=-=-=-=

const copyBtn = document.querySelectorAll('.copy-btn');
copyBtn.forEach(copyBtn => {

	const copy = new ClipboardJS(copyBtn);

	copy.on('success', function(event) {
		copyBtn.classList.remove('is-copied');
		setTimeout(() => {
			copyBtn.classList.add('is-copied');
		},0)
	});

})

// =-=-=-=-=-=-=-=-=-=-=-=- </clipboard> -=-=-=-=-=-=-=-=-=-=-=-=


