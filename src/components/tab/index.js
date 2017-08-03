import { mobile, toggleAttr } from '../../lib/utilities'
import ripple from '../../lib/ripple'

import './tab.css'

export default class Tab {
	constructor (element) {
		this.element = element
		this.tabs = this.element.children.length
		this.indicator = document.createElement('hr')
		this.init()
	}

	init () {
		this.indicator.setAttribute('data-indicator', '')
		this.indicator.style.width = `${100/this.tabs}%`
		const index = this.findActive()
		this.indicator.style.transform = `translateX(${index * 100}%)`
		Array.prototype.forEach.call(this.element.children, tab => {
			const bgLayer = document.createElement('div')
			bgLayer.classList.add('bg')
			tab.appendChild(bgLayer)
			if (tab.hasAttribute('data-ripple')) {
				tab.onmousedown = event => {
					mobile() ? false : ripple(event, tab)
				}
				tab.ontouchstart = event => {
					tab.classList.add('mobile', 'active', 'hover')
					ripple(event, tab)
				}
			}
			this.events(tab)
		})
		this.element.appendChild(this.indicator)
	}

	events (tab) {
		tab.onclick = event => {
			Array.prototype.forEach.call(this.element.children, child => {
				if (child.hasAttribute('data-active')) {
					child.removeAttribute('data-active')
				}
			})
			tab.setAttribute('data-active', '')
			const index = Array.prototype.indexOf.call(this.element.children, tab)
			this.indicator.style.transform = `translateX(${index * 100}%)`
		}
	}

	findActive () {
		const active = Array.prototype.filter.call(this.element.children, tab => {
			return tab.hasAttribute('data-active')
		})[0]
		if (!active) {
			this.element.children[0].setAttribute('data-active', '')
			return Array.prototype.indexOf.call(this.element.children, this.element.children[0])
		} else {
			return Array.prototype.indexOf.call(this.element.children, active)
		}
	}
}