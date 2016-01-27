define('views/items-view', [
	'views/container', 'views/view-interface', 'collections/collection-interface',
	'collections/observable-collection-interface'
], function(Container, ViewInterface, CollectionInterface, ObservableCollectionInterface) {
	var emptyArray = [];
	
	/**
	 * @class ItemsView
	 * @extends Views.Container
	 * @namespace Views
	 */
	return Container.extend({
		optimizedUpdate: true,

		/**
		 * @constructor
		 * @override
		 * @param {Views.ItemsView.Parameters} [parameters]
		 */
		constructor: function(parameters) {
			this.super(parameters);
			// Collect predefined values and reset properties.
			var items = this.items;
			this.items = null;
			var view = this.view;
			this.view = null;
			var viewsPool = this.viewsPool;
			this.viewsPool = null;
			// Set values from parameters or the predefined values.
			if (parameters !== undefined && parameters.items !== undefined) {
				this.setItems(parameters.items);
			} else if (items !== undefined) {
				this.setItems(items);
			}
			if (parameters !== undefined && parameters.view !== undefined) {
				this.setView(parameters.view);
			} else if (view !== undefined) {
				this.setView(view);
			}
			if (parameters !== undefined && parameters.viewsPool !== undefined) {
				this.setViewsPool(parameters.viewsPool);
			} else if (viewsPool !== undefined) {
				this.setViewsPool(viewsPool);
			}
		},

		/**
		 * @param {Array|Collections.CollectionInterface} items
		 */
		setItems: function(items) {
			if (this.items !== items) {
				var oldItems;
				if (this.optimizedUpdate) {
					oldItems = this.items;
				} else {
					this.destroyViews();
				}
				if (ObservableCollectionInterface.isImplementedBy(this.items)) {
					this.items.changed.remove(this.onItemsChanged, this);
				}
				this.items = items;
				if (ObservableCollectionInterface.isImplementedBy(this.items)) {
					this.items.changed.add(this.onItemsChanged, this);
				}
				if (this.optimizedUpdate) {
					this.updateViewsOptimized(0, oldItems, this.items);
				} else {
					this.updateViews();
				}
			}
		},

		/**
		 * @returns {Array|Collections.CollectionInterface}
		 */
		getItems: function() {
			return this.items;
		},

		/**
		 * @param {Function} view
		 */
		setView: function(view) {
			if (view && this.viewsPool) {
				throw new Error('Only one of view or viewsPool must be set.');
			}
			if (this.view !== view) {
				this.destroyViews();
				this.view = view;
				this.updateViews();
			}
		},

		/**
		 * @returns {Function}
		 */
		getView: function() {
			return this.view;
		},

		/**
		 * @param {Collections.PoolInterface} viewsPool
		 */
		setViewsPool: function(viewsPool) {
			if (this.view && viewsPool) {
				throw new Error('Only one of view or viewsPool must be set.');
			}
			if (this.viewsPool !== viewsPool) {
				this.destroyViews();
				this.viewsPool = viewsPool;
				this.updateViews();
			}
		},

		/**
		 * @returns {Collections.PoolInterface}
		 */
		getViewsPool: function() {
			return this.viewsPool;
		},

		/**
		 * Returns true if the list is configured enough to create elements
		 * @protected
		 * @returns {Boolean}
		 */
		canCreateViews: function() {
			return this.items !== undefined && this.items !== null && (
				(this.view !== undefined && this.view !== null) ||
				(this.viewsPool !== undefined && this.viewsPool !== null)
			);
		},

		/**
		 * @protected
		 */
		updateViews: function() {
			if (this.canCreateViews()) {
				var views = this.createViews(this.items);
				this.children.setItems(views);
			} else {
				this.children.clear();
			}
		},

		/**
		 * @protected
		 * @param {Number} index
		 * @param {Array|Collections.CollectionInterface} oldItems
		 * @param {Array|Collections.CollectionInterface} newItems
		 */
		updateViewsOptimized: function(index, oldItems, newItems) {
			if (!this.canCreateViews()) {
				return;
			}
			if (oldItems === undefined || oldItems === null) {
				oldItems = emptyArray;
			}
			if (newItems === undefined || newItems === null) {
				newItems = emptyArray;
			}
			var oldItemsCollection = CollectionInterface.isImplementedBy(oldItems);
			var newItemsCollection = CollectionInterface.isImplementedBy(newItems);
			var oldItemsCount = oldItemsCollection ? oldItems.count() : oldItems.length;
			var newItemsCount = newItemsCollection ? newItems.count() : newItems.length;
			var inPlaceViewsCount = Math.min(oldItemsCount, newItemsCount);
			for (var i = 0; i < inPlaceViewsCount; i++) {
				var view = this.children.get(index + i);
				if (ViewInterface.isImplementedBy(view)) {
					var data = newItemsCollection ? newItems.get(i) : newItems[i];
					view.setData(data);
				}
			}
			var newIndex = index + inPlaceViewsCount;
			var oldViewsCount = oldItemsCount - inPlaceViewsCount;
			if (oldViewsCount > 0) {
				this.destroyViews(newIndex, oldViewsCount);
			}
			var newViewsCount = newItemsCount - inPlaceViewsCount;
			var newViews = this.createViews(newItems, inPlaceViewsCount, newViewsCount);
			this.children.replaceRange(newIndex, oldViewsCount, newViews);
		},

		/**
		 * @protected
		 * @param {*} data
		 */
		createView: function(data) {
			if (this.view !== undefined && this.view !== null) {
				return this.createViewFromClass(data);
			} else {
				return this.createViewFromPool(data);
			}
		},

		/**
		 * @protected
		 * @param {*} data
		 */
		createViewFromClass: function(data) {
			var view = new this.view();
			if (ViewInterface.isImplementedBy(view)) {
				view.setData(data);
			}
			return view;
		},

		/**
		 * @protected
		 * @param {*} data
		 */
		createViewFromPool: function(data) {
			var view = this.viewsPool.pop();
			if (ViewInterface.isImplementedBy(view)) {
				view.setData(data);
			}
			return view;
		},

		/**
		 * @private
		 * @param {Array|Collections.CollectionInterface} items
		 * @param {Number} [index]
		 * @param {Number} [count]
		 */
		createViews: function(items, index, count) {
			if (index === undefined) {
				index = 0;
			}
			if (items === undefined || items === null) {
				items = emptyArray;
			}
			var collection = CollectionInterface.isImplementedBy(items);
			if (count === undefined) {
				count = collection ? items.count() : items.length;
			}
			var views = [];
			for (var i = index; i < index + count; i++) {
				var item = collection ? items.get(i) : items[i];
				var view = this.createView(item);
				views.push(view);
			}
			return views;
		},

		/**
		 * @protected
		 * @param {Views.Node|Node} view
		 */
		destroyView: function(view) {
			if (ViewInterface.isImplementedBy(view)) {
				view.setData(null);
			}
			if (this.viewsPool) {
				this.viewsPool.pool(view);
			}
		},

		/**
		 * @private
		 * @param {Number} [index]
		 * @param {Number} [count]
		 */
		destroyViews: function(index, count) {
			if (index === undefined) {
				index = 0;
			}
			if (count === undefined) {
				count = this.children.count();
			}
			for (var i = index; i < index + count; i++) {
				var view = this.children.get(i);
				this.destroyView(view);
			}
		},

		/**
		 * @protected
		 * @param {Collections.ObservableCollection} collection
		 * @param {Collections.CollectionChange} change
		 */
		onItemsChanged: function(collection, change) {
			this.updateViewsOptimized(change.index, change.oldItems, change.newItems);
		}
	});
	
	/**
	 * @typedef Parameters
	 * @namespace Views.ItemsView
	 * @extends Views.Container.Parameters
	 * @property {Array|Collections.CollectionInterface} items
	 * @property {Function} view
	 * @property {Collections.PoolInterface} viewsPool
	 */
});