var ItemsView = require('views/items-view');
var Views = require('views/views');

/**
 * @class List
 * @extends Views.ItemsView
 * @namespace Views
 */
var List = ItemsView.extend({
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
	 * @param {Views.NodeInterface|Node} view
	 */
	destroyView: function(view) {
		// Detach view before destruction to avoid reflow.
		Views.detachView(view, this.container);
		this.super(view);
	},

	/**
	 * @protected
	 * @override
	 * @param {Collections.ObservableCollection<Views.NodeInterface|Node>} collection
	 * @param {Collections.CollectionChange<Views.NodeInterface|Node>} change
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

module.exports = List;