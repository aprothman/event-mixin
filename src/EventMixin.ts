import EventProperty from './EventProperty.ts';
import IEventHost from '../type/IEventHost.ts';
import type { EventCallback, ClassConstructor } from '../type/types.ts';

// eslint-disable-next-line max-len
export default (superClass: ClassConstructor = Object) => class EventMixin extends superClass implements IEventHost {
  /**
   * Set up a named event property ready to receive event listeners.
   * @param name the name of the event being registered
   */
  registerEvent<TEventArg>(name: string) {
    this[name] = new EventProperty<TEventArg>();
  }

  /**
   * Emit an event, executing any registered event listener callbacks.
   * @param eventProperty the property for the event being emitted
   * @param arg the arg passed to consumers of the event
   */
  emit<TEventArg>(eventProperty: EventProperty<TEventArg>, arg: TEventArg) {
    eventProperty.emit(arg);
  }

  /**
   * Register a listener callback to be run when an event is emitted.
   * @param eventProperty the property for the event being listened for
   * @param callback the listener to be run when the event is emitted
   */
  on<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    eventProperty.addListener(callback);
  }

  /**
   * Register a listener callback to be run the next time the event is emitted.
   * After it is run once, the callback is removed from the list of listeners.
   * @param eventProperty the property for the event being listened for
   * @param callback the listener to be run when the event is emitted
   */
  once<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    eventProperty.addOneTimeListener(callback);
  }

  /**
   * Unregister a lisener callback so that it will not be run when the event is emitted.
   * @param eventProperty the property for the event
   * @param callback the listener to be removed from the list of event listeners
   * @returns true if the callback is found and removed
   */
  off<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    return eventProperty.removeListener(callback);
  }
};
