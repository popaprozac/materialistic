import Promise from 'promise-polyfill'
import setAsap from 'setasap'

export function mobile () {
	return 'ontouchstart' in window
}

export function classList () {
	/*
	* classList.js: Cross-browser full element.classList implementation.
	* 1.1.20170427
	*
	* By Eli Grey, http://eligrey.com
	* License: Dedicated to the public domain.
	*   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
	*/

	/*global self, document, DOMException */

	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

	if ("document" in self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (!("classList" in document.createElement("_")) 
		|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

	(function (view) {

	"use strict";

	if (!('Element' in view)) return;

	var
			classListProp = "classList"
		, protoProp = "prototype"
		, elemCtrProto = view.Element[protoProp]
		, objCtr = Object
		, strTrim = String[protoProp].trim || function () {
			return this.replace(/^\s+|\s+$/g, "");
		}
		, arrIndexOf = Array[protoProp].indexOf || function (item) {
			var
					i = 0
				, len = this.length
			;
			for (; i < len; i++) {
				if (i in this && this[i] === item) {
					return i;
				}
			}
			return -1;
		}
		// Vendors: please allow content code to instantiate DOMExceptions
		, DOMEx = function (type, message) {
			this.name = type;
			this.code = DOMException[type];
			this.message = message;
		}
		, checkTokenAndGetIndex = function (classList, token) {
			if (token === "") {
				throw new DOMEx(
						"SYNTAX_ERR"
					, "An invalid or illegal string was specified"
				);
			}
			if (/\s/.test(token)) {
				throw new DOMEx(
						"INVALID_CHARACTER_ERR"
					, "String contains an invalid character"
				);
			}
			return arrIndexOf.call(classList, token);
		}
		, ClassList = function (elem) {
			var
					trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
				, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
				, i = 0
				, len = classes.length
			;
			for (; i < len; i++) {
				this.push(classes[i]);
			}
			this._updateClassName = function () {
				elem.setAttribute("class", this.toString());
			};
		}
		, classListProto = ClassList[protoProp] = []
		, classListGetter = function () {
			return new ClassList(this);
		}
	;
	// Most DOMException implementations don't allow calling DOMException's toString()
	// on non-DOMExceptions. Error's toString() is sufficient here.
	DOMEx[protoProp] = Error[protoProp];
	classListProto.item = function (i) {
		return this[i] || null;
	};
	classListProto.contains = function (token) {
		token += "";
		return checkTokenAndGetIndex(this, token) !== -1;
	};
	classListProto.add = function () {
		var
				tokens = arguments
			, i = 0
			, l = tokens.length
			, token
			, updated = false
		;
		do {
			token = tokens[i] + "";
			if (checkTokenAndGetIndex(this, token) === -1) {
				this.push(token);
				updated = true;
			}
		}
		while (++i < l);

		if (updated) {
			this._updateClassName();
		}
	};
	classListProto.remove = function () {
		var
				tokens = arguments
			, i = 0
			, l = tokens.length
			, token
			, updated = false
			, index
		;
		do {
			token = tokens[i] + "";
			index = checkTokenAndGetIndex(this, token);
			while (index !== -1) {
				this.splice(index, 1);
				updated = true;
				index = checkTokenAndGetIndex(this, token);
			}
		}
		while (++i < l);

		if (updated) {
			this._updateClassName();
		}
	};
	classListProto.toggle = function (token, force) {
		token += "";

		var
				result = this.contains(token)
			, method = result ?
				force !== true && "remove"
			:
				force !== false && "add"
		;

		if (method) {
			this[method](token);
		}

		if (force === true || force === false) {
			return force;
		} else {
			return !result;
		}
	};
	classListProto.toString = function () {
		return this.join(" ");
	};

	if (objCtr.defineProperty) {
		var classListPropDesc = {
				get: classListGetter
			, enumerable: true
			, configurable: true
		};
		try {
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		} catch (ex) { // IE 8 doesn't support enumerable:true
			// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
			// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
			if (ex.number === undefined || ex.number === -0x7FF5EC54) {
				classListPropDesc.enumerable = false;
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
			}
		}
	} else if (objCtr[protoProp].__defineGetter__) {
		elemCtrProto.__defineGetter__(classListProp, classListGetter);
	}

	}(self));

	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function(method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function(token) {
					var i, len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function(token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};

		}

		testElement = null;
	}());

	}
}

export function promise () {
	if (!window.Promise) {
		Promise._immediateFn = setAsap
		Promise._unhandledRejectionFn = function(rejectError) {}
		window.Promise = Promise
	}
}

export function delay (time = 0) {
	return new Promise ((resolve, reject) => {
		time += performance.now()
		function timeout() {
			if (performance.now() > time) {
				cancelAnimationFrame(timeout)
				resolve()
			} else {
				requestAnimationFrame(timeout)
			}
		}

		timeout()
	})
}

export function animationFrame () {
	window.performance = window.performance || {};
	performance.now = (function() {
			return performance.now    ||
					performance.webkitNow ||
					function() {
							return new Date().getTime();
					};
	})();
	(function() {
			var lastTime = 0;
			var vendors = ['ms', 'moz', 'webkit', 'o'];
			for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
					window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
																		|| window[vendors[x]+'CancelRequestAnimationFrame'];
			}
	
			if (!window.requestAnimationFrame)
					window.requestAnimationFrame = function(callback, element) {
							var currTime = new Date().getTime();
							var timeToCall = Math.max(0, 16 - (currTime - lastTime));
							var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
								timeToCall);
							lastTime = currTime + timeToCall;
							return id;
					};
	
			if (!window.cancelAnimationFrame)
					window.cancelAnimationFrame = function(id) {
							clearTimeout(id);
					};
	}());
}

export function isArray (element) {
	return Object.prototype.toString.call(element) === '[object Array]';
}

export function addAttr (element, attribute) {
	element.setAttribute(attribute, '')
}

export function toggleAttr (element, attribute) {
	if (element.hasAttribute(attribute)) {
		element.removeAttribute(attribute)
	} else {
		addAttr(element, attribute)
	}
}

export function checkForMenu (event) {
	window.onclick = event => {
		const menu = document.querySelector('[data-menu][data-open]')
		if (event.target.tagName === 'HTML' && menu !== null) {
			menu.removeAttribute('data-open')
		} else if (event.target.tagName !== 'HTML' && !event.target.hasAttribute('data-divider') && !event.target.hasAttribute('data-list') && !event.target.hasAttribute('data-menu') && event.target !== null && !event.target.parentElement.hasAttribute('data-menu') && menu !== null) {
			menu.removeAttribute('data-open')
		}
		const dial = document.querySelector('[data-speed-dial][data-open]')
		if (event.target.tagName !== 'HTML' && !event.target.parentElement.hasAttribute('data-speed-dial') && dial !== null) {
			dial.children[0].children[0].innerText = dial.getAttribute('data-icon')
			dial.removeAttribute('data-open')
		}
	}
}