import type EventProperty from '../src/EventProperty';
import type { EventCallback } from './types';

export default interface IEventHost {
  /**
   * Initialize a new event for this object. This method must be called before
   * the event system can be used for a given event.
   * @param name the name of the event to be registered
   */
  registerEvent(name: string): void;

  /**
   * Emit the event, calling each registered listener callback.
   * @param eventProperty the event property associated with a unique event
   * @param arg event argument passed to each callback
   */
  emit<T>(eventProperty: EventProperty<T>, arg: T): void;

  /**
   * Add a new callback to the list of listeners for an event.
   * @param eventProperty the event property associated with a unique event
   * @param callback the listener function to register for the event
   */
  on<T>(eventProperty: EventProperty<T>, callback: EventCallback<T>): void;

  /**
   * Add a new callback to the list of listeners for an event. This callback
   * will be removed after the first time it is called.
   * @param eventProperty the event property associated with a unique event
   * @param callback the listener function to register for the event
   */
  once<T>(eventProperty: EventProperty<T>, callback: EventCallback<T>): void;

  /**
   * If the callback argument is registered as a listener for the given event, remove it.
   * @param eventProperty the event property associated with a unique event
   * @param callback function previously registered as a listener
   * @returns true if the callback function was found and removed
   */
  off<T>(eventProperty: EventProperty<T>, callback: EventCallback<T>): boolean;
}
