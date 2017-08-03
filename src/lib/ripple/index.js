import { delay } from '../utilities'

import './ripple.css'

function remove (element, ripple) {
	ripple.style.opacity = `0`
	element.classList.remove('active', 'hover')
	delay(700).then(() => ripple.remove())
}

function ripple (event, element, squared = false) {
	const ripple = document.createElement('div')
	ripple.classList.add('ripple')
	const rect = element.getBoundingClientRect()
	const client = {
		x: event.type === 'touchstart' ? event.touches[0].clientX : event.clientX,
		y: event.type === 'touchstart' ? event.touches[0].clientY : event.clientY
	}
	const coords = {
		x: client.x - rect.left,
		y: client.y - rect.top
	}
	const size = {
		width: element.offsetWidth,
		height: element.offsetHeight
	}
	const offset = {
		x: Math.abs(size.width/2 - coords.x),
		y: Math.abs(size.height/2 - coords.y)
	}
	const delta = {
		x: size.width/2 + offset.x,
		y: size.height/2 + offset.y
	}
	if (squared) {
		ripple.style.cssText = `
			height: 100%;
			left: 50%;
			top: 50%;
			width: 100%;
		`
	} else {
		const sized = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2) - 2 * delta.x * delta.y * Math.cos(90 / 180 * Math.PI)) * 2
		ripple.style.cssText = `
			height: ${sized}px;
			left: ${coords.x}px;
			top: ${coords.y}px;
			width: ${sized}px;
		`
	}
	element.appendChild(ripple)
	delay(1).then(() => ripple.style.transform = `translate3d(-50%,-50%,0) scale(1)`)
	element.onmouseup = event => {
		remove(element, ripple)
	}
	element.onmouseleave = event => {
		remove(element, ripple)
	}
	element.ontouchend = event => {
		remove(element, ripple)
	}
	element.ontouchcancel = event => {
		remove(element, ripple)
	}
}

export default (event, element, squared = false) => {
	if ((event.touches && event.touches.length === 1) || event.type !== 'touchstart') {
		ripple(event, element, squared)
	}
}