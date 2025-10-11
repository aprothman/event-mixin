// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassConstructor = new(...args: unknown[]) => any;

type EventCallback<T> = (e: T) => void;

export type { EventCallback, ClassConstructor };
