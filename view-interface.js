var Interface = require('interface');

/**
 * @interface ViewInterface
 * @namespace Views
 * @property {Event} attached
 * @property {Event} detached
 * @property {Event} shown
 * @property {Event} hidden
 * @method isAttached
 * @method isShown
 */
var ViewInterface = new Interface();

module.exports = ViewInterface;