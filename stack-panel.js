define('views/stack-panel', [
	'views/container'
], function(Container) {
	/**
	 * @class StackPanel
	 * @extends Views.Container
	 * @namespace Views
	 */
	return Container.extend({
		/**
		 * @protected
		 * @override
		 */
		render: function() {
			this.container = this.createContainer();
		},

		/**
		 * @protected
		 * @returns {Node}
		 */
		createContainer: function() {
			return this.element;
		},

		/**
		 * @protected
		 * @param {Views.Node|Node} view
		 */
		detachView: function(view) {
			var node = this.getViewNode(view);
			if (node.parentNode === this.container) {
				this.container.removeChild(node);
			}
		},

		/**
		 * @protected
		 * @param {Array<Views.Node|Node>} views
		 */
		detachViews: function(views) {
			for (var i = 0; i < views.length; i++) {
				this.detachView(views[i]);
			}
		},

		/**
		 * @override
		 * @param {Collections.ObservableCollection<Views.Node|Node>} collection
		 * @param {Collections.CollectionChange<Views.Node|Node>} change
		 */
		onChildrenChanged: function(collection, change) {
			if (change.oldItems.length > 0) {
				this.detachViews(change.oldItems);
			}
			if (change.newItems.length > 0) {
				var fragment = this.createViewsDocumentFragment(change.newItems);
				var index = change.index + change.newItems.length;
				var node;
				if (index < this.children.count()) {
					var view = this.children.get(index);
					node = this.getViewNode(view);
				} else {
					node = null;
				}
				this.container.insertBefore(fragment, node);
			}
			this.super(collection, change);
		}
	});
});
