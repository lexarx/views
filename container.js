define('views/container', [
	'views/view', 'collections/observable-collection', 'views/parent-interface'
], function(View, ObservableCollection, ParentInterface) {
	/**
	 * Base class for all container views. Takes care about lifecycle events of child views.
	 * Child views must be attached to parent element in derived class before calling onChildrenChanged().
	 * @class Container
	 * @extends Views.View
	 * @namespace Views
	 */
	return View.extend({
		/**
		 * @constructor
		 * @override
		 * @param {Views.Container.Parameters} [parameters]
		 */
		constructor: function(parameters) {
			this.children = new ObservableCollection();
			this.children.changed.add(this.onChildrenChanged, this);
			this.super(parameters);
			if (parameters !== undefined && parameters.children !== undefined) {
				this.setChildren(parameters.children);
			}
		},

		/**
		 * @param {Array<Views.NodeInterface|Node>} children
		 */
		setChildren: function(children) {
			this.children.setItems(children);
		},

		/**
		 * @protected
		 * @param {Collections.ObservableCollection<Views.NodeInterface|Node>} collection
		 * @param {Collections.CollectionChange<Views.NodeInterface|Node>} change
		 */
		onChildrenChanged: function(collection, change) {
			for (var i = 0; i < change.oldItems.length; i++) {
				var view = change.oldItems[i];
				if (ParentInterface.isImplementedBy(view)) {
					view.setParent(null);
				}
			}
			for (var i = 0; i < change.newItems.length; i++) {
				var view = change.newItems[i];
				if (ParentInterface.isImplementedBy(view)) {
					view.setParent(this);
				}
			}
		}
	});
	
	/**
	 * @typedef Parameters
	 * @namespace Views.Container
	 * @extends Views.View.Parameters
	 * @property {Array<Views.NodeInterface|Node>} children
	 */
});