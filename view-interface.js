define('views/view-interface', [
	'interface'
], function(Interface) {
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
	return new Interface();
});