import MulticastEvent from './MulticastEvent.ts';
import type { EventCallback } from '../type/types.ts';

const event: unique symbol = Symbol('event');

/**
 * An object that represents a specific named event as a property on an event consumer object.
 */
export default class EventProperty<TEventArg> {
  [event]: MulticastEvent<TEventArg>;

  /**
   * Emit the event, calling each registered listener.
   * @param arg event argument passed to each listener
   */
  emit: (arg: TEventArg) => void;

  /**
   * Register a new listener callback for the event.
   * @param callback the listener to be added
   */
  addListener: (callback: EventCallback<TEventArg>) => void;

  /**
   * Register a new listener callback for the event that will be removed
   * after the first time that it is triggered.
   * @param callback the listener to be added
   */
  addOneTimeListener: (callback: EventCallback<TEventArg>) => void;

  /**
   * If the callback argument is a registered listener, remove it.
   * @param callback the listener to be removed
   */
  removeListener: (callback: EventCallback<TEventArg>) => boolean;

  constructor() {
    this[event] = new MulticastEvent<TEventArg>();

    this.emit = (arg: TEventArg) => {
      this[event].raiseEvent(arg);
    };

    this.addListener = (callback: EventCallback<TEventArg>) => {
      this[event].registerCallback(callback);
    };

    this.addOneTimeListener = (callback: EventCallback<TEventArg>) => {
      this[event].registerCallbackWithRemoval(callback);
    };

    this.removeListener = (callback: EventCallback<TEventArg>) => {
      return this[event].unregisterCallback(callback);
    };
  }
}
