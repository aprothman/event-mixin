import type { EventCallback } from '../type/types.ts';

export default class MulticastEvent<TEventArg> {
  callbacks = new Set<EventCallback<TEventArg>>();

  removeList = new Set<EventCallback<TEventArg>>();

  /**
   * Add to the list of callbacks for this event
   * @param callback function to be called when the event is raised
   */
  registerCallback(callback: EventCallback<TEventArg>) {
    this.callbacks.add(callback);
  }

  /**
   * Add to the list of callbacks for this event, and register the
   * new callback for removal after it is called.
   * @param callback function to be called when the event is raised
   */
  registerCallbackWithRemoval(callback: EventCallback<TEventArg>) {
    this.removeList.add(callback);
    this.callbacks.add(callback);
  }

  /**
   * If the callback parameter is registered for this event, unregister it.
   * @param callback function that was previously registered
   * @returns true if the callback function was found and removed
   */
  unregisterCallback(callback: EventCallback<TEventArg>) {
    this.removeList.delete(callback);

    return this.callbacks.delete(callback);
  }

  /**
   * Trigger each callback registered for this event.
   * @param arg event argument passed to each callback
   */
  raiseEvent(arg: TEventArg) {
    this.callbacks.forEach((callback) => {
      if (this.removeList.has(callback)) {
        this.unregisterCallback(callback);
      }

      callback(arg);
    });
  }
}
