# Event Mixin

The event mixin is designed to insert event functionality into an existing class hierarchy, independent of the DOM or any frameworks. If you're working in an object-oriented JavaScript or TypeScript project, inserting event support can be difficult to fit into the design. Putting event methods at the top of the hierarchy is often overkill if only a few classes will make use of events.

Adding event methods to a standalone class is as simple as extending from the mixin and then registering each named event before using it. In a typescript world, you'll want to declare any named EventProperty you'll be using, but this is not strictly required for the functionality. It just enables the convenience of type hinting.

```typescript
class DataConsumer extends EventMixin() {
  DataReceived!: EventProperty<DataEventArg>;

  constructor() {
    super();
    this.registerEvent<DataEventArg>('DataReceived');
  }
}
```

Inserting the mixin into a class hierarchy lets the leaf class gain access to the event methods while still extending its superclasses.

```typescript
class Animal {
  constructor(protected name: string) { }

  eat() {
    console.log(`${this.name} eats.`);
  }

  runAway() {
    console.log(`${this.name} runs away!`);
  }
}

class HowlEventArg {
  loudness: number;
}

class Wolf extends EventMixin(Animal) {
  Howl!: EventProperty<HowlEventArg>;

  constructor(name: string) {
    super(name);
    this.registerEvent<HowlEventArg>('Howl');
  }

  howl(loudness: number) {
    console.log(`${this.name} howls!`);

    this.Howl.emit({ loudness });
  }
}
```

Making another Animal subclass to consume the Wolf's Howl event is pretty straightforward.

```typescript
class Deer extends Animal {
  noticeWolf(wolf: Wolf) {
    wolf.on(
      wolf.Howl,
      ({ loudness }) => {
        if (loudness > 10) {
          this.runAway();
        } else {
          console.log(`${this.name} looks around nervously.`);
        }
      }
    );
  }
}

const wolf = new Wolf('Big Bad');
const deer1 = new Deer('Bambi');
const deer2 = new Deer('Zippy');

deer1.noticeWolf(wolf);
deer2.noticeWolf(wolf);

wolf.howl(15);
> Big Bad howls!
> Bambi runs away!
> Zippy runs away!
```
