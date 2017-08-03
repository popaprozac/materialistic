import { animationFrame, checkForMenu, classList, isArray, promise } from './lib/utilities'
import FastClick from 'fastclick'

import './material.css'

import Button from './components/button'
import Input from './components/input'
import List from './components/list'
import Menu from './components/menu'
import Tab from './components/tab'
import Divider from './components/divider'

export default class Material {
	constructor () {
		this.init()
	}

	init (elements = []) {
		animationFrame()
		classList()
		promise()
		document.addEventListener('DOMContentLoaded', () => {
			FastClick.attach(document.body)
			if (isArray(elements) && elements.length > 0) {
				this.prepare(elements)
			} else {
				this.prepare()
			}
			this.globals()
		})
	}

	prepare (elements = []) {
		if (isArray(elements) && elements.length > 0) {
			elements.forEach(element => {
				switch (element) {
					case 'button':
						this.buttons(document.getElementsByTagName('button'))
						break
					case 'input':
						this.inputs(document.getElementsByTagName('input'))
						break
					case 'list':
						this.lists(document.querySelectorAll('[data-list]'))
						break
					case 'menu':
						this.menus(document.querySelectorAll('[data-menu]'))
						break
					case 'tab':
						this.tabs(document.querySelectorAll('[data-tabs]'))
						break
					default:
						return false
				}
			})
		} else {
			this.buttons(document.getElementsByTagName('button'))
			this.inputs(document.getElementsByTagName('input'))
			this.lists(document.querySelectorAll('[data-list]'))
			this.menus(document.querySelectorAll('[data-menu]'))
			this.tabs(document.querySelectorAll('[data-tabs]'))
		}
	}

	buttons (buttons) {
		Array.prototype.forEach.call(buttons, button => {
			new Button(button)
		})
	}

	inputs (inputs) {
		Array.prototype.forEach.call(inputs, input => {
			new Input(input)
		})
	}

	lists (lists) {
		Array.prototype.forEach.call(lists, list => {
			new List(list)
		})
	}

	menus (menus) {
		Array.prototype.forEach.call(menus, menu => {
			new Menu(menu)
		})
	}

	tabs (tabs) {
		Array.prototype.forEach.call(tabs, tab => {
			new Tab(tab)
		})
	}

	globals () {
		document.onclick = event => {
			checkForMenu(event)
		}
	}
}