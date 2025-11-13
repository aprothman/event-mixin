// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassConstructor = new(...args: unknown[]) => any;

type EventCallback<TEventArg> = (e: TEventArg) => void;

export type { EventCallback, ClassConstructor };
