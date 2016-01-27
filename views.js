define('views/views', [
	'views/node-interface'
], function(Node) {
	return {
		/**
		 * @param {Views.NodeInterface|Node} view
		 */
		getNode: function(view) {
			if (Node.isImplementedBy(view)) {
				return view.getNode();
			} else {
				return view;
			}
		},

		/**
		 * @param {Array<Views.NodeInterface|Node>} views
		 * @returns {DocumentFragment}
		 */
		createDocumentFragment: function(views) {
			var fragment = document.createDocumentFragment();
			for (var i = 0; i < views.length; i++) {
				var node = this.getNode(views[i]);
				fragment.appendChild(node);
			}
			return fragment;
		},

		/**
		 * Detaches the view from it's parent node.
		 * If parentNode is provided then the view is detached only if it's a child of this node.
		 * @param {Views.NodeInterface|Node} view
		 * @param {Node} [parentNode]
		 */
		detachView: function(view, parentNode) {
			var node = this.getNode(view);
			if (node.parentNode !== null &&
					(parentNode === undefined || node.parentNode === parentNode)) {
				node.parentNode.removeChild(node);
			}
		},

		/**
		 * @param {Array<Views.NodeInterface|Node>} views
		 * @param {Node} [parentNode]
		 */
		detachViews: function(views, parentNode) {
			for (var i = 0; i < views.length; i++) {
				this.detachView(views[i], parentNode);
			}
		}
	};
});