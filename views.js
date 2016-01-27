define('views/views', [
	'views/node'
], function(Node) {
	return {
		/**
		 * @param {Views.Node|Node} view
		 */
		getNode: function(view) {
			if (Node.isImplementedBy(view)) {
				return view.getNode();
			} else {
				return view;
			}
		},

		/**
		 * @param {Array<Views.Node|Node>} views
		 * @returns {DocumentFragment}
		 */
		createDocumentFragment: function(views) {
			var fragment = document.createDocumentFragment();
			for (var i = 0; i < views.length; i++) {
				var node = this.getNode(views[i]);
				fragment.appendChild(node);
			}
			return fragment;
		}
	};
});