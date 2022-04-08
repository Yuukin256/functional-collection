import { Collection } from 'index';

type TestCollection = Collection<string, number>;

test('size', () => {
  const collection: TestCollection = new Collection();

  expect(collection.size).toStrictEqual(0);

  collection.set('a', 1);
  collection.set('b', 2);
  expect(collection.size).toStrictEqual(2);

  collection.delete('b');
  expect(collection.size).toStrictEqual(1);
});

test('hasAll', () => {
  const collection: TestCollection = new Collection();

  expect(collection.hasAll()).toBe(true);
  expect(collection.hasAll('a')).toBe(false);
  expect(collection.hasAll('a', 'b')).toBe(false);

  collection.set('a', 1);
  collection.set('b', 2);

  expect(collection.hasAll()).toBe(true);
  expect(collection.hasAll('a')).toBe(true);
  expect(collection.hasAll('a', 'b')).toBe(true);

  expect(collection.hasAll('c')).toBe(false);
  expect(collection.hasAll('b', 'c')).toBe(false);
});

test('hasAny', () => {
  const collection: TestCollection = new Collection();

  expect(collection.hasAny()).toBe(false);
  expect(collection.hasAny('a')).toBe(false);
  expect(collection.hasAny('b', 'b')).toBe(false);

  collection.set('a', 1);
  collection.set('b', 2);

  expect(collection.hasAny('a')).toBe(true);
  expect(collection.hasAny('a', 'b')).toBe(true);
  expect(collection.hasAny('b', 'c')).toBe(true);

  expect(collection.hasAny()).toBe(false);
  expect(collection.hasAny('c')).toBe(false);
});

test('first', () => {
  const collection: TestCollection = new Collection();

  expect(collection.first()).toBeUndefined();

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.first()).toStrictEqual(1);
  expect(collection.first(2)).toStrictEqual([1, 2]);
  expect(collection.first(4)).toStrictEqual([1, 2, 3]);
  expect(collection.first(-1)).toStrictEqual([3]);
  expect(collection.first(-2)).toStrictEqual([2, 3]);
});

test('firstKey', () => {
  const collection: TestCollection = new Collection();

  expect(collection.firstKey()).toBeUndefined();

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.firstKey()).toStrictEqual('a');
  expect(collection.firstKey(2)).toStrictEqual(['a', 'b']);
  expect(collection.firstKey(4)).toStrictEqual(['a', 'b', 'c']);
  expect(collection.firstKey(-1)).toStrictEqual(['c']);
  expect(collection.firstKey(-2)).toStrictEqual(['b', 'c']);
});

test('last', () => {
  const collection: TestCollection = new Collection();

  expect(collection.last()).toBeUndefined();

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.last()).toStrictEqual(3);
  expect(collection.last(0)).toStrictEqual([]);
  expect(collection.last(2)).toStrictEqual([2, 3]);
  expect(collection.last(4)).toStrictEqual([1, 2, 3]);
  expect(collection.last(-1)).toStrictEqual([1]);
  expect(collection.last(-2)).toStrictEqual([1, 2]);
});

test('lastKey', () => {
  const collection: TestCollection = new Collection();

  expect(collection.lastKey()).toBeUndefined();

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.lastKey()).toStrictEqual('c');
  expect(collection.lastKey(0)).toStrictEqual([]);
  expect(collection.lastKey(2)).toStrictEqual(['b', 'c']);
  expect(collection.lastKey(4)).toStrictEqual(['a', 'b', 'c']);
  expect(collection.lastKey(-1)).toStrictEqual(['a']);
  expect(collection.lastKey(-2)).toStrictEqual(['a', 'b']);
});

test('reverse', () => {
  const collection: TestCollection = new Collection();
  collection.set('a', 1);
  collection.set('b', 2);

  collection.reverse();
  expect([...collection.values()]).toStrictEqual([2, 1]);
  expect([...collection.keys()]).toStrictEqual(['b', 'a']);
});

test('find', () => {
  const collection: TestCollection = new Collection();

  expect(collection.find((value) => value === 1)).toBeUndefined();
  expect(collection.find((_, key) => key === 'a')).toBeUndefined();

  collection.set('a', 1);
  collection.set('b', 2);

  expect(collection.find((value) => value === 1)).toStrictEqual(1);
  expect(collection.find((_, key) => key === 'a')).toStrictEqual(1);

  expect(collection.find((value) => value === 3)).toBeUndefined();
  expect(collection.find((_, key) => key === 'c')).toBeUndefined();
});

test('findKey', () => {
  const collection: TestCollection = new Collection();

  expect(collection.findKey((value) => value === 1)).toBeUndefined();
  expect(collection.findKey((_, key) => key === 'a')).toBeUndefined();

  collection.set('a', 1);
  collection.set('b', 2);

  expect(collection.findKey((value) => value === 1)).toStrictEqual('a');
  expect(collection.findKey((_, key) => key === 'a')).toStrictEqual('a');

  expect(collection.findKey((value) => value === 3)).toBeUndefined();
  expect(collection.findKey((_, key) => key === 'c')).toBeUndefined();
});

test('update', () => {
  const collection: TestCollection = new Collection();

  expect(collection.update('a', (value) => value + 10)).toStrictEqual(new Collection());

  collection.set('a', 1);

  collection.update('a', (value) => value + 10);
  expect([...collection.values()]).toStrictEqual([11]);
  expect([...collection.keys()]).toStrictEqual(['a']);

  collection.update('c', (value) => value + 10);
  expect([...collection.values()]).toStrictEqual([11]);
  expect([...collection.keys()]).toStrictEqual(['a']);
});

test('filter', () => {
  const collection: TestCollection = new Collection();
  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  const filtered1 = collection.filter((value) => value % 2 === 1);

  expect(collection.size).toStrictEqual(3);
  expect(filtered1.size).toStrictEqual(2);
  expect([...filtered1.values()]).toStrictEqual([1, 3]);
  expect([...filtered1.keys()]).toStrictEqual(['a', 'c']);

  const filtered2 = collection.filter((_, key) => key === 'a' || key === 'b');

  expect(collection.size).toStrictEqual(3);
  expect(filtered2.size).toStrictEqual(2);
  expect([...filtered2.values()]).toStrictEqual([1, 2]);
  expect([...filtered2.keys()]).toStrictEqual(['a', 'b']);
});

test('map', () => {
  const collection: TestCollection = new Collection();
  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.map((value) => value * 10)).toStrictEqual([10, 20, 30]);

  expect(collection.map((_, key) => key + 'z')).toStrictEqual(['az', 'bz', 'cz']);
});

test('flatMap', () => {
  const collection = new Collection<string, { a: Collection<string, number> }>();
  const collection1 = new Collection<string, number>();
  const collection2 = new Collection<string, number>();
  collection1.set('x', 1);
  collection1.set('y', 2);
  collection2.set('v', 3);
  collection2.set('w', 4);
  collection.set('a', { a: collection1 });
  collection.set('b', { a: collection2 });

  const mapped = collection.flatMap((x) => x.a);
  expect([...mapped.values()]).toStrictEqual([1, 2, 3, 4]);
  expect([...mapped.keys()]).toStrictEqual(['x', 'y', 'v', 'w']);
});

test('mapValues', () => {
  const collection: TestCollection = new Collection();
  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  const mapped = collection.mapValues((value) => value * 10);
  expect([...mapped.values()]).toStrictEqual([10, 20, 30]);
  expect([...mapped.keys()]).toStrictEqual(['a', 'b', 'c']);
});

test('each', () => {
  const collection: TestCollection = new Collection();
  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  const arr: [string, number][] = [];
  const fn = jest.fn((value: number, key: string) => arr.push([key, value * 10]));

  expect(collection.each(fn)).toBe(collection);

  expect(arr).toStrictEqual([
    ['a', 10],
    ['b', 20],
    ['c', 30],
  ]);
  expect(fn).toBeCalledTimes(3);
});

test('concat', () => {
  const collection1: TestCollection = new Collection();
  collection1.set('a', 1);
  const collection2: TestCollection = new Collection();
  collection2.set('b', 2);
  const collection3: TestCollection = new Collection();
  collection2.set('c', 3);

  const newCollection = collection1.concat(collection2, collection3);
  expect([...newCollection.values()]).toStrictEqual([1, 2, 3]);
  expect([...newCollection.keys()]).toStrictEqual(['a', 'b', 'c']);

  expect(collection1).toBe(collection1);
});

test('clone', () => {
  const collection: TestCollection = new Collection();

  expect(collection.clone()).toStrictEqual(collection);

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.clone()).toStrictEqual(collection);
});

test('some', () => {
  const collection: TestCollection = new Collection();

  expect(collection.some((value) => value % 2 === 1)).toBe(false);

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.some((value) => value % 2 === 1)).toBe(true);
});

test('every', () => {
  const collection: TestCollection = new Collection();

  expect(collection.every((value) => value % 2 === 1)).toBe(true);

  collection.set('a', 1);
  collection.set('c', 3);
  expect(collection.every((value) => value % 2 === 1)).toBe(true);

  collection.set('b', 2);
  expect(collection.every((value) => value % 2 === 1)).toBe(false);
});

test('reduce', () => {
  const collection: TestCollection = new Collection();

  expect(() => collection.reduce<number>((accumulator, value) => accumulator + value)).toThrowError();
  expect(collection.reduce((accumulator, value) => accumulator + value, 0)).toStrictEqual(0);

  collection.set('a', 1);
  collection.set('b', 2);
  collection.set('c', 3);

  expect(collection.reduce<number>((accumulator, value) => accumulator + value)).toStrictEqual(6);
  expect(collection.reduce((accumulator, value) => accumulator + value, 4)).toStrictEqual(10);
});

test('sort', () => {
  const collection: TestCollection = new Collection();
  collection.set('c', 3);
  collection.set('a', 1);
  collection.set('b', 2);

  collection.sort();
  expect([...collection.values()]).toStrictEqual([1, 2, 3]);
  expect([...collection.keys()]).toStrictEqual(['a', 'b', 'c']);

  collection.sort((av, bv) => bv - av);
  expect([...collection.values()]).toStrictEqual([3, 2, 1]);
  expect([...collection.keys()]).toStrictEqual(['c', 'b', 'a']);

  collection.sort((av, bv) => av - bv);
  expect([...collection.values()]).toStrictEqual([1, 2, 3]);
  expect([...collection.keys()]).toStrictEqual(['a', 'b', 'c']);
});

test('sorted', () => {
  const collection: TestCollection = new Collection();
  collection.set('c', 3);
  collection.set('a', 1);
  collection.set('b', 2);

  const sorted1 = collection.sorted();
  expect([...sorted1.values()]).toStrictEqual([1, 2, 3]);
  expect([...sorted1.keys()]).toStrictEqual(['a', 'b', 'c']);

  const sorted2 = collection.sorted((av, bv) => bv - av);
  expect([...sorted2.values()]).toStrictEqual([3, 2, 1]);
  expect([...sorted2.keys()]).toStrictEqual(['c', 'b', 'a']);

  const sorted3 = collection.sorted((av, bv) => av - bv);
  expect([...sorted3.values()]).toStrictEqual([1, 2, 3]);
  expect([...sorted3.keys()]).toStrictEqual(['a', 'b', 'c']);
});

test('defaultSort', () => {
  expect(Collection['defaultSort'](1, 2)).toStrictEqual(-1);
  expect(Collection['defaultSort'](2, 1)).toStrictEqual(1);
  expect(Collection['defaultSort']('a', 'b')).toStrictEqual(-1);
  expect(Collection['defaultSort']('b', 'a')).toStrictEqual(1);
});
