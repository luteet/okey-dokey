
const 
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	burger = document.querySelector('.header__burger'),
	headerAccount = document.querySelector('.header-account'),
	aside = document.querySelector('.aside'),
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

					removeHash();
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

const popup = new Popup({
	saveID: true,
});

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

const accountChatMain = document.querySelector('.account-chat__main'),
accountChatAside = document.querySelector('.account-chat__aside');

function scrollHorizontally(container, scrollValue) {
	var startTime = null;
	var duration = 400;
	var startScrollLeft = container.scrollLeft;
	var targetScrollLeft = scrollValue;
  
	function animateScroll(time) {
	  if (!startTime) startTime = time;
	  var progress = (time - startTime) / duration;
	  var easeInOutCubic = progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
	  container.scrollLeft = startScrollLeft + (targetScrollLeft - startScrollLeft) * easeInOutCubic;
  
	  if (progress < 1) {
		requestAnimationFrame(animateScroll);
	  }
	}
  
	requestAnimationFrame(animateScroll);
  }
  

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

	const headerAccountLangTarget = $(".header-account__lang--target")
	if(headerAccountLangTarget && getDeviceType() != "desktop") {
	
		headerAccountLangTarget.classList.toggle('is-active');
	
	} else if(!$('.header-account__lang') && document.querySelector('.header-account__lang--target.is-active')) {

		document.querySelector('.header-account__lang--target.is-active').classList.remove('is-active');

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

	
	
	// =-=-=-=-=-=-=-=-=-=-=-=- <scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=
	
	let scrollTo = $('.scroll-to');
	if(scrollTo) {
		event.preventDefault();
		let section;
	
		section = document.querySelector(scrollTo.getAttribute('href'))
	
		menu.forEach(elem => {
			elem.classList.remove('_mob-menu-active')
		})
	
		if(section) {
			section.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		} else {
			body.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-account-notification> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerAccountNotificationTarget = $(".header-account__notification--target")
	if(headerAccountNotificationTarget) {
	
		headerAccountNotificationTarget.classList.add('is-active');
	
	} else if(!$('.header-account__notification') && document.querySelector('.header-account__notification--target.is-active')) {
		document.querySelector('.header-account__notification--target.is-active').classList.remove('is-active');
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-account-notification> -=-=-=-=-=-=-=-=-=-=-=-=

	// =-=-=-=-=-=-=-=-=-=-=-=- <header-account-notification> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerAccountProfileTarget = $(".header-account__profile--target")
	if(headerAccountProfileTarget) {
	
		headerAccountProfileTarget.classList.add('is-active');
	
	} else if(!$('.header-account__profile') && document.querySelector('.header-account__profile--target.is-active')) {
		document.querySelector('.header-account__profile--target.is-active').classList.remove('is-active');
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-account-notification> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <aside> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerAccountOpenAsideBtn = $(".header-account__open-aside--btn")
	if(headerAccountOpenAsideBtn) {
	
		aside.classList.add('is-active');
	
	}

	const asideClose = $(".aside__close")
	if(asideClose) {
	
		aside.classList.remove('is-active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </aside> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <account-block-accordion> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const accountBlockAccordionTarget = $(".account-block__accordion-target")
	if(accountBlockAccordionTarget) {
	
		accountBlockAccordionTarget.classList.toggle('is-active')
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </account-block-accordion> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <account-chat-aside-item> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const accountChatAsideTtem = $(".account-chat__aside-item")
	if(accountChatAsideTtem && accountChatMain) {
	
		event.preventDefault();
		const activeItem = accountChatAsideTtem.closest('ul').querySelector('.is-active');
		if(activeItem) activeItem.classList.remove('is-active');

		accountChatAsideTtem.classList.add('is-active')
		if(windowSize >= 1300) {
			accountChatMain.classList.remove('fade-in');
			accountChatMain.classList.add('fade-out');
			setTimeout(() => {
				accountChatMain.classList.remove('fade-out');
				accountChatMain.classList.add('fade-in');
			},500)
		} else {
			accountChatAside.classList.add('is-loading');
			setTimeout(() => {
				accountChatAside.classList.add('fade-out');
				setTimeout(() => {
					accountChatAside.style.display = 'none';
					accountChatAside.classList.remove('fade-out');
				},300)
				accountChatMain.classList.remove('fade-out');
				accountChatMain.classList.add('fade-in');
				accountChatAside.classList.remove('is-loading');

				window.scrollTo({
					left: 0,
					top: getCoords(accountChatMain).top - 30,
					behavior: "smooth",
				})
				
			},300)
		}
		
	
	}

	const accountChatForward = $('.account-chat__forward')
	if(accountChatForward && accountChatMain) {

		event.preventDefault()
		const activeItem = document.querySelector('.account-chat__aside-item.is-active');
		if(activeItem) activeItem.classList.remove('is-active');
		
		accountChatMain.classList.add('fade-out');
		accountChatMain.classList.remove('fade-in');
		
		setTimeout(() => {
			accountChatAside.style.removeProperty('display');
			accountChatAside.classList.add('fade-in');
		},300)

	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </account-chat-aside-item> -=-=-=-=-=-=-=-=-=-=-=-=

	const accountTableControlsArrow = $(".account-table-controls__arrow")
	if (accountTableControlsArrow) {

		if(!accountTableControlsArrow.classList.contains('is-active')) {
	
			accountTableControlsArrow.classList.add('is-active');

			const tableWrapper = accountTableControlsArrow.closest('.account-table-wrapper'),
			container = tableWrapper.querySelector('.account-table-container'),
			td = tableWrapper.querySelector('tbody tr').querySelectorAll('td');

			let scrollNextCheck = false, scrollPrevCheck = false;
			if (accountTableControlsArrow.classList.contains('is-next')) {
				td.forEach((td, index) => {
					
					if (getCoords(td).left - getCoords(tableWrapper).left-1 > 1 && !scrollNextCheck) {	

						scrollNextCheck = true;
						container.classList.add('disable-snap');
						setTimeout(() => {
							scrollHorizontally(container, getCoords(td).left - getCoords(tableWrapper).left + container.scrollLeft)
						},0)
						setTimeout(() => {
							container.classList.remove('disable-snap');
						},400)
					}
				})
			} else if (accountTableControlsArrow.classList.contains('is-prev')) {
				Array.from(td).reverse().forEach((td, index) => {
					
					if (getCoords(td).left - getCoords(tableWrapper).left-2 <= -10 && !scrollPrevCheck) {
						scrollPrevCheck = true;

						container.classList.add('disable-snap');
						
						setTimeout(() => {
							scrollHorizontally(container, getCoords(td).left - getCoords(tableWrapper).left + container.scrollLeft)
						},0)
						
						setTimeout(() => {
							container.classList.remove('disable-snap');
						},400)
					}
				})
			}

			setTimeout(() => {
				accountTableControlsArrow.classList.remove('is-active');
			},400)

		}

	}


	// =-=-=-=-=-=-=-=-=-=-=-=- <account-chat-group-members> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const accountChatGroupMembersLink = $(".account-chat__group-members--link")
	if(accountChatGroupMembersLink) {
	
		const popup = accountChatGroupMembersLink.closest('.account-chat__group-members').querySelector('.account-chat__group-popup');
		console.log(accountChatGroupMembersLink.closest('.account-chat__group-members').querySelector('.account-chat__group-popup'))
		if(popup) {
			popup.classList.remove('fade-out');
			popup.classList.add('is-active');
			popup.classList.add('fade-in');
		}
	
	}

	const accountChatGroupPopupClose = $(".account-chat__group-popup--close")
	if(accountChatGroupPopupClose) {

		const popup = accountChatGroupPopupClose.closest('.account-chat__group-popup');
		popup.classList.remove('fade-in');
		popup.classList.add('fade-out');
		setTimeout(() => {
			popup.classList.remove('is-active');
		},300)

	} else if(!$('.account-chat__group-popup') && !accountChatGroupMembersLink) {
		document.querySelectorAll('.account-chat__group-popup').forEach(popup => {
			popup.classList.remove('fade-in');
			popup.classList.add('fade-out');
			setTimeout(() => {
				popup.classList.remove('is-active');
			},300)
		})
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </account-chat-group-members> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <account-tooltip> -=-=-=-=-=-=-=-=-=-=-=-=
	
	if(!$('.account-table__tip--content') && !$('.account-table__tip--icon')) {
	
		document.querySelectorAll('.account-table__tip--content.is-active').forEach(content => {
			content.classList.remove('is-visible');
			setTimeout(() => {
				content.classList.remove('is-active');
			},300)
		})

		document.querySelectorAll('.account-table__tip--icon.is-active').forEach(icon => {
			icon.classList.remove('is-active');
		})
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </account-tooltip> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <student-audio-listenin-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const studentAudioListeningTarget = $(".student-audio-listening__target")
	if(studentAudioListeningTarget) {
	
		studentAudioListeningTarget.classList.toggle('is-active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </student-audio-listenin-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=

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
const accountTableTips = document.querySelectorAll('.account-table__tip'),
accountTableTipsArray = [];
accountTableTips.forEach((tip, index) => {
	const content = tip.querySelector('.account-table__tip--content'),
	target = tip.querySelector('.account-table__tip--icon');

	body.append(content);

	target.addEventListener('pointerenter', function (event) {
		if(getDeviceType() == "desktop") {
			target.classList.add('is-active');
			content.classList.add('is-active');
			setTimeout(() => {
				content.classList.add('is-visible');
			},0)
		}
	})

	target.addEventListener('click', function (event) {
		if(getDeviceType() != "desktop") {
			document.querySelectorAll('.account-table__tip--content.is-active').forEach(content => {
				content.classList.remove('is-visible');
				setTimeout(() => {
					content.classList.remove('is-active');
				},300)
			})
	
			document.querySelectorAll('.account-table__tip--icon.is-active').forEach(icon => {
				icon.classList.remove('is-active');
			})

			target.classList.add('is-active');
			content.classList.add('is-active');
			setTimeout(() => {
				content.classList.add('is-visible');
			},0)
		}
	})

	content.addEventListener('pointerleave', function (event) {
		if(getDeviceType() == "desktop") {
			target.classList.remove('is-active');
			content.classList.remove('is-visible');
			setTimeout(() => {
				content.classList.remove('is-active');
			},300)
		}
	})

	accountTableTipsArray[index] = {
		target: tip.querySelector('.account-table__tip--icon'),
		content: content,
	}
})

if(document.querySelector('.account-table__tip')) {
	setInterval(() => {
		Array.from(accountTableTipsArray).forEach(tip => {
			let x = tip['target'].getBoundingClientRect().x + tip['target'].offsetWidth;
	
			if(windowSize >= 550) {
				if(x > windowSize - 250) {
					tip['content'].classList.add('on-left');
				} else {
					tip['content'].classList.remove('on-left');
				}
			} else {
				if(x > windowSize - 150) {
					tip['content'].classList.add('on-left');
				} else {
					tip['content'].classList.remove('on-left');
				}
			}
			
			
			tip['content'].style.setProperty('--x', tip['target'].getBoundingClientRect().x + tip['target'].offsetWidth + 'px')
			tip['content'].style.setProperty('--y', tip['target'].getBoundingClientRect().y + 'px')
		})
	},100)
}

function resize() {

	if(header) {
		html.style.setProperty("--height-header", header.offsetHeight + "px");
	} else if(headerAccount) {
		html.style.setProperty("--height-header", headerAccount.offsetHeight + "px");
	}
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

if(document.querySelector('.student-awards__slider')) {

	document.querySelectorAll('.student-awards__slider').forEach(sliderEl => {
		
		const slider = new Splide(sliderEl, {

			
			autoWidth: true,
			gap: 6,
			
			speed: 500,
			easing: "ease",
			type: "loop",
			pagination: false,
	
		});
	
		slider.mount();
	})

}

document.querySelectorAll('.account-chat__group-popup--slider').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		autoWidth: true,
		pagination: false,
		speed: 500,
		easing: "ease",
		perMove: 1,
		gap: 15,

		breakpoints: {
			768: {
				gap: 11,
			}
		}

	});

	slider.mount();

})

document.querySelectorAll('.teacher-lectures__body').forEach(sliderElement => {

	const slider = new Splide(sliderElement, {

		perPage: 1,
		gap: 15,
		pagination: false,
		speed: 700,
		perMove: 1,
		easing: "ease",
		grid: {
			rows: 2,
			cols: 3,
			gap : {
				row: '30px',
				col: '15px',
			},
	  	},

		breakpoints: {
			1850: {
				grid: {
					rows: 2,
					cols: 2,
					gap : {
						row: '30px',
						col: '15px',
					},
				},
			},

			1600: {
				grid: {
					rows: 2,
					cols: 1,
					gap : {
						row: '30px',
						col: '15px',
					},
				},
			},
			
			1420: {
				grid: {
					rows: 2,
					cols: 2,
					gap : {
						row: '30px',
						col: '15px',
					},
				},
			},

			992: {
				destroy: true,
			}
		}

	});

	slider.mount(window.splide.Extensions);

})

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



// =-=-=-=-=-=-=-=-=-=-=-=- <input-file> -=-=-=-=-=-=-=-=-=-=-=-=

document.querySelectorAll('.account-chat__file').forEach(file => {	
	if(file.querySelector('input')) {
		file.querySelector('input').addEventListener('change', function (event) {
			let text = '';
			Array.from(event.target.files).forEach((fileEl, index) => {
				if(index != 0) {
					text = ', ' + fileEl.name;
				} else {
					text = fileEl.name;
				}
				
			})

			file.querySelector('span').querySelector('span').textContent = text;
		})
	}
})

// =-=-=-=-=-=-=-=-=-=-=-=- </input-file> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <audio-player> -=-=-=-=-=-=-=-=-=-=-=-=

const players = document.querySelectorAll('.student-audio-listening__player audio');
players.forEach(audio => {

	let player = new MediaElementPlayer(audio, {
		hideVolumeOnTouchDevices: false,
		startVolume: 1,
	});

	const playBtn = audio.closest('.student-audio-listening__player').querySelector('.student-audio-listening__player--play-pause'),
	seekPrevBtn = audio.closest('.student-audio-listening__player').querySelector('.student-audio-listening__player--seek.is-prev .student-audio-listening__player--seek-arrow'),
	seekNextBtn = audio.closest('.student-audio-listening__player').querySelector('.student-audio-listening__player--seek.is-next .student-audio-listening__player--seek-arrow');

	if(seekPrevBtn) {
		seekPrevBtn.addEventListener('click', function (event) {
			player.setCurrentTime(player.getCurrentTime()-10)
		})
	}

	if(seekNextBtn) {
		seekNextBtn.addEventListener('click', function (event) {
			player.setCurrentTime(player.getCurrentTime()+10)
		})
	}

	if(playBtn) {
		playBtn.addEventListener('click', function (event) {
			if(!playBtn.classList.contains('is-playing')) {
				player.play();
			} else {
				player.pause();
			}
		})
	
		player.domNode.addEventListener('play', function () {
			playBtn.classList.add('is-playing');
		})

		player.domNode.addEventListener('pause', function () {
			playBtn.classList.remove('is-playing');
		})
	}

	

})



/* if(player.created) {
	const audio = document.querySelectorAll('audio');

	players.forEach(audio => {
		const audioBlock = audio.closest('.mejs__audio'),
		buttons = audioBlock.querySelectorAll('.mejs__button')

		buttons.forEach(button => {
			if(button.querySelector('svg')) {
				const icons = button.querySelectorAll('use');
				icons.forEach(icon => {
					icon.setAttribute('xlink:href', audio.dataset.base + icon.getAttribute('xlink:href'));
				})
			}
		})
	})

} */

// =-=-=-=-=-=-=-=-=-=-=-=- </audio-player> -=-=-=-=-=-=-=-=-=-=-=-=
