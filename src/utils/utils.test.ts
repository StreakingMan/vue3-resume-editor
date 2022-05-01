import { uniqueString } from './uniqueString';
import { stringArrayDiff } from './stringArrayDiff';

test('stringArrayDiff', () => {
    expect(stringArrayDiff(['a', 'b', 'c'], ['a', 'b', 'd'])).toEqual({
        added: ['d'],
        removed: ['c'],
    });
    expect(stringArrayDiff(['a', 'b', 'd'], ['a', 'b', 'c'])).toEqual({
        added: ['c'],
        removed: ['d'],
    });
    expect(stringArrayDiff(['a', 'b', 'c'], ['a', 'd', 'c'])).toEqual({
        added: ['d'],
        removed: ['b'],
    });
    expect(stringArrayDiff(['a', 'b', 'c'], ['d', 'b', 'c'])).toEqual({
        added: ['d'],
        removed: ['a'],
    });
    expect(stringArrayDiff(['d', 'b', 'c'], ['a', 'b', 'c'])).toEqual({
        added: ['a'],
        removed: ['d'],
    });
    expect(stringArrayDiff(['d'], ['d', 'a', 'b'])).toEqual({
        added: ['a', 'b'],
        removed: [],
    });
    expect(stringArrayDiff([], ['a', 'b', 'd'])).toEqual({
        added: ['a', 'b', 'd'],
        removed: [],
    });
    expect(stringArrayDiff(['a', 'b', 'c'], [])).toEqual({
        added: [],
        removed: ['a', 'b', 'c'],
    });
    expect(stringArrayDiff(['a', 'b', 'c'], ['c', 'b'])).toEqual({
        added: [],
        removed: ['a'],
    });
    expect(stringArrayDiff(['a', 'b', 'c'], ['e', 'f', 'g'])).toEqual({
        added: ['e', 'f', 'g'],
        removed: ['a', 'b', 'c'],
    });
    expect(
        stringArrayDiff(
            ['a', 'b', 'b', 'c', 'c'],
            ['a', 'a', 'b', 'e', 'e', 'f', 'g']
        )
    ).toEqual({
        added: ['e', 'f', 'g'],
        removed: ['c'],
    });
    expect(stringArrayDiff([], [])).toEqual({
        added: [],
        removed: [],
    });
});

test('uniqueString', () => {
    const us1 = uniqueString();
    const us2 = uniqueString();
    expect(us1.length).toBe(4);
    expect(us1 === us2).toBe(false);
});
