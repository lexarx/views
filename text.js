define('views/text', [
	'views/view'
], function(View) {
	/**
	 * @class Text
	 * @extends Views.View
	 * @namespace Views
	 */
	return View.extend({
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
			if (text === undefined || text === null) {
				text = '';
			}
			if (this.element.textContent !== undefined) {
				this.element.textContent = text;
			} else {
				this.element.innerText = text;
			}
		},

		/**
		 * @returns {String}
		 */
		getText: function() {
			return this.element.textContent !== undefined ? this.element.textContent :
				this.element.innerText;
		}
	});
	
	/**
	 * @typedef Parameters
	 * @namespace Views.Text
	 * @extends Views.View.Parameters
	 * @property {String} text
	 */
});