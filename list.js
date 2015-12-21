define('views/list', [
	'views/items-view'
], function(ItemsView) {
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
		 * @param {Views.Node|Node} view
		 */
		detachView: function(view) {
			var node = this.getViewNode(view);
			this.container.removeChild(node);
		},

		/**
		 * @protected
		 * @override
		 * @param {Views.Node|Node} view
		 */
		destroyView: function(view) {
			// Detach view before destruction to avoid reflow.
			this.detachView(view);
			this.super(view);
		},

		/**
		 * @protected
		 * @override
		 * @param {Collections.ObservableCollection<Views.Node|Node>} collection
		 * @param {Collections.CollectionChange<Views.Node|Node>} args
		 */
		onChildrenChanged: function(collection, args) {
			// Old views are already detached during destruction.
			if (args.newItems.length > 0) {
				var fragment = this.createViewsDocumentFragment(args.newItems);
				var index = args.index + args.newItems.length;
				var element;
				if (index < this.children.count) {
					var view = this.children.get(index);
					element = this.getViewNode(view);
				} else {
					element = null;
				}
				this.container.insertBefore(fragment, element);
			}
			this.super(collection, args);
		}
	});
});
