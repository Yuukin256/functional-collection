export interface CollectionConstructor {
  new (): Collection<unknown, unknown>;
  new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Collection<K, V>;
  new <K, V>(iterable: Iterable<readonly [K, V]>): Collection<K, V>;
  readonly prototype: Collection<unknown, unknown>;
  readonly [Symbol.species]: CollectionConstructor;
}

export interface Collection<K, V> extends Map<K, V> {
  constructor: CollectionConstructor;
}

export type ReadonlyCollection<K, V> = ReadonlyMap<K, V> &
  Omit<Collection<K, V>, 'forEach' | 'reverse' | 'sort' | 'get' | 'set' | 'delete'>;

export class Collection<K, V> extends Map<K, V> {
  public static readonly default: typeof Collection = Collection;

  /**
   * Checks if all of the elements exist in the collection.
   */
  public hasAll(...keys: K[]) {
    return keys.every((k) => super.has(k));
  }

  /**
   * Checks if any of the elements exist in the collection.
   */
  public hasAny(...keys: K[]) {
    return keys.some((k) => super.has(k));
  }

  /**
   * Obtains the first value(s) in this collection.
   */
  public first(): V | undefined;
  public first(amount: number): V[];
  public first(amount?: number): V | V[] | undefined {
    if (typeof amount === 'undefined') return this.values().next().value;
    if (amount < 0) return this.last(amount * -1);
    amount = Math.min(this.size, amount);
    const iter = this.values();
    return Array.from({ length: amount }, (): V => iter.next().value);
  }

  /**
   * Obtains the first key(s) in this collection.
   */
  public firstKey(): K | undefined;
  public firstKey(amount: number): K[];
  public firstKey(amount?: number): K | K[] | undefined {
    if (typeof amount === 'undefined') return this.keys().next().value;
    if (amount < 0) return this.lastKey(amount * -1);
    amount = Math.min(this.size, amount);
    const iter = this.keys();
    return Array.from({ length: amount }, (): K => iter.next().value);
  }

  /**
   * Obtains the last value(s) in this collection.
   */
  public last(): V | undefined;
  public last(amount: number): V[];
  public last(amount?: number): V | V[] | undefined {
    const arr = [...this.values()];
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.first(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Obtains the last key(s) in this collection.
   */
  public lastKey(): K | undefined;
  public lastKey(amount: number): K[];
  public lastKey(amount?: number): K | K[] | undefined {
    const arr = [...this.keys()];
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.firstKey(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Identical to [Array.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
   * but returns a Collection instead of an Array
   */
  public reverse(): this {
    const entries = [...this.entries()].reverse();
    this.clear();
    for (const [key, value] of entries) this.set(key, value);
    return this;
  }

  /**
   * Searches for a single item where the given function returns a truthy value. This behaves like
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * <warn>If you want to find by id you should use the `get` method. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
   */
  public find<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): V2 | undefined;
  public find(fn: (value: V, key: K, collection: this) => boolean): V | undefined;
  public find<This, V2 extends V>(
    fn: (this: This, value: V, key: K, collection: this) => value is V2,
    thisArg: This
  ): V2 | undefined;
  public find<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): V | undefined;
  public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): V | undefined {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

  /**
   * Searches for the key of a single item where the given function returns a truthy value. This behaves like
   * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
   * but returns the key instead of the positional index.
   */
  public findKey<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): K2 | undefined;
  public findKey(fn: (value: V, key: K, collection: this) => boolean): K | undefined;
  public findKey<This, K2 extends K>(
    fn: (this: This, value: V, key: K, collection: this) => key is K2,
    thisArg: This
  ): K2 | undefined;
  public findKey<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): K | undefined;
  public findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): K | undefined {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return key;
    }
    return undefined;
  }

  /**
   * Set the value which given function returns to the given key if the value of the key exists.
   */
  public update(key: K, fn: (value: V, key: K, collection: this) => V): this;
  public update<This>(key: K, fn: (this: This, value: V, key: K, collection: this) => V, thisArg: This): this;
  public update(key: K, fn: (value: V, key: K, collection: this) => V, thisArg?: unknown): this {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const prev = super.get(key);
    if (prev) {
      super.set(key, fn(prev, key, this));
    }
    return this;
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   */
  public filter<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): Collection<K2, V>;
  public filter<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): Collection<K, V2>;
  public filter(fn: (value: V, key: K, collection: this) => boolean): Collection<K, V>;
  public filter<This, K2 extends K>(
    fn: (this: This, value: V, key: K, collection: this) => key is K2,
    thisArg: This
  ): Collection<K2, V>;
  public filter<This, V2 extends V>(
    fn: (this: This, value: V, key: K, collection: this) => value is V2,
    thisArg: This
  ): Collection<K, V2>;
  public filter<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): Collection<K, V>;
  public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): Collection<K, V> {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const results = new this.constructor[Symbol.species]<K, V>();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * Maps each item to another value into an array. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   */
  public map<T>(fn: (value: V, key: K, collection: this) => T): T[];
  public map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
  public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const iter = this.entries();
    return Array.from({ length: this.size }, (): T => {
      const [key, value] = iter.next().value;
      return fn(value, key, this);
    });
  }

  /**
   * Maps each item into a Collection, then joins the results into a single Collection. Identical in behavior to
   * [Array.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).
   */
  public flatMap<T>(fn: (value: V, key: K, collection: this) => Collection<K, T>): Collection<K, T>;
  public flatMap<T, This>(
    fn: (this: This, value: V, key: K, collection: this) => Collection<K, T>,
    thisArg: This
  ): Collection<K, T>;
  public flatMap<T>(fn: (value: V, key: K, collection: this) => Collection<K, T>, thisArg?: unknown): Collection<K, T> {
    const collections = this.map(fn, thisArg);
    return new this.constructor[Symbol.species]<K, T>().concat(...collections);
  }

  /**
   * Maps each item to another value into a collection. Identical in behavior to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   */
  public mapValues<T>(fn: (value: V, key: K, collection: this) => T): Collection<K, T>;
  public mapValues<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): Collection<K, T>;
  public mapValues<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): Collection<K, T> {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const coll = new this.constructor[Symbol.species]<K, T>();
    for (const [key, val] of this) coll.set(key, fn(val, key, this));
    return coll;
  }

  /**
   * Identical to
   * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
   * but returns the collection instead of undefined.
   */
  public each(fn: (value: V, key: K, collection: this) => void): this;
  public each<T>(fn: (this: T, value: V, key: K, collection: this) => void, thisArg: T): this;
  public each(fn: (value: V, key: K, collection: this) => void, thisArg?: unknown): this {
    this.forEach(fn as (value: V, key: K, map: Map<K, V>) => void, thisArg);
    return this;
  }

  /**
   *  Combines this collection with others into a new collection. Without the source collections modified.
   */
  public concat(...collections: ReadonlyCollection<K, V>[]) {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  /**
   * Creates an identical shallow copy of this collection.
   */
  public clone(): Collection<K, V> {
    return new this.constructor[Symbol.species](this);
  }

  /**
   * Checks if there exists an item that passes a test. Identical in behavior to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   */
  public some(fn: (value: V, key: K, collection: this) => boolean): boolean;
  public some<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): boolean;
  public some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * Checks if all items passes a test. Identical in behavior to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   */
  public every<K2 extends K>(fn: (value: V, key: K, collection: this) => key is K2): this is Collection<K2, V>;
  public every<V2 extends V>(fn: (value: V, key: K, collection: this) => value is V2): this is Collection<K, V2>;
  public every(fn: (value: V, key: K, collection: this) => boolean): boolean;
  public every<This, K2 extends K>(
    fn: (this: This, value: V, key: K, collection: this) => key is K2,
    thisArg: This
  ): this is Collection<K2, V>;
  public every<This, V2 extends V>(
    fn: (this: This, value: V, key: K, collection: this) => value is V2,
    thisArg: This
  ): this is Collection<K, V2>;
  public every<This>(fn: (this: This, value: V, key: K, collection: this) => boolean, thisArg: This): boolean;
  public every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * Applies a function to produce a single value. Identical in behavior to
   * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
   */
  public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue?: T): T {
    let accumulator!: T;

    if (typeof initialValue !== 'undefined') {
      accumulator = initialValue;
      for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
      return accumulator;
    }
    let first = true;
    for (const [key, val] of this) {
      if (first) {
        accumulator = val as unknown as T;
        first = false;
        continue;
      }
      accumulator = fn(accumulator, val, key, this);
    }

    if (first) {
      throw new TypeError('Reduce of empty collection with no initial value');
    }

    return accumulator;
  }

  /**
   * The sort method sorts the items of a collection in place and returns it.
   * The source collection will be modified.
   * The default sort order is according to string Unicode code points.
   */
  public sort(compareFunction: Comparator<K, V> = Collection.defaultSort) {
    const entries = [...this.entries()];
    entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

    super.clear();

    for (const [k, v] of entries) {
      super.set(k, v);
    }
    return this;
  }

  /**
   * The sorted method sorts the items of a collection and returns it.
   * None of the source collection are modified.
   * The default sort order is according to string Unicode code points.
   */
  public sorted(compareFunction: Comparator<K, V> = Collection.defaultSort) {
    return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
  }

  private static defaultSort<V>(firstValue: V, secondValue: V): number {
    return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
  }
}

export type Comparator<K, V> = (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number;
