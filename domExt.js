/*! 
   Author: Kirk Garcia
   License: MIT
   GitHub: https://github.com/KirkGarcia182/domExtend,
*/
!function(win) {
	'use strict';

	// Notes will contain messages related to whether or not
	// the function already exist natively
	const Notes = [],
	doc = document,
	alreadyExists = '() already exists!',
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
		hasClass(classes, any = true) {
			let flag = any ? false : true,
			classArray = classes.split(' ');
			if(any) {
				for(let className of classArray) {
					if(flag) break;
					flag = this.classList.contains(className) ? true : false;
				} 
			} else {
				for(let className of classArray){
					if(!flag) break;
					flag = this.classList.contains(className) ? true : false;
				}
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
		ce: doc.createElement,
		ct(text){
			let template = this.ce('template');
			template.innerHTML = text[0];
			return template;
		}
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
	},

	nameList = ['Element', 'Node', 'EventTarget', 'Document', 'HTMLCollection', 'NodeList'],
	objectList = [Element, Node, EventTarget, Document, HTMLCollection, NodeList],
	functionList = [
		ElementPolyfill,
		NodePolyfill,
		EventTargetPolyfill,
		DocumentPolyfill,
		HTMLCollectionAndNodeListPolyfill,
		HTMLCollectionAndNodeListPolyfill
	];

	/*
		Loopthrough each function list and extend the objectLists prototypes if function
		did not exist.
	*/
	for(let index in functionList){

		for(let prop in functionList[index]){

			if(isUndefined(objectList[index].prototype[prop])){

				objectList[index].prototype[prop] = functionList[index][prop];

			}else{

				Notes.push(`${nameList[index]} ${prop}${alreadyExists}`);

			}
		}

	}

	if(Notes.length > 0) console.log(Notes);

	win.$ = doc;
	win.dce = (name, constructor, options) => {
		customElements.define(name, constructor, options);
	}
} (window);
