import { delay, mobile, toggleAttr } from '../../lib/utilities'
import ripple from '../../lib/ripple'

import './list.css'

export default class List {
	constructor (element) {
		this.element = element
		this.init()
	}

	init () {
		Array.prototype.forEach.call(this.element.children, listItem => {
			const bg = document.createElement('div')
			bg.classList.add('bg')
			listItem.appendChild(bg)
			if (listItem.hasAttribute('data-ripple')) {
				this.events(listItem)
			}
		})
	}

	events (listItem) {
		listItem.onmousedown = event => {
			mobile() ? false : (listItem.hasAttribute('data-icon') ? ripple(event, listItem, true) : ripple(event, listItem))
		}
		listItem.ontouchstart = event => {
			listItem.classList.add('mobile', 'active', 'hover')
			listItem.hasAttribute('data-icon') ? ripple(event, listItem, true) : ripple(event, listItem)
		}
	}
}