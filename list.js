define('views/list', [
	'views/items-view', 'views/views'
], function(ItemsView, Views) {
	/**
	 * @class List
	 * @extends Views.ItemsView
	 * @namespace Views
	 */
	return ItemsView.extend({
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
		 * @override
		 * @param {Views.Node|Node} view
		 */
		destroyView: function(view) {
			// Detach view before destruction to avoid reflow.
			Views.detachView(view, this.container);
			this.super(view);
		},

		/**
		 * @protected
		 * @override
		 * @param {Collections.ObservableCollection<Views.Node|Node>} collection
		 * @param {Collections.CollectionChange<Views.Node|Node>} change
		 */
		onChildrenChanged: function(collection, change) {
			// Old views are already detached during destruction.
			if (change.newItems.length > 0) {
				var fragment = Views.createDocumentFragment(change.newItems);
				var index = change.index + change.newItems.length;
				var node;
				if (index < this.children.count()) {
					var view = this.children.get(index);
					node = Views.getNode(view);
				} else {
					node = null;
				}
				this.container.insertBefore(fragment, node);
			}
			this.super(collection, change);
		}
	});
});
