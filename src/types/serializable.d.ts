export type Serializable<T> =
  T extends Map<infer K, infer V>
    ? Array<[Serializable<K>, Serializable<V>]> // Maps become Arrays of [Key, Value] pairs
    : T extends Set<infer U>
      ? Array<Serializable<U>> // Sets become Arrays of values
      : T extends object
        ? { [K in keyof T]: Serializable<T[K]> } // Recursively scan standard objects
        : T; // Leave primitives (strings, numbers, brands) completely alone
