import { mobile, toggleAttr } from '../../lib/utilities'
import ripple from '../../lib/ripple'

import './input.css'

export default class Input {
	constructor (element) {
		this.element = element
		this.underline = document.createElement('hr')
		this.label = document.createElement('label')
		this.error = document.createElement('span')
		this.errorText = ``
		this.pattern = ``
		this.value = document.createElement('span')

		this.svg = `
			<svg viewbox="0 0 30 42">
				<path fill="#2196F3"
					d="M15 3
						Q16.5 6.8 25 18
						A12.8 12.8 0 1 1 5 18
						Q13.5 6.8 15 3z" />
			</svg>
		`

		this.styles = {
			label: {
				float: `color: #2196F3; transform: translate3d(0,-20px,0) scale(0.75);`,
				default: `color: #999; transform: translate3d(0,0,0) scale(1);`,
				filled: `color: #999; transform: translate3d(0,-20px,0) scale(0.75);`,
				error: `color: #F44336; transform: translate3d(0,-20px,0) scale(0.75);`
			},
			error: {
				show: `opacity: 1`,
				hide: `opacity: 0`
			},
			underline: {
				show: `background-color: #2196F3; transform: scaleX(1);`,
				hide: `background-color: #2196F3; transform: scaleX(0);`,
				error: `background-color: #F44336; transform: scaleX(1)`
			}
		}

		this.errors = false
		this.floating = false

		this.init()
	}

	init () {
		if (this.element.getAttribute('type') !== 'checkbox' && this.element.getAttribute('type') !== 'radio') {
			this.element.parentElement.appendChild(this.underline)
		} else if (this.element.getAttribute('type') === 'checkbox' || this.element.getAttribute('type') === 'radio') {
			if (this.element.checked) {
				this.element.parentElement.setAttribute('data-checked', '')
			}
			if (this.element.parentElement.hasAttribute('data-checked')) {
				this.element.checked = true
			}
			if (this.element.getAttribute('type') === 'checkbox') {
				this.checkbox()
			}
			if (this.element.getAttribute('type') === 'radio') {
				this.radio()
			}
			if (this.element.parentElement.parentElement.hasAttribute('data-radio-group')) {
				this.radioGroup()
			}
			const label = Array.prototype.filter.call(this.element.parentElement.children, child => {
				return child.tagName === 'LABEL'
			})[0]
			if (label) {
				this.element.parentElement.style.marginRight = `${label.clientWidth + 8}px`
			}
		}
		if (this.element.parentElement.hasAttribute('data-floating-label')) {
			this.floating = true
			this.label.innerText = this.element.getAttribute('placeholder')
			this.element.parentElement.appendChild(this.label)
		}
		if (this.element.parentElement.hasAttribute('data-error')) {
			this.errors = true
			this.errorText = this.element.parentElement.getAttribute('data-error')
			this.error.innerText = this.errorText
			this.element.parentElement.appendChild(this.error)
			if (this.element.parentElement.hasAttribute('data-pattern')) {
				this.pattern = this.element.parentElement.getAttribute('data-pattern')
			}
		}
		if (!this.element.parentElement.hasAttribute('data-slider')) {
			this.events()
		} else {
			this.underline.style.transform = `translate3d(0,-50%,0) scaleX(${this.element.value/100})`
			if (!this.element.hasAttribute('step')) {
				// rounding may be necessary
				this.element.setAttribute('step', '0.25')
				this.slider()
			} else {
				this.slider()
			}
			if (this.element.parentElement.hasAttribute('data-discrete')) {
				this.element.parentElement.appendChild(this.label)
				this.label.style.left = `${this.element.value - 10}%`
				this.label.innerHTML = this.svg
				this.value.innerText = this.element.value
				this.label.appendChild(this.value)
			}
		}
	}

	events () {
		this.element.onfocus = event => {
			if (this.errors) {
				this.element.value.match(this.pattern) ? 
					this.underline.style.cssText = this.styles.underline.show :
					false
				this.element.value === '' ?
					this.underline.style.cssText = this.styles.underline.show :
					false
				this.floating ?
					this.label.style.cssText = this.styles.label.float :
					false
				this.floating && this.element.value !== '' && !this.element.value.match(this.pattern) ?
					this.label.style.cssText = this.styles.label.error :
					false
			} else {
				this.underline.style.cssText = this.styles.underline.show
				this.floating ?
					this.label.style.cssText = this.styles.label.float :
					false
			}
		}
		this.element.oninput = event => {
			if (this.element.value.match(this.pattern) || this.element.value === '') {
				this.underline.style.cssText = this.styles.underline.show
				this.label.style.cssText = this.styles.label.float
				this.error.style.cssText = this.styles.error.hide
			}
		}
		this.element.onblur = event => {
			if (this.errors) {
				this.element.value.match(this.pattern) ?
					this.underline.style.cssText = this.styles.underline.hide :
					false
				!this.element.value.match(this.pattern) && this.element.value !== '' ?
					this.underline.style.cssText = this.styles.underline.error :
					false
				!this.element.value.match(this.pattern) && this.element.value !== '' ?
					this.label.style.cssText = this.styles.label.error :
					false
				!this.element.value.match(this.pattern) && this.element.value !== '' ?
					this.error.style.cssText = this.styles.error.show :
					false
				this.element.value === '' ?
					this.underline.style.cssText = this.styles.underline.hide :
					false
				this.floating && this.element.value === '' ?
					this.label.style.cssText = this.styles.label.default :
					false
				this.floating && this.element.value !== '' && this.element.value.match(this.pattern) ?
					this.label.style.cssText = this.styles.label.filled :
					false
				this.floating && this.element.value !== '' && !this.element.value.match(this.pattern) ?
					this.label.style.cssText = this.styles.label.error :
					false
			} else {
				this.underline.style.cssText = this.styles.underline.hide
				this.floating ?
					this.label.style.cssText = this.styles.label.default :
					false
				this.floating && this.element.value !== '' ?
					this.label.style.cssText = this.styles.label.filled :
					false
			}
		}
	}

	checkbox () {
		if (this.element.parentElement.hasAttribute('data-ripple')) {
			this.element.parentElement.onmousedown = event => {
				mobile() ? false : ripple(event, this.element.parentElement, true)
			}
			this.element.parentElement.ontouchstart = event => {
				ripple(event, this.element.parentElement, true)
			}
		}
		this.element.parentElement.onclick = event => {
			toggleAttr(this.element.parentElement, 'data-checked')
			this.element.checked = !this.element.checked
		}
	}

	radio () {
		if (this.element.parentElement.hasAttribute('data-ripple')) {
			this.element.parentElement.onmousedown = event => {
				mobile() ? false : ripple(event, this.element.parentElement, true)
			}
			this.element.parentElement.ontouchstart = event => {
				ripple(event, this.element.parentElement, true)
			}
		}
		this.element.parentElement.onclick = event => {
			if (!this.element.parentElement.hasAttribute('data-checked')) {
				toggleAttr(this.element.parentElement, 'data-checked')
				this.element.checked = !this.element.checked
			}
		}
	}

	radioGroup () {
		this.element.parentElement.onclick = event => {
			const radioGroup = Array.prototype.map.call(this.element.parentElement.parentElement.children, container => {
				const radios = Array.prototype.filter.call(container.children, radio => {
					return radio.tagName === 'INPUT'
				})[0]
				return radios
			})
			Array.prototype.forEach.call(this.element.parentElement.children, radio => {
				if (radio.tagName === 'INPUT') {
					Array.prototype.forEach.call(radioGroup, uncheck => {
						if (uncheck !== radio) {
							uncheck.parentElement.removeAttribute('data-checked')
							uncheck.checked = false
							radio.parentElement.setAttribute('data-checked', '')
							radio.checked = true
						}
					})
				}
			})
		}
	}

	slider () {
		this.element.oninput = event => {
			this.underline.style.transform = `translate3d(0,-50%,0) scaleX(${this.element.value/100})`
			this.value.innerText = Math.round(this.element.value)
			this.label.style.left = `${this.element.value - 10}%`
			if (this.element.value === '0') {
				this.element.classList.add('zero')
			} else {
				this.element.classList.remove('zero')
			}
		}
	}
}