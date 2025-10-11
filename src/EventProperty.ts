import type IEventHost from '../type/IEventHost.ts';
import type { EventCallback } from '../type/types.ts';

/**
 * An object that represents a specific named event as a property on an event consumer object.
 */
export default class EventProperty<T> {
  [eventKey: symbol]: symbol;

  /**
   * Emit the event, calling each registered listener.
   * @param arg event argument passed to each listener
   */
  emit: (arg: T) => void;

  /**
   * Register a new listener callback for the event.
   * @param callback the listener to be added
   */
  addListener: (callback: EventCallback<T>) => void;

  /**
   * Register a new listener callback for the event that will be removed
   * after the first time that it is triggered.
   * @param callback the listener to be added
   */
  addOneTimeListener: (callback: EventCallback<T>) => void;

  /**
   * If the callback argument is a registered listener, remove it.
   * @param callback the listener to be removed
   */
  removeListener: (callback: EventCallback<T>) => boolean;

  constructor(eventConsumer: IEventHost, eventKey: symbol, eventSymbol: symbol) {
    this[eventKey] = eventSymbol;

    this.emit = (arg: T) => {
      eventConsumer.emit(this, arg);
    };

    this.addListener = (callback: EventCallback<T>) => {
      eventConsumer.on(this, callback);
    };

    this.addOneTimeListener = (callback: EventCallback<T>) => {
      eventConsumer.once(this, callback);
    };

    this.removeListener = (callback: EventCallback<T>) => {
      return eventConsumer.off(this, callback);
    };
  }
}
