import { Material } from './Material';

export const makeTestMaterial: (rect: {
    x: number;
    y: number;
    w: number;
    h: number;
    z?: number;
    cellSize?: number;
}) => Material<any> = ({ x, y, w, h, z, cellSize = 1 }) => {
    return new Material<any>({
        x,
        y,
        z,
        w,
        h,
        cellSize,
        componentName: 'MText',
        config: {},
    });
};

test('cellSize', () => {
    const m1 = makeTestMaterial({ x: 123, y: 456, w: 789, h: 101, cellSize: 1 });
    expect({ x: m1.x, y: m1.y, w: m1.w, h: m1.h }).toEqual({
        x: 123,
        y: 456,
        w: 789,
        h: 101,
    });
    const m2 = makeTestMaterial({ x: 123, y: 456, w: 789, h: 101, cellSize: 2 });
    expect({ x: m2.x, y: m2.y, w: m2.w, h: m2.h }).toEqual({
        x: 122,
        y: 456,
        w: 790,
        h: 101,
    });
    const m3 = makeTestMaterial({ x: 123, y: 456, w: 789, h: 101, cellSize: 10 });
    expect({ x: m3.x, y: m3.y, w: m3.w, h: m3.h }).toEqual({
        x: 120,
        y: 460,
        w: 790,
        h: 101,
    });
});

test('centerRotate', () => {
    const m = makeTestMaterial({ x: 0, y: 5, w: 11, h: 1 });
    m.centerRotate();
    expect({ x: m.x, y: m.y, w: m.w, h: m.h }).toEqual({
        x: 5,
        y: 0,
        w: 1,
        h: 11,
    });

    const m2 = makeTestMaterial({ x: 0, y: 0, w: 200, h: 20 });
    m2.centerRotate();
    expect({ x: m2.x, y: m2.y, w: m2.w, h: m2.h }).toEqual({
        x: 90,
        y: 0,
        w: 20,
        h: 200,
    });
});
