var View = require('views/view');
	
var textContentSupported = 'textContent' in document.documentElement;
	
/**
 * @class Text
 * @extends Views.View
 * @namespace Views
 */
var Text = View.extend({
	/**
	 * @constructor
	 * @override
	 * @param {Views.Text.Parameters} [parameters]
	 */
	constructor: function(parameters) {
		this.super(parameters);
		if (parameters !== undefined && parameters.text !== undefined) {
			this.setText(parameters.text);
		}
	},

	/**
	 * @param {String} text
	 */
	setText: function(text) {
		Text.setText(this.element, text);
	},

	/**
	 * @returns {String}
	 */
	getText: function() {
		return Text.getText(this.element);
	}
}, {
	/**
	 * @param {Element} element
	 * @returns {String}
	 */
	getText: textContentSupported ? function(element) {
		return element.textContent;
	} : function(element) {
		return element.innerText;
	},

	/**
	 * @param {Element} element
	 * @param {String} text
	 */
	setText: function(element, text) {
		if (text === undefined || text === null) {
			text = '';
		}
		Text.setTextContent(element, text);
	},

	/**
	 * @param {Element} element
	 * @param {String} text
	 */
	setTextContent: textContentSupported ? function(element, text) {
		element.textContent = text;
	} : function(element, text) {
		element.innerText = text;
	}
});

module.exports = Text;

/**
 * @typedef Parameters
 * @namespace Views.Text
 * @extends Views.View.Parameters
 * @property {String} text
 */