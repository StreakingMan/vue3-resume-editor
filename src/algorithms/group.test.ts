import { sortByGroup } from './group';

test('sortByGroup', () => {
    expect(
        sortByGroup([
            { id: 1, x: 0, y: 110, groupName: 'root' },
            { id: 2, x: 60, y: 20, groupName: 'root.A' },
            { id: 3, x: 500, y: 300, groupName: 'root.A.B' },
            { id: 4, x: 400, y: 200, groupName: 'root.A.C' },
            { id: 5, x: 200, y: 600, groupName: 'root.B' },
            { id: 6, x: 200, y: 0, groupName: 'root.B' },
            { id: 7, x: 100, y: 100, groupName: 'root.A' },
            { id: 8, x: 600, y: 400, groupName: 'root.B.D' },
            { id: 9, x: 100, y: 400, groupName: 'root.A.B' },
        ])
    ).toEqual([
        { id: 3, x: 500, y: 300, groupName: 'root.A.B' },
        { id: 9, x: 100, y: 400, groupName: 'root.A.B' },
        { id: 4, x: 400, y: 200, groupName: 'root.A.C' },
        { id: 2, x: 60, y: 20, groupName: 'root.A' },
        { id: 7, x: 100, y: 100, groupName: 'root.A' },
        { id: 8, x: 600, y: 400, groupName: 'root.B.D' },
        { id: 5, x: 200, y: 600, groupName: 'root.B' },
        { id: 6, x: 200, y: 0, groupName: 'root.B' },
        { id: 1, x: 0, y: 110, groupName: 'root' },
    ]);
});
