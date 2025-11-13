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

  registerEvent<TEventArg>(name: string) {
    const eventNameSymbol = Symbol.for(name);

    // event system implementation
    this[events][eventNameSymbol] = new MulticastEvent<TEventArg>(eventNameSymbol);

    // named event property
    this[name] = new EventProperty<TEventArg>(this, eventKey, eventNameSymbol);
  }

  emit<TEventArg>(eventProperty: EventProperty<TEventArg>, arg: TEventArg) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<TEventArg> = this[events][eventSymbol];
    event.raiseEvent(arg);
  }

  on<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<TEventArg> = this[events][eventSymbol];
    event.registerCallback(callback);
  }

  once<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<TEventArg> = this[events][eventSymbol];
    event.registerCallbackWithRemoval(callback);
  }

  off<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    const eventSymbol = eventProperty[eventKey];
    const event: MulticastEvent<TEventArg> = this[events][eventSymbol];
    return event.unregisterCallback(callback);
  }
};
