define('views/container', [
	'views/view', 'collections/observable-collection', 'views/view-interface', 'views/node'
], function(View, ObservableCollection, ViewInterface, Node) {
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
		 * @param {Array<Views.Node|Node>} children
		 */
		setChildren: function(children) {
			this.children.setItems(children);
		},

		/**
		 * @protected
		 * @param {Views.Node|Node} view
		 */
		getViewNode: function(view) {
			if (Node.isImplementedBy(view)) {
				return view.getNode();
			} else {
				return view;
			}
		},

		/**
		 * @protected
		 * @param {Array<Views.Node|Node>} views
		 * @returns {DocumentFragment}
		 */
		createViewsDocumentFragment: function(views) {
			var fragment = document.createDocumentFragment();
			for (var i = 0; i < views.length; i++) {
				var node = this.getViewNode(views[i]);
				fragment.appendChild(node);
			}
			return fragment;
		},

		/**
		 * @protected
		 * @param {Collections.ObservableCollection<Views.Node|Node>} collection
		 * @param {Collections.CollectionChange<Views.Node|Node>} change
		 */
		onChildrenChanged: function(collection, change) {
			for (var i = 0; i < change.oldItems.length; i++) {
				var view = change.oldItems[i];
				if (ViewInterface.isImplementedBy(view)) {
					view.setParent(null);
				}
			}
			for (var i = 0; i < change.newItems.length; i++) {
				var view = change.newItems[i];
				if (ViewInterface.isImplementedBy(view)) {
					view.setParent(this);
				}
			}
		}
	});
	
	/**
	 * @typedef Parameters
	 * @namespace Views.Container
	 * @extends Views.View.Parameters
	 * @property {Array<Views.Node|Node>} children
	 */
});