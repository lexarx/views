define('views/view', [
	'views/element', 'event', 'binding/binding', 'views/view-interface'
], function(Element, Event, Binding, ViewInterface) {
	/**
	 * @class View
	 * @extends Views.Element
	 * @implements {Views.View}
	 * @namespace Views
	 */
	var View = Element.extend({
		/**
		 * @constructor
		 * @override
		 * @param {Views.View.Parameters} [parameters]
		 */
		constructor: function(parameters) {
			this.super(parameters);
			/**
			 * @implements {Views.ViewInterface}
			 */
			this.attached = new Event();
			/**
			 * @implements {Views.ViewInterface}
			 */
			this.detached = new Event();
			/**
			 * @implements {Views.ViewInterface}
			 */
			this.shown = new Event();
			/**
			 * @implements {Views.ViewInterface}
			 */
			this.hidden = new Event();
			this.parent = null;
			this.bindings = null;
			this.elementAttached = false;
			this.elementShown = false;
			if (parameters !== undefined && parameters.visible !== undefined) {
				this.visible = parameters.visible;
			} else {
				this.visible = this.visible !== false;
			}
			this.displayProperty = '';
			if (!this.visible) {
				this.hideElement();
			}
			this.render();
			if (parameters !== undefined && parameters.data !== undefined) {
				this.setData(parameters.data);
			} else {
				this.data = null;
			}
		},

		/**
		 * @protected
		 */
		render: function() {},

		/**
		 * @implements {Views.ViewInterface}
		 * @param {Views.Node|Node} parent
		 */
		setParent: function(parent) {
			if (this.parent !== parent) {
				if (ViewInterface.isImplementedBy(this.parent)) {
					this.parent.attached.remove(this.onParentAttached, this);
					this.parent.detached.remove(this.onParentDetached, this);
					this.parent.shown.remove(this.onParentShown, this);
					this.parent.hidden.remove(this.onParentHidden, this);
				}
				this.parent = parent;
				if (ViewInterface.isImplementedBy(this.parent)) {
					this.parent.attached.add(this.onParentAttached, this);
					this.parent.detached.add(this.onParentDetached, this);
					this.parent.shown.add(this.onParentShown, this);
					this.parent.hidden.add(this.onParentHidden, this);
					if (this.parent.isAttached()) {
						this.onAttached();
					} else if (this.elementAttached) {
						this.onDetached();
					}
				} else if (this.parent === document) {
					this.onAttached();
				} else if (this.elementAttached) {
					this.onDetached();
				}
			}
		},

		/**
		 * @protected
		 * @returns {Boolean}
		 */
		isParentShown: function() {
			if (ViewInterface.isImplementedBy(this.parent)) {
				return this.parent.isShown();
			} else if (this.parent === document) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Is called when the view element has been attached to DOM.
		 * @protected
		 */
		onAttached: function() {
			if (!this.elementAttached) {
				this.elementAttached = true;
				this.attached.trigger(this);
				if (this.visible && this.isParentShown() && !this.elementShown) {
					this.elementShown = true;
					this.onShown();
				}
			}
		},

		/**
		 * Is called when the view element has been detached from DOM.
		 * @protected
		 */
		onDetached: function() {
			if (this.elementAttached) {
				this.elementAttached = false;
				this.detached.trigger(this);
				if (this.elementShown) {
					this.elementShown = false;
					this.onHidden();
				}
			}
		},

		/**
		 * Returns true if the view element is attached to DOM, otherwise returns false.
		 * @implements {Views.ViewInterface}
		 * @returns {Boolean}
		 */
		isAttached: function() {
			return this.elementAttached;
		},

		/**
		 * @implements {Views.ViewInterface}
		 * @returns {Boolean}
		 */
		isVisible: function() {
			return this.visible;
		},

		/**
		 * @implements {Views.ViewInterface}
		 * @param {Boolean} visible
		 */
		setVisible: function(visible) {
			if (visible) {
				this.show();
			} else {
				this.hide();
			}
		},

		/**
		 * @implements {Views.ViewInterface}
		 */
		show: function() {
			if (!this.visible) {
				this.visible = true;
				this.showElement();
				if (this.isParentShown() && !this.elementShown) {
					this.elementShown = true;
					this.onShown();
				}
			}
		},

		/**
		 * @implements {Views.ViewInterface}
		 */
		hide: function() {
			if (this.visible) {
				this.visible = false;
				this.hideElement();
				if (this.elementShown) {
					this.elementShown = false;
					this.onHidden();
				}
			}
		},

		/**
		 * @protected
		 */
		showElement: function() {
			this.element.style.display = this.displayProperty;
		},

		/**
		 * @protected
		 */
		hideElement: function() {
			this.displayProperty = this.element.style.display;
			this.element.style.display = 'none';
		},

		/**
		 * Returns true if view is fully visible, i.e. neither view nor any of its parent nodes have display:none.
		 * @implements {Views.ViewInterface}
		 * @returns {Boolean}
		 */
		isShown: function() {
			return this.elementShown;
		},

		/**
		 * Is called when the view element has been attached to DOM and is visible (see isShown).
		 * @protected
		 */
		onShown: function() {
			this.shown.trigger(this);
		},

		/**
		 * Is called when the view element has been detached from DOM or is no more visible (see isShown).
		 * @protected
		 */
		onHidden: function() {
			this.hidden.trigger(this);
		},

		/**
		 * @protected
		 */
		onParentAttached: function() {
			if (!this.elementAttached) {
				this.onAttached();
			}
			if (this.visible && this.isParentShown() && !this.elementShown) {
				this.elementShown = true;
				this.onShown();
			}
		},

		/**
		 * @protected
		 */
		onParentDetached: function() {
			if (this.elementAttached) {
				this.onDetached();
			}
			if (this.elementShown) {
				this.elementShown = false;
				this.onHidden();
			}
		},

		/**
		 * Notifies the view that all its parent nodes are visible.
		 * @protected
		 */
		onParentShown: function() {
			if (this.visible && !this.elementShown) {
				this.elementShown = true;
				this.onShown();
			}
		},

		/**
		 * Notifies the view that not all its parent nodes are visible anymore.
		 * @protected
		 */
		onParentHidden: function() {
			if (this.elementShown) {
				this.elementShown = false;
				this.onHidden();
			}
		},

		/**
		 * @implements {Views.ViewInterface}
		 * @param {*} data
		 */
		setData: function(data) {
			this.data = data;
			if (this.bindings !== null) {
				for (var i = 0; i < this.bindings.length; i++) {
					this.bindings[i].setSource(this.data);
				}
			}
		},

		/**
		 * @implements {Views.ViewInterface}
		 * @returns {*}
		 */
		getData: function() {
			return this.data;
		},

		/**
		 * @implements {Views.ViewInterface}
		 * @param {Object} [target]
		 * @param {String} [property]
		 * @param {String} [path]
		 * @param {Binding.Converter|Function} [converter]
		 * @returns {Binding.Binding}
		 */
		bind: function(target, property, path, converter) {
			var binding = new Binding(this.data, path, target, property, converter);
			if (this.bindings === null) {
				this.bindings = [];
			}
			this.bindings.push(binding);
			return binding;
		},

		/**
		 * @implements {Views.ViewInterface}
		 * @param {Binding.Binding} binding
		 */
		unbind: function(binding) {
			if (this.bindings === null) {
				return;
			}
			for (var i = this.bindings.length - 1; i >= 0; i--) {
				if (this.bindings[i] === binding) {
					this.bindings.splice(i, 1);
				}
			}
		}
	});
	
	ViewInterface.addTo(View);
	
	return View;
	
	/**
	 * @typedef Parameters
	 * @namespace Views.View
	 * @extends Views.Element.Parameters
	 * @property {Boolean} visible
	 * @property {*} data
	 */
});