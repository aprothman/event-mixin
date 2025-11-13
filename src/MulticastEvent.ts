import type { EventCallback } from '../type/types.ts';

export default class MulticastEvent<TEventArg> {
  callbacks: EventCallback<TEventArg>[] = [];

  removeList: EventCallback<TEventArg>[] = [];

  /**
   * Add to the list of callbacks for this event
   * @param callback function to be called when the event is raised
   */
  registerCallback(callback: EventCallback<TEventArg>) {
    this.callbacks.push(callback);
  }

  /**
   * Add to the list of callbacks for this event, and register the
   * new callback for removal after it is called.
   * @param callback function to be called when the event is raised
   */
  registerCallbackWithRemoval(callback: EventCallback<TEventArg>) {
    this.removeList.push(callback);
    this.callbacks.push(callback);
  }

  /**
   * If the callback parameter is registered for this event, unregister it.
   * @param callback function that was previously registered
   * @param cleanRemoveList if true, additionally remove the function from the removeList
   * @returns true if the callback function was found and removed
   */
  unregisterCallback(callback: EventCallback<TEventArg>, cleanRemoveList = true) {
    if (cleanRemoveList) {
      // first remove it from the removeList
      const removeIndex = this.removeList.indexOf(callback);
      if (removeIndex > -1) {
        this.removeList.splice(removeIndex, 1);
      }
    }

    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Trigger each callback registered for this event.
   * @param arg event argument passed to each callback
   */
  raiseEvent(arg: TEventArg) {
    const callList = [...this.callbacks];

    callList.forEach((callback) => {
      // first check if the callback is on the list to be removed
      const index = this.removeList.indexOf(callback);
      if (index > -1) {
        this.removeList.splice(index, 1);
        this.unregisterCallback(callback, false);
      }

      callback(arg);
    });
  }
}
