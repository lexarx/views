define('views/items-view', [
	'views/container', 'views/view-interface', 'collections/collection-interface',
	'collections/observable-collection-interface'
], function(Container, ViewInterface, CollectionInterface, ObservableCollectionInterface) {
	/**
	 * @class ItemsView
	 * @extends Views.Container
	 * @namespace Views
	 */
	return Container.extend({
		/**
		 * @constructor
		 * @override
		 * @param {Views.ItemsView.Parameters} [parameters]
		 */
		constructor: function(parameters) {
			this.super(parameters);
			if (parameters !== undefined && parameters.items !== undefined) {
				this.setItems(parameters.items);
			}
			if (parameters !== undefined && parameters.view !== undefined) {
				this.setView(parameters.view);
			}
			if (parameters !== undefined && parameters.viewsPool !== undefined) {
				this.setViewsPool(parameters.viewsPool);
			}
		},

		/**
		 * @param {Array|CollectionInterface} items
		 */
		setItems: function(items) {
			if (this.items !== items) {
				this.destroyViews(this.children);
				if (ObservableCollectionInterface.isImplementedBy(this.items)) {
					this.items.changed.remove(this.onItemsChanged, this);
				}
				this.items = items;
				if (ObservableCollectionInterface.isImplementedBy(this.items)) {
					this.items.changed.add(this.onItemsChanged, this);
				}
				this.updateViews();
			}
		},

		/**
		 * @returns {Array|CollectionInterface}
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
				this.destroyViews(this.children);
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
				this.destroyViews(this.children);
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
		 * @param {*} data
		 */
		createView: function(data) {
			if (this.view !== undefined && this.view !== null) {
				return this.createViewFromViewClass(data);
			} else {
				return this.createItemFromViewsPool(data);
			}
		},

		/**
		 * @protected
		 * @param {*} data
		 */
		createViewFromViewClass: function(data) {
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
		createItemFromViewsPool: function(data) {
			var view = this.viewsPool.pop();
			if (ViewInterface.isImplementedBy(view)) {
				view.setData(data);
			}
			return view;
		},

		/**
		 * @private
		 * @param {Array|CollectionInterface} items
		 */
		createViews: function(items) {
			if (CollectionInterface.isImplementedBy(items)) {
				return items.map(this.createView, this);
			} else {
				var views = [];
				for (var i = 0; i < items.length; i++) {
					var view = this.createView(items[i]);
					views.push(view);
				}
				return views;
			}
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
		 * @param {Array<Views.Node|Node>|CollectionInterface<Views.Node|Node>} views
		 */
		destroyViews: function(views) {
			if (CollectionInterface.isImplementedBy(views)) {
				return views.map(this.destroyView, this);
			} else if (views !== undefined && views !== null) {
				for (var i = 0; i < views.length; i++) {
					this.destroyView(views[i]);
				}
			}
		},

		/**
		 * @protected
		 * @param {Collections.ObservableCollection} collection
		 * @param {Collections.CollectionChange} change
		 */
		onItemsChanged: function(collection, change) {
			if (!this.canCreateViews()) {
				return;
			}
			if (change.oldItems.length > 0) {
				var oldViews = this.children.getRange(change.index, change.oldItems.length);
				this.destroyViews(oldViews);
			}
			var newViews = this.createViews(change.newItems);
			this.children.replaceRange(change.index, change.oldItems.length, newViews);
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