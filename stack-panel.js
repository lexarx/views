var Container = require('views/container');
var Views = require('views/views');

/**
 * @class StackPanel
 * @extends Views.Container
 * @namespace Views
 */
var StackPanel = Container.extend({
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
	 * @override
	 * @param {Collections.ObservableCollection<Views.NodeInterface|Node>} collection
	 * @param {Collections.CollectionChange<Views.NodeInterface|Node>} change
	 */
	onChildrenChanged: function(collection, change) {
		if (change.oldItems.length > 0) {
			Views.detachViews(change.oldItems, this.container);
		}
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

module.exports = StackPanel;