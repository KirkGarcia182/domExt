!function(win) {
	'use strict';

	// Notes will contain messages related to whether or not
	// the function already exist natively
	let Notes = [],
	doc = document,
	elementVar = Element,
	nodeVar = Node,
	eventTargetVar = EventTarget,
	documentVar = Document,
	htmlCollectionVar = HTMLCollection,
	nodeListVar = NodeList,

	/* 
		is Helper Functions to check variable types
		putting it all here is okay as to make the library
		dependency free
	*/
	toString = Object.prototype.toString,
	isUndefined = v => toString.call(v) === '[object Undefined]',
	isString = v => toString.call(v) === '[object String]',
	isObject = v => toString.call(v) === '[object Object]',
	
	ElementPolyfill = {
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
		byClass: elementVar.getElementsByClassName,
		changeClass(from, to) {
			this.classList.replace(from, to);
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
		data(dataName, value){
			if(isObject(dataName)){
				for(let name in dataName){
					this.attr(`data-${name}`, dataName[name]);
				}
			}else if(isString(dataName) && !isUndefined(value)){
				this.attr(`data-${dataName}`, value);
			}else{
				this.attr(`data-${dataName}`);
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
		parent(depth = 1){
			let parent = this;
			for(let x = 0; x < depth; x++){
				parent = parent.parentNode;
				x = parent === document ? depth : x;
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
		shadow(mode){
			return this.attachShadow(mode);
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
		}
	},

	NodePolyfill = {
		byId(id){
			return this.getElementById(id);
		},
		byClass(classNames){
			return this.getElementsByClassName(classNames);
		},
		clone(deep = true){
			return this.cloneNode(deep);
		},
		qs(selector){
			return this.querySelector(selector);
		},
		qsa(selector){
			return this.querySelectorAll(selector);
		}
	},

	EventTargetPolyfill = {
		on(eventName, callback, options = false) {
			this.addEventListener(eventName, callback, options);
			return this;
		},
		trigger(eventName, custom = false, obj) {
			let event = custom ? new CustomEvent(eventName, obj) : new Event(eventName);
			this.dispatchEvent(event);
		}
	},

	DocumentPolyfill = {
		cdf: doc.createDocumentFragment,
		ce: doc.createElement
	},

	HTMLCollectionAndNodeListPolyfill = {
        addClass(classes) {
			let cache = [...this];
            for(let node of cache) {
				node.addClass(classes);
			}
            return this;
        },
        append() {
			let cache = [...this],
			args = [...arguments];
			
            for(let currentNode of cache) {
				for(let nodeToBeAppended of args){
					currentNode.append(nodeToBeAppended.clone());
				}
			}
            return this;
		},
		appendTo(_node, cloneIt){
			let cache = [...this];
			for(let node of cache){
				_node.append(cloneIt ? node.clone() : node);
			}
            return this;
		},
        attr(attributes, value) {
			let cache = [...this];
            for(let node of cache) {
				node.attr(attributes, value);
			}
            return this;
        },
        changeClass(from, to) {
			let cache = [...this];
            for(let node of cache) {
				node.changeClass(from, to);
			}
            return this;
        },
        css(styles, value) {
			let cache = [...this];
            for(let node of cache) {
				node.css(styles, value);
			}
            return this;
        },
        hide() {
			let cache = [...this];
            for(let node of cache) {
				node.hide();
			}
            return this;
        },
        on(eventName, callback, options = false) {
			let len = this.length;
			for(let index=0; index<len; index++){
				this[index].addEventListener(eventName, event => {
					callback.apply(null, [event, index]);
				}, options);
			}
            return this;
		},
		prepend(){
			let cache = [...this],
			args = [...arguments];
			
            for(let currentNode of cache) {
				for(let nodeToBePrepended of args){
					currentNode.prepend(nodeToBePrepended.clone());
				}
			}
            return this;
		},
		prependTo(_node, cloneIt){
			let cache = [...this];
			for(let node of cache){
				_node.prepend(cloneIt ? node.clone() : node);
			}
            return this;
		},
        removeAttr(attributes) {
			let cache = [...this];
            for(let node of cache) {
				node.removeAttr(attributes);
			}
            return this;
        },
        removeClass(classes) {
			let cache = [...this];
            for(let node of cache) {
				node.removeClass(classes);
			}
            return this;
        },
        show(display = 'inherit') {
			let cache = [...this];
            for(let node of cache) {
				node.show(display);
			}
            return this;
        }
	};

	/*
		Loop through ElementPolyfill and add it's properties
		to Element prototype
	*/
	for(let prop in ElementPolyfill){
		if(isUndefined(elementVar.prototype[prop])) {
			elementVar.prototype[prop] = ElementPolyfill[prop];
		} else {
			Notes.push(`Element ${prop}() already exist!`);
		}
	}

	/*
		Loop through NodePolyfill and add it's properties
		to Node prototype
	*/
	for(let prop in NodePolyfill){
		if(isUndefined(nodeVar.prototype[prop])) {
			nodeVar.prototype[prop] = NodePolyfill[prop];
		} else {
			Notes.push(`Node ${prop}() already exist!`);
		}
	}

	/*
		Loop through EventTargetPolyfill and add it's properties
		to EventTarget prototype
	*/
	for(let prop in EventTargetPolyfill){
		if(isUndefined(eventTargetVar.prototype[prop])) {
			eventTargetVar.prototype[prop] = EventTargetPolyfill[prop];
		} else {
			Notes.push(`EventTarget ${prop}() already exist!`);
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

	/*
		Loop through HTMLCollectionAndNodeListPolyfill and add it's properties
		to HTMLCollection and NodeList prototype
	*/
	for(let prop in HTMLCollectionAndNodeListPolyfill) {
		if(isUndefined(htmlCollectionVar.prototype[prop])) {
			htmlCollectionVar.prototype[prop] = HTMLCollectionAndNodeListPolyfill[prop];
		} else {
			Notes.push(`HTMLCollection ${prop}() already exist!`);
		}

		if(isUndefined(nodeListVar.prototype[prop])) {
			nodeListVar.prototype[prop] = HTMLCollectionAndNodeListPolyfill[prop];
		} else {
			Notes.push(`NodeList ${prop}() already exist!`);
		}
	}

	if(Notes.length > 0) console.log(Notes);

	window.$ = document;
	window.log = function(message){ console.log(message); }
} (window);
