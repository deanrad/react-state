export function tuple<T extends any[]>(...args: T): T {
  return args;
}

export function compose<A extends any[], B, C>(
  fa: (...args: A) => B,
  fb: (b: B) => C
): (...args: A) => C {
  return (...args: A) => fb(fa(...args));
}
