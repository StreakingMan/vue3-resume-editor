import { calcSelectedItem } from './item';

test('calcSelectedItem', () => {
    expect(
        calcSelectedItem(
            [
                [100, 100],
                [500, 500],
            ],
            [
                { id: 1, x: 0, y: 0, groupName: 'root.A.B' },
                { id: 2, x: 200, y: 200, groupName: 'root.A.B' },
                { id: 3, x: 100, y: 400, groupName: 'root.A.B' },
                { id: 4, x: 400, y: 900, groupName: 'root.A.B' },
            ]
        )
    ).toEqual([
        { id: 2, x: 200, y: 200, groupName: 'root.A.B' },
        { id: 3, x: 100, y: 400, groupName: 'root.A.B' },
    ]);
});
