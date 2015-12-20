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
			this.container = this.element;
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
		 * @param {Collections.CollectionChange<Views.Node|Node>} args
		 */
		onChildrenChanged: function(collection, args) {
			if (args.oldItems.length > 0) {
				this.detachViews(args.oldItems);
			}
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
