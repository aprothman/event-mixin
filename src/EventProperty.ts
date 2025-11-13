import type IEventHost from '../type/IEventHost.ts';
import type { EventCallback } from '../type/types.ts';

/**
 * An object that represents a specific named event as a property on an event consumer object.
 */
export default class EventProperty<TEventArg> {
  [eventKey: symbol]: symbol;

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

  constructor(eventHost: IEventHost, eventKey: symbol, eventSymbol: symbol) {
    this[eventKey] = eventSymbol;

    this.emit = (arg: TEventArg) => {
      eventHost.emit(this, arg);
    };

    this.addListener = (callback: EventCallback<TEventArg>) => {
      eventHost.on(this, callback);
    };

    this.addOneTimeListener = (callback: EventCallback<TEventArg>) => {
      eventHost.once(this, callback);
    };

    this.removeListener = (callback: EventCallback<TEventArg>) => {
      return eventHost.off(this, callback);
    };
  }
}
