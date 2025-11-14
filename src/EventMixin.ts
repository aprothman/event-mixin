import EventProperty from './EventProperty.ts';
import IEventHost from '../type/IEventHost.ts';
import type { EventCallback, ClassConstructor } from '../type/types.ts';

// eslint-disable-next-line max-len
export default (superClass: ClassConstructor = Object) => class EventMixin extends superClass implements IEventHost {
  registerEvent<TEventArg>(name: string) {
    this[name] = new EventProperty<TEventArg>();
  }

  emit<TEventArg>(eventProperty: EventProperty<TEventArg>, arg: TEventArg) {
    eventProperty.emit(arg);
  }

  on<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    eventProperty.addListener(callback);
  }

  once<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    eventProperty.addOneTimeListener(callback);
  }

  off<TEventArg>(eventProperty: EventProperty<TEventArg>, callback: EventCallback<TEventArg>) {
    return eventProperty.removeListener(callback);
  }
};
