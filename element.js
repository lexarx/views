define('views/element', [
	'class', 'views/node'
], function(Class, Node) {
	var classSeparatorRegExp = / +/;
	var classListSupported = 'classList' in document.documentElement;

	/**
	 * @class Element
	 * @implements Views.Node
	 * @namespace Views
	 */
	var Element = Class.extend({
		tag: 'div',
		
		/**
		 * @constructor
		 * @param {Views.Element.Parameters} [parameters]
		 */
		constructor: function(parameters) {
			if (parameters !== undefined && parameters.tag !== undefined) {
				this.tag = parameters.tag;
			}
			this.element = this.createElement();
			if (parameters !== undefined && parameters.id !== undefined) {
				this.setId(parameters.id);
			} else if (this.id !== undefined) {
				this.setId(this.id);
			}
			if (parameters !== undefined && parameters.class !== undefined) {
				this.setClass(parameters.class);
			} else if (this.class !== undefined) {
				this.setClass(this.class);
			}
			if (parameters !== undefined && parameters.attributes !== undefined) {
				this.setAttributes(parameters.attributes);
			} else if (this.attributes !== undefined) {
				this.setAttributes(this.attributes);
			}
		},

		/**
		 * @protected
		 * @returns {Element}
		 */
		createElement: function() {
			return document.createElement(this.tag);
		},

		/**
		 * @returns {String}
		 */
		getTag: function() {
			return this.element.tagName;
		},

		/**
		 * @param {String} id
		 */
		setId: function(id) {
			this.element.id = id;
		},

		/**
		 * @returns {String}
		 */
		getId: function() {
			return this.id;
		},

		/**
		 * @param {String} className
		 */
		setClass: function(className) {
			this.element.className = className;
		},

		/**
		 * @returns {String}
		 */
		getClass: function() {
			return this.element.className;
		},

		/**
		 * @param {String} className
		 */
		addClass: function(className) {
			Element.addClass(this.element, className);
		},

		/**
		 * @param {String} className
		 */
		removeClass: function(className) {
			Element.removeClass(this.element, className);
		},

		/**
		 * @param {Object} attributes
		 */
		setAttributes: function(attributes) {
			for (var name in attributes) {
				this.setAttribute(name, attributes[name]);
			}
		},

		/**
		 * @param {String} name
		 * @param {String} value
		 */
		setAttribute: function(name, value) {
			this.element.setAttribute(name, value);
		},

		/**
		 * @param {String} name
		 */
		removeAttribute: function(name) {
			this.element.removeAttribute(name);
		},
		
		/**
		 * @implements Views.Node
		 * @returns {Node}
		 */
		getNode: function() {
			return this.element;
		}
	}, {
		/**
		 * @param {Element} element
		 * @param {String} className
		 */
		addClass: classListSupported ? function(element, className) {
			element.classList.add(className);
		} : function(element, className) {
			var newClassName = element.className;
			var length = newClassName.length;
			if (length > 0 && newClassName.charAt(length - 1) !== ' ') {
				newClassName += ' ';
			}
			newClassName += className;
			element.className = ' ' + newClassName;
		},

		/**
		 * @param {Element} element
		 * @param {String} className
		 */
		removeClass: classListSupported ? function(element, className) {
			element.classList.remove(className);
		} : function(element, className) {
			var classes = element.className.split(classSeparatorRegExp);
			for (var i = classes.length - 1; i >= 0; i--) {
				var part = classes[i];
				if (part === className || part === '') {
					classes.splice(i, 1);
				}
			}
			element.className = classes.join(' ');
		}
	});
	
	Node.addTo(Element);
	
	return Element;
	
	/**
	 * @typedef Parameters
	 * @namespace Views.Element
	 * @property {String} tag
	 * @property {String} id
	 * @property {String} class
	 * @property {Object} attributes
	 */
});