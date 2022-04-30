import { Paper } from './Paper';
import { MaterialOptions } from './Material';

const makeTestMaterialOptions: (rect: {
    x: number;
    y: number;
    w: number;
    h: number;
    z?: number;
    cellSize?: number;
}) => MaterialOptions<any> = ({ x, y, z, w, h, cellSize }) => ({
    x,
    y,
    z,
    w,
    h,
    cellSize,
    componentName: 'MText',
    config: {},
});

test('getSelectRangeMaterial', () => {
    const paper = new Paper({});
    const mAOptions = makeTestMaterialOptions({ x: 0, y: 0, w: 100, h: 100 });
    const mBOptions = makeTestMaterialOptions({
        x: 200,
        y: 200,
        w: 100,
        h: 100,
    });
    const mCOptions = makeTestMaterialOptions({
        x: 100,
        y: 400,
        w: 100,
        h: 100,
    });
    const mDOptions = makeTestMaterialOptions({
        x: 400,
        y: 900,
        w: 100,
        h: 100,
    });
    const selectRangeA = { x: 100, y: 100, w: 400, h: 400 };
    paper.addMaterial(mAOptions);
    paper.addMaterial(mBOptions);
    paper.addMaterial(mCOptions);
    paper.addMaterial(mDOptions);
    const selection = paper.getSelectRangeMaterial(selectRangeA);
    expect(selection).toEqual(
        paper.materialList.filter((m) => [2, 3].includes(m.z))
    );
});

test('CURD', () => {
    const paper = new Paper({});
    expect(paper.materialList).toEqual([]);
    const mOptions = makeTestMaterialOptions({ x: 0, y: 0, w: 100, h: 100 });
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    expect(paper.materialList.length).toEqual(4);
    const [m1, m2, m3, m4] = paper.materialList;
    expect([m1.z, m2.z, m3.z, m4.z]).toEqual([1, 2, 3, 4]);
    paper.removeMaterial(m2.id);
    expect(paper.materialList.length).toEqual(3);
    // 删除元素后调整层级
    expect([m1.z, m3.z, m4.z]).toEqual([1, 2, 3]);
});

test('adjustZ', () => {
    const paper = new Paper({});
    const mOptions = makeTestMaterialOptions({ x: 0, y: 0, w: 100, h: 100 });
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    const [m1, m2, m3, m4] = paper.materialList;
    expect([m1.z, m2.z, m3.z, m4.z]).toEqual([1, 2, 3, 4]);
    // m1, m2, m3, m4 =>
    // m2, m1, m3, m4
    paper.bringForward(m1.id);
    expect([m2.z, m1.z, m3.z, m4.z]).toEqual([1, 2, 3, 4]);
    // m2, m1, m3, m4 =>
    // m2, m1, m4, m3
    paper.sendBackward(m4.id);
    expect([m2.z, m1.z, m4.z, m3.z]).toEqual([1, 2, 3, 4]);
    // m2, m1, m4, m3 =>
    // m3, m2, m1, m4
    paper.sendToBack(m3.id);
    expect([m3.z, m2.z, m1.z, m4.z]).toEqual([1, 2, 3, 4]);
    // m3, m2, m1, m4 =>
    // m3, m1, m4, m2
    paper.bringToFront(m2.id);
    expect([m3.z, m1.z, m4.z, m2.z]).toEqual([1, 2, 3, 4]);
});
