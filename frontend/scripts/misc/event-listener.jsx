/* Basic Event System
 *
 * Add and Trigger any kind of events
 *
 * e.g.:
 *
 * let listener = new EventListener();
 * listerner.on('route-change', function(route) {
 *   // TODO: Do something
 * })
 *
 * //
 * // Somewhere else in your code
 * //
 *
 * listener.trigger('route-change', '/link/product/details')
 *
 */
export default class EventListener {
  constructor() {
    this.events = {};
    this._pending = {};
  }

  on(type, callback) {
    // Add event listeners
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);

    if (this._pending[type] && this._pending[type].length) {
      this._pending[type].forEach(args => {
        this.trigger(type, ...args);
      });
      this._pending[type] = [];
    }
  }

  off(type, callback) {
    // Remove all listeners
    if (!callback) {
      this.events[type] = [];
      return;
    }

    // Remove specific listener
    this.events[type] = this.events[type].filter(function(func) {
      return func !== callback;
    });
  }

  trigger(type, ...args) {
    // Trigger event listeners
    this.events[type] = this.events[type] || [];
    this.events[type].forEach(function(callback) {
      callback(...args);
    });

    // If no events were registered for that action, add the triggering to the
    // pending list
    if (this.events[type].length === 0) {
      this._pending[type] = this._pending[type] || [];
      this._pending[type].push(args);
    }
  }
}
