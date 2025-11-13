import { expect } from 'chai';

import EventMixin from '../src/EventMixin.ts';
import EventProperty from '../src/EventProperty.ts';
import type { EventCallback } from '../type/types.ts';

interface DataEventArg {
  value: number;
}

class Minimal extends EventMixin() {};

class DataConsumer extends EventMixin() {
  DataReceived!: EventProperty<DataEventArg>;

  constructor() {
    super();
    this.registerEvent<DataEventArg>('DataReceived');
  }
}

const eventMethodNames = [
  'registerEvent',
  'on',
  'once',
  'off',
  'emit',
];

describe('Event Mixin Initialization', function () {
  it('constructor, mixin added between classes, superclass methods available', function () {
    class Top {
      doTop() {}
    }
    class Bottom extends EventMixin(Top) {}
    const bot = new Bottom();

    expect(bot).to.be.an.instanceOf(Top).with.property('doTop');
  });

  it('constructor, mixin added between classes, adds mixin methods', function () {
    class Top {}
    class Bottom extends EventMixin(Top) {}
    const bot = new Bottom();

    eventMethodNames.forEach((methodName) => {
      expect(bot).to.have.property(methodName);
    });
  });

  it('constructor, mixin added without superclass, adds mixin methods', function () {
    class Bottom extends EventMixin() {}
    const bot = new Bottom();

    eventMethodNames.forEach((methodName) => {
      expect(bot).to.have.property(methodName);
    });
  });
});

describe('Event Behavior', function () {
  it('registerEvent(), not pre-declared, adds named event property', function () {
    const bot = new Minimal();
    bot.registerEvent('DataReceived');
    
    expect(bot).to.have.own.property('DataReceived').with.instanceOf(EventProperty);
  });

  it('registerEvent(), pre-declared, initializes named event property', function () {
    class Consumer extends EventMixin() {
      DataReceived!: EventProperty<DataEventArg>;

      constructor() {
        super();
        this.registerEvent<DataEventArg>('DataReceived');
      }
    }
    const bot = new Consumer();

    expect(bot.DataReceived).to.be.instanceOf(EventProperty<DataEventArg>);
  });

  it('emit(), listener not registered, does not throw', function () {
    const bot = new DataConsumer();
    
    const increment = 6;

    const data: DataEventArg = { value: increment };
    expect(bot.emit(bot.DataReceived, data)).not.to.throw;
  });

  it('on(), single call, registers listener triggered on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    bot.on(bot.DataReceived, ({ value }) => count += value);

    bot.emit(bot.DataReceived, { value: increment });

    expect(count).to.equal(increment);
  });

  it('on(), single call, registers listener triggered multiple times on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const numEvents = 3;
    bot.on(bot.DataReceived, ({ value }) => count += value);

    const data: DataEventArg = { value: increment };
    for (let i = 0; i < numEvents; ++i) {
      bot.emit(bot.DataReceived, data);
    }

    expect(count).to.equal(increment * numEvents);
  });

  it('on(), multiple calls, registers multiple listeners triggered on emit()', function () {
    const bot = new DataConsumer();
    
    let count1 = 0;
    let count2 = 0;
    const increment = 6;
    bot.on(bot.DataReceived, ({ value }) => count1 += value);
    bot.on(bot.DataReceived, ({ value }) => count2 += value);

    const data: DataEventArg = { value: increment };
    bot.emit(bot.DataReceived, data);

    expect(count1).to.equal(increment);
    expect(count2).to.equal(increment);
  });

  it('off(), invalid listener, returns false', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const listener: EventCallback<DataEventArg> = ({ value }) => count += value;
    const ret = bot.off(bot.DataReceived, listener);

    expect(ret).to.be.false;
  });

  it('off(), unregisters listener, does not trigger on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const listener: EventCallback<DataEventArg> = ({ value }) => count += value;
    bot.on(bot.DataReceived, listener);
    const ret = bot.off(bot.DataReceived, listener);

    const data: DataEventArg = { value: increment };
    bot.emit(bot.DataReceived, data);

    expect(count).to.equal(0);
    expect(ret).to.be.true;
  });

  it('off(), unregisters only first listener, does not trigger on emit()', function () {
    const bot = new DataConsumer();
    
    let count1 = 0;
    let count2 = 0
    let count3 = 0;
    const increment = 6;
    const listener1: EventCallback<DataEventArg> = ({ value }) => count1 += value;
    const listener2: EventCallback<DataEventArg> = ({ value }) => count2 += value;
    const listener3: EventCallback<DataEventArg> = ({ value }) => count3 += value;
    bot.on(bot.DataReceived, listener1);
    bot.on(bot.DataReceived, listener2);
    bot.on(bot.DataReceived, listener3);
    const ret = bot.off(bot.DataReceived, listener1);

    const data: DataEventArg = { value: increment };
    bot.emit(bot.DataReceived, data);

    expect(count1).to.equal(0);
    expect(count2).to.equal(increment);
    expect(count3).to.equal(increment);
    expect(ret).to.be.true;
  });

  it('off(), unregisters only last listener, does not trigger on emit()', function () {
    const bot = new DataConsumer();
    
    let count1 = 0;
    let count2 = 0
    let count3 = 0;
    const increment = 6;
    const listener1: EventCallback<DataEventArg> = ({ value }) => count1 += value;
    const listener2: EventCallback<DataEventArg> = ({ value }) => count2 += value;
    const listener3: EventCallback<DataEventArg> = ({ value }) => count3 += value;
    bot.on(bot.DataReceived, listener1);
    bot.on(bot.DataReceived, listener2);
    bot.on(bot.DataReceived, listener3);
    const ret = bot.off(bot.DataReceived, listener3);

    const data: DataEventArg = { value: increment };
    bot.emit(bot.DataReceived, data);

    expect(count1).to.equal(increment);
    expect(count2).to.equal(increment);
    expect(count3).to.equal(0);
    expect(ret).to.be.true;
  });

  it('off(), unregisters only middle listener, does not trigger on emit()', function () {
    const bot = new DataConsumer();
    
    let count1 = 0;
    let count2 = 0
    let count3 = 0;
    const increment = 6;
    const listener1: EventCallback<DataEventArg> = ({ value }) => count1 += value;
    const listener2: EventCallback<DataEventArg> = ({ value }) => count2 += value;
    const listener3: EventCallback<DataEventArg> = ({ value }) => count3 += value;
    bot.on(bot.DataReceived, listener1);
    bot.on(bot.DataReceived, listener2);
    bot.on(bot.DataReceived, listener3);
    const ret = bot.off(bot.DataReceived, listener2);

    const data: DataEventArg = { value: increment };
    bot.emit(bot.DataReceived, data);

    expect(count1).to.equal(increment);
    expect(count2).to.equal(0);
    expect(count3).to.equal(increment);
    expect(ret).to.be.true;
  });

  it('once(), registers listener triggered only once on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const numEvents = 3;
    bot.once(bot.DataReceived, ({ value }) => count += value);

    const data: DataEventArg = { value: increment };
    for (let i = 0; i < numEvents; ++i) {
      bot.emit(bot.DataReceived, data);
    }

    expect(count).to.equal(increment);
  });

  it('once(), off() called before emit(), listener not triggered', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const numEvents = 3;
    const listener: EventCallback<DataEventArg> = ({ value }) => count += value;
  
    bot.once(bot.DataReceived, listener);
    const ret = bot.off(bot.DataReceived, listener);
    
    const data: DataEventArg = { value: increment };
    for (let i = 0; i < numEvents; ++i) {
      bot.emit(bot.DataReceived, data);
    }

    expect(count).to.equal(0);
    expect(ret).to.be.true;
  });

  it('once(), multiple listeners, all trigger correctly on emit()', function () {
    const bot = new DataConsumer();
    
    let count1 = 0;
    let count2 = 0
    let count3 = 0;
    const increment = 6;
    const numEvents = 3;

    const listener1: EventCallback<DataEventArg> = ({ value }) => count1 += value;
    const listener2: EventCallback<DataEventArg> = ({ value }) => count2 += value;
    const listener3: EventCallback<DataEventArg> = ({ value }) => count3 += value;

    bot.on(bot.DataReceived, listener1);
    bot.once(bot.DataReceived, listener2);
    bot.on(bot.DataReceived, listener3);

    const data: DataEventArg = { value: increment };
    for (let i = 0; i < numEvents; ++i) {
      bot.emit(bot.DataReceived, data);
    }

    expect(count1).to.equal(increment * numEvents);
    expect(count2).to.equal(increment);
    expect(count3).to.equal(increment * numEvents);
  });
});

describe('Event Property Interface', function () {
  it('addListener(), single call, registers listener triggered on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    bot.DataReceived.addListener(({ value }) => count += value);

    bot.DataReceived.emit({ value: increment });

    expect(count).to.equal(increment);
  });

  it('addListener(), single call, registers listener triggered multiple times on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const numEvents = 3;
    bot.DataReceived.addListener(({ value }) => count += value);

    const data: DataEventArg = { value: increment };
    for (let i = 0; i < numEvents; ++i) {
      bot.DataReceived.emit(data);
    }

    expect(count).to.equal(increment * numEvents);
  });

  it('addListener(), multiple calls, registers multiple listeners triggered on emit()', function () {
    const bot = new DataConsumer();
    
    let count1 = 0;
    let count2 = 0;
    const increment = 6;
    bot.DataReceived.addListener(({ value }) => count1 += value);
    bot.DataReceived.addListener(({ value }) => count2 += value);

    const data: DataEventArg = { value: increment };
    bot.DataReceived.emit(data);

    expect(count1).to.equal(increment);
    expect(count2).to.equal(increment);
  });

  it('removeListener(), invalid listener, returns false', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const listener: EventCallback<DataEventArg> = ({ value }) => count += value;
    const ret = bot.DataReceived.removeListener(listener);

    expect(ret).to.be.false;
  });

  it('removeListener(), unregisters listener, does not trigger on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const listener: EventCallback<DataEventArg> = ({ value }) => count += value;
    bot.DataReceived.addListener(listener);
    const ret = bot.DataReceived.removeListener(listener);

    const data: DataEventArg = { value: increment };
    bot.DataReceived.emit(data);

    expect(count).to.equal(0);
    expect(ret).to.be.true;
  });

  it('addOneTimeListener(), registers listener triggered only once on emit()', function () {
    const bot = new DataConsumer();
    
    let count = 0;
    const increment = 6;
    const numEvents = 3;
    bot.DataReceived.addOneTimeListener(({ value }) => count += value);

    const data: DataEventArg = { value: increment };
    for (let i = 0; i < numEvents; ++i) {
      bot.DataReceived.emit(data);
    }

    expect(count).to.equal(increment);
  });
});
