!function(win) {
	'use strict';

	// Notes will contain messages related to whether or not
	// the function already exist natively
	const Notes = [],

	/* 
		is Helper Functions to check variable types
		putting it all here is okay as to make the library
		dependency free, not to mention all the unused functions
		or variables will be erased once it's been compressed
		using jscompress
	*/
	toString = Object.prototype.toString,
	isUndefined = v => toString.call(v) === '[object Undefined]',
	isString = v => toString.call(v) === '[object String]',
	isNumber = v => toString.call(v) === '[object Number]',
	isNumeric = v => numericRegex.test(v),
	isAlphaNumeric = v => alphaNumericRegex.test(v),
	isNan = v => isNaN(v),
	isArray = v => Array.isArray(v),
	isBool = v => toString.call(v) === '[object Boolean]',
	isFunction = v => toString.call(v) === '[object Function]',
	isObject = v => toString.call(v) === '[object Object]',
	isMap = v => toString.call(v) === '[object Map]',
	isSet = v => toString.call(v) === '[object Set]',
	isSymbol = v => toString.call(v) === '[object Symbol]',
	isElement = v => v instanceof HTMLElement,
	
	HTMLElementPolyfill = {
		addClass(classes) {
			let classArray = classes.split(' ');
			this.classList.add(...classArray);
			return this;
		},
		appendTo(_node){
			_node.append(this);
			return this;
		},
		attr(attributes, value) {
			if(isUndefined(value) && isString(attributes)) {
				return this.getAttribute(attributes);
			} else {
				if(isObject(attributes)) {
					for(let attributeName in attributes) {
						this.setAttribute(attributeName, attributes[attributeName]);
						
					} 
				} else {
					this.setAttribute(attributes, value);
				} 
				return this;
			} 
		},
		byClass(selector){
			return this.getElementsByClassName(selector);
		},
		byId(id){
			return this.getElementById(id);
		},
		clone(deep = true){
			return this.cloneNode(deep);
		},
		changeClass(from, to) {
			this.classList.replace(from, to);
			return this;
		},
		child(){
			console.log('aw');
		},
		clear() {
			this.innerHTML = '';
			return this;
		},
		css(styles, value) {
			if(isObject(styles)) {
				for(let name in styles) {
					this.style[name] = styles[name];
				} 
			} else {
				this.style[styles] = value;
			} 
			return this;
		},
		data(datas, value){
			if(isObject(datas)){
				for(let name in datas){
					this.attr(`data-${name}`, datas[name]);
				}
			}else if(isString(datas) && !isUndefined(value)){
				this.attr(`data-${datas}`, value);
			}else{
				this.attr(`data-${datas}`);
			}
			return this;
		},
		hasClass(classes, option = 'any') {
			let flag = false,
			classArray = classes.split(' ');
			if(option === 'any') {
				for(let className of classArray) {
					if(flag) break;
					flag = this.classList.contains(className) ? true : false;
				} 
			} else if(option === 'all') {
				// reserve all option when needed
			} else {
				throw new Error('Unknown option value.');
			} 
			return flag;
		},
		hide() {
			this.style.display = 'none';
			return this;
		},
		html(string) {
			if(isUndefined(string)) {
				return this.innerHTML;
			} else {
				this.innerHTML = string;
				return this;
			} 
		},
		on(eventName, callback, options = false, propagate = true) {
			this.addEventListener(eventName, event =>{
				if(!propagate) event.stopPropagation();
				callback.call(this, event);
			}, options);
			return this;
		},
		parent(depth = 1){
			let parent = this;
			for(let x = 0; x < depth; x++){
				parent = parent.parentNode;
			}
			return parent;
		},
		prependTo(_node){
			_node.prepend(this);
			return this;
		},
		removeAttr(attributes) {
			let attributeArray = attributes.split(' ');
			for(let attributeName of attributeArray) {
				this.removeAttribute(attributeName);
			} 
			return this;
		},
		removeClass(classes) {
			let classArray = classes.split(' ');
			for(let className of classArray) {
				this.classList.remove(className);
			} 
			return this;
		},
		show(display = 'inherit') {
			this.style.display = display;
			return this;
		},
		text(text){
			if(isUndefined(text)){
				return this.textContent;
			}else{
				this.textContent = text;
				return this;
			}
		},
		toggleClass(class1, class2){
			let cache = this.hasClass(class1) ? class2 : class1;
			this.removeClass(`${class1} ${class2}`);
			this.addClass(cache);
			return this;
		},
		toggleText(text1, text2){
			let cache = this.html().includes(text1) ? text2 : text1;
			this.html(cache);
			return this;
		},
		trigger(eventName, custom = false, obj) {
			let event = custom ? new CustomEvent(eventName, obj) : new Event(eventName);
			this.dispatchEvent(event);
		},
		qsa(selector){
			return [...this.querySelectorAll(selector)];
		},
		qs(selector){
			return this.querySelector(selector);
		},
	},

	NodePolyfill = {
		byClass: HTMLElementPolyfill.byClass,
		byId: HTMLElementPolyfill.byId,
		clone: HTMLElementPolyfill.clone,
		qsa: HTMLElementPolyfill.qsa,
		qs: HTMLElementPolyfill.qs,
		shadow(options){
			return this.attachShadow(options);
		}
	},

	EventTargetPolyfill = {
		on: HTMLElementPolyfill.on,
		trigger: HTMLElementPolyfill.trigger
	},

	ArrayPolyfill = {
        addClass(classes) {
            for(let node of this) node.addClass(classes);
            return this;
        },
        append(_node, deep = true) {
            for(let node of this) node.append(_node, deep);
            return this;
		},
        attr(attributes, value) {
            for(let node of this) node.attr(attributes, value);
            return this;
        },
        changeClass(from, to) {
            for(let node of this) node.changeClass(from, to);
            return this;
        },
        clear() {
            for(let node of this) node.innerHTML = '';
            return this;
        },
        css(styles, value) {
            for(let node of this) node.css(styles, value);
            return this;
        },
        data(datas, value){
            for(let node of this) node.data(datas, value);
            return this;
        },
        hide() {
            for(let node of this) node.style.display = 'none';
            return this;
        },
        html(string) {
            for(let node of this) node.innerHTML = string;
            return this;
        },
        on(eventName, callback, options = false, propagate = true) {
            let index = 0;
            for(let node of this) {
                node.on(eventName, callback.bind(node, index), options, propagate);
                index++;
            }
            return this;
        },
        removeAttr(attributes) {
            for(let node of this) node.removeAttr(attributes);
            return this;
        },
        removeClass(classes) {
            for(let node of this) node.removeClass(classes);
            return this;
        },
        show(display = 'inherit') {
            for(let node of this) node.style.display = display;
            return this;
        }
	},

	DocumentPolyfill = {
		ce(selector, obj = {}) { return document.createElement(selector, obj); },
		cdf() { return document.createDocumentFragment(); },
		id(selector) { return document.getElementById(selector); },
		cn(selector) { return document.getElementsByClassName(selector); },
		//qs(selector) { return document.querySelector(selector); },
		//qsa(selector) { return document.querySelectorAll(selector); },
	};

	/*
		Loop through HTMLElementPolyfill and add it's properties
		to HTMLElement prototype
	*/
	for(let prop in HTMLElementPolyfill) {
		if(isUndefined(HTMLElement.prototype[prop])) {
			HTMLElement.prototype[prop] = HTMLElementPolyfill[prop];
		} else {
			Notes.push(`HTMLElement ${prop}() already exist!`);
		}
	}

	/*
		Loop through NodePolyfill and add it's properties
		to Node prototype
	*/
	for(let prop in NodePolyfill){
		if(isUndefined(Node.prototype[prop])) {
			Node.prototype[prop] = NodePolyfill[prop];
		} else {
			Notes.push(`Node ${prop}() already exist!`);
		}
	}

	/*
		Loop through EventTargetPolyfill and add it's properties
		to EventTarget prototype
	*/
	for(let prop in EventTargetPolyfill){
		if(isUndefined(EventTarget.prototype[prop])) {
			EventTarget.prototype[prop] = EventTargetPolyfill[prop];
		} else {
			Notes.push(`EventTarget ${prop}() already exist!`);
		}
	}

	/*
		Loop through ArrayPolyfill and add it's properties
		to Array prototype
	*/
	for(let prop in ArrayPolyfill) {
		if(isUndefined(Array.prototype[prop])) {
			Array.prototype[prop] = ArrayPolyfill[prop];
		} else {
			Notes.push(`Array ${prop}() already exist!`);
		} 
	}

	/*
		Loop through ArrayPolyfill and add it's properties
		to Array prototype
	*/
	for(let prop in DocumentPolyfill) {
		if(isUndefined(Document.prototype[prop])) {
			Document.prototype[prop] = DocumentPolyfill[prop];
		} else {
			Notes.push(`Document ${prop}() already exist!`);
		} 
	}

	if(Notes.length > 0) console.log(Notes);

	window.$ = document;
	window.log = function(message){ console.log(message); }
} (window);