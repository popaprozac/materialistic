import { delay, mobile, toggleAttr } from '../../lib/utilities'
import ripple from '../../lib/ripple'

import './button.css'

export default class Button {
	constructor (element) {
		this.element = element
		this.bgLayer = document.createElement('div')
		this.init()
	}

	init () {
		this.bgLayer.classList.add('bg')
		this.element.appendChild(this.bgLayer)
		if (this.element.hasAttribute('data-ripple')) {
			this.events()
		}
		if (this.element.hasAttribute('data-toolbar')) {
			this.transform()
		}
		if (this.element.parentElement.hasAttribute('data-speed-dial')) {
			this.dial()
		}
		if (this.element.parentElement.hasAttribute('data-menu')) {
			this.menu()
		}
	}

	events () {
		this.element.onmousedown = event => {
			mobile() ? false : (this.element.hasAttribute('data-icon') ? ripple(event, this.element, true) : ripple(event, this.element))
		}
		this.element.ontouchstart = event => {
			this.element.classList.add('mobile', 'active', 'hover')
			this.element.hasAttribute('data-icon') ? ripple(event, this.element, true) : ripple(event, this.element)
		}
	}

	dial () {
		this.element.onclick = event => {
			const dial = document.querySelector('[data-speed-dial][data-open]')
			if (!this.element.parentElement.hasAttribute('data-open')) {
				this.element.children[0].innerText = 'close'
			} else {
				this.element.children[0].innerText = this.element.parentElement.getAttribute('data-icon')
			}
			if (event.target.parentElement !== dial && dial) {
				dial.children[0].children[0].innerText = dial.getAttribute('data-icon')
				dial.removeAttribute('data-open')
			}
			toggleAttr(this.element.parentElement, 'data-open')
		}
	}

	menu () {
		this.element.onclick = event => {
			const menu = document.querySelector('[data-menu][data-open]')
			if (event.target.parentElement !== menu && menu) {
				menu.removeAttribute('data-open')
			}
			toggleAttr(this.element.parentElement, 'data-open')
		}
	}

	// transform () {
	// 	this.element.onclick = event => {
	// 		const toolbar = document.createElement('div')
	// 		const button = this.element.cloneNode(true)
	// 		const position = button.style.position
	// 		const icon = button.children[0]
	// 		const tabs = button.children[1]
	// 		const coords = {
	// 			left: this.element.getBoundingClientRect().left,
	// 			top: this.element.getBoundingClientRect().top
	// 		}
	// 		Array.prototype.forEach.call(tabs.children, tab => {
	// 			// new tab
	// 		})
	// 		toolbar.setAttribute('data-fab-toolbar', '')
	// 		toolbar.appendChild(button)
	// 		toolbar.style.cssText = `
	// 			height: ${this.element.clientHeight}px;
	// 			left: ${coords.left}px;
	// 			top: ${coords.top}px;
	// 			width: ${this.element.clientWidth}px;
	// 		`
	// 		this.element.parentElement.appendChild(toolbar)
	// 		this.element.style.cssText = `
	// 			opacity: 0;
	// 			pointer-events: none;
	// 		`
	// 		toolbar.style.cssText = `
	// 			height: ${this.element.clientHeight}px;
	// 			left: ${coords.left}px;
	// 			top: ${coords.top}px;
	// 			transform: translate3d(-${coords.left}px,${window.innerHeight - coords.top - this.element.clientHeight}px,0);
	// 			width: 100%;
	// 		`
	// 		button.style.cssText = `
	// 			transform: translate3d(${window.innerWidth/2 - this.element.clientWidth/2}px,0,0);
	// 		`
	// 		icon.style.cssText = `opacity: 0;`
	// 		delay(150).then(() => {
	// 			button.style.cssText = `
	// 				border-radius: 0;
	// 				width: 100%;
	// 			`
	// 		})
	// 		delay(355).then(() => {
	// 			tabs.style.display = 'flex'
	// 			delay(155).then(() => {
	// 				tabs.style.opacity = 1
	// 				Array.prototype.forEach.call(tabs.children, tab => {
	// 					tab.onclick = event => {
	// 						tabs.style.opacity = 0
	// 						button.style.cssText = `
	// 							transform: translate3d(${window.innerWidth/2 - this.element.clientWidth/2}px,0,0);
	// 						`
	// 						delay(150).then(() => {
	// 							icon.style.cssText = `opacity: 1;`
	// 							toolbar.style.cssText = `
	// 								height: ${this.element.clientHeight}px;
	// 								left: ${coords.left}px;
	// 								top: ${coords.top}px;
	// 								width: ${this.element.clientWidth}px;
	// 							`
	// 							button.style.cssText = ``
	// 							delay(355).then(() => {
	// 								this.element.style.cssText = `
	// 									opacity: 1;
	// 									pointer-events: auto;
	// 								`
	// 								toolbar.remove()
	// 							})
	// 						})
	// 					}
	// 				})
	// 			})
	// 		})
	// 	}
	// }
}