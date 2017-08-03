import './menu.css'

export default class Menu {
	constructor (element) {
		this.element = element
		this.init()
	}

	init () {
		Array.prototype.forEach.call(this.element.children, list => {
			if (list.hasAttribute('data-list')) {
				Array.prototype.forEach.call(list.children, listItem => {
					this.close(listItem)
				})
			}
		})
	}

	close (listItem) {
		listItem.onclick = event => {
			this.element.removeAttribute('data-open')
		}
	}
}