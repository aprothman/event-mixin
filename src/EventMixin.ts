import MulticastEvent from './MulticastEvent.ts';
import EventProperty from './EventProperty.ts';
import IEventHost from '../type/IEventHost.ts';
import type { EventCallback, ClassConstructor } from '../type/types.ts';

const events: unique symbol = Symbol('events');
const eventKey: unique symbol = Symbol('eventKey');

// eslint-disable-next-line max-len
export default (superClass: ClassConstructor = Object) => class EventMixin extends superClass implements IEventHost {
  // hidden property containing event implementations
  [events]: Record<symbol, MulticastEvent<any>> = {};

  registerEvent<T>(name: string) {
    const eventNameSymbol = Symbol.for(name);

    // event system implementation
    this[events][eventNameSymbol] = new MulticastEvent<T>(eventNameSymbol);

    // named event property
    this[name] = new EventProperty<T>(this, eventKey, eventNameSymbol);
  }

  emit<T>(eventProperty: EventProperty<T>, arg: T) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<T> = this[events][eventSymbol];
    event.raiseEvent(arg);
  }

  on<T>(eventProperty: EventProperty<T>, callback: EventCallback<T>) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<T> = this[events][eventSymbol];
    event.registerCallback(callback);
  }

  once<T>(eventProperty: EventProperty<T>, callback: EventCallback<T>) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<T> = this[events][eventSymbol];
    event.registerCallbackWithRemoval(callback);
  }

  off<T>(eventProperty: EventProperty<T>, callback: EventCallback<T>) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<T> = this[events][eventSymbol];
    return event.unregisterCallback(callback);
  }
};
