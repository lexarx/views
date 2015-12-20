define('views/view-interface', [
	'interface', 'views/node'
], function(Interface, Node) {
	/**
	 * @interface ViewInterface
	 * @namespace Views
	 * @property {Event} attached
	 * @property {Event} detached
	 * @property {Event} shown
	 * @property {Event} hidden
	 * @method setParent
	 * @method isAttached
	 * @method isShown
	 * @method isVisible
	 * @method setVisible
	 * @method show
	 * @method hide
	 * @method setData
	 * @method getData
	 * @method addBinding
	 * @method removeBinding
	 */
	return new Interface([
		Node
	]);
});