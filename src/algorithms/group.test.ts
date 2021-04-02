import { getGroupsByGroupNameDiff, sortByGroup } from './group';

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

    expect(
        sortByGroup([
            { id: 1, x: 0, y: 110, groupName: 'root.A.B.C' },
            { id: 2, x: 60, y: 20, groupName: 'root.A.B' },
            { id: 3, x: 500, y: 300, groupName: 'root.A' },
            { id: 4, x: 400, y: 200, groupName: 'root' },
        ])
    ).toEqual([
        { id: 1, x: 0, y: 110, groupName: 'root.A.B.C' },
        { id: 2, x: 60, y: 20, groupName: 'root.A.B' },
        { id: 3, x: 500, y: 300, groupName: 'root.A' },
        { id: 4, x: 400, y: 200, groupName: 'root' },
    ]);

    expect(
        sortByGroup(
            [
                { id: 1, x: 0, y: 110, groupName: 'root.A.B.C' },
                { id: 2, x: 60, y: 20, groupName: 'root.A.B' },
                { id: 3, x: 500, y: 300, groupName: 'root.A' },
                { id: 4, x: 400, y: 200, groupName: 'root' },
            ].reverse()
        )
    ).toEqual([
        { id: 1, x: 0, y: 110, groupName: 'root.A.B.C' },
        { id: 2, x: 60, y: 20, groupName: 'root.A.B' },
        { id: 3, x: 500, y: 300, groupName: 'root.A' },
        { id: 4, x: 400, y: 200, groupName: 'root' },
    ]);

    expect(
        sortByGroup([
            { id: 1, x: 500, y: 300, groupName: 'root.A.B' },
            { id: 2, x: 100, y: 400, groupName: 'root.A.B' },
            { id: 3, x: 400, y: 200, groupName: 'root.A.C' },
            { id: 4, x: 60, y: 20, groupName: 'root.A' },
            { id: 5, x: 100, y: 100, groupName: 'root.A' },
        ])
    ).toEqual([
        { id: 1, x: 500, y: 300, groupName: 'root.A.B' },
        { id: 2, x: 100, y: 400, groupName: 'root.A.B' },
        { id: 3, x: 400, y: 200, groupName: 'root.A.C' },
        { id: 4, x: 60, y: 20, groupName: 'root.A' },
        { id: 5, x: 100, y: 100, groupName: 'root.A' },
    ]);

    expect(
        sortByGroup([
            { id: 1, x: 500, y: 300, groupName: 'root.A.B.C' },
            { id: 2, x: 100, y: 400, groupName: 'root.A.C.D' },
            { id: 3, x: 400, y: 200, groupName: 'root.A.B' },
            { id: 4, x: 60, y: 20, groupName: 'root.A.C' },
        ])
    ).toEqual([
        { id: 1, x: 500, y: 300, groupName: 'root.A.B.C' },
        { id: 3, x: 400, y: 200, groupName: 'root.A.B' },
        { id: 2, x: 100, y: 400, groupName: 'root.A.C.D' },
        { id: 4, x: 60, y: 20, groupName: 'root.A.C' },
    ]);
});

test('getGroupsByGroupNameDiff', () => {
    expect(getGroupsByGroupNameDiff('root.A.B', 'root.C.D')).toEqual([
        'C',
        'D',
    ]);
});
