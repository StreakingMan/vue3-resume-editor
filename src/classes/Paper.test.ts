import { expect, test } from 'vitest';
import { Paper } from './Paper';
import type { MaterialOptions } from './Material';
import { MaterialNames } from '@/components/materials/config';

const makeTestMaterialOptions: (rect: {
    x: number;
    y: number;
    w: number;
    h: number;
    z?: number;
    groupId?: string;
    cellSize?: number;
}) => MaterialOptions<any> = ({ x, y, z, w, h, groupId, cellSize }) => ({
    x,
    y,
    z,
    w,
    h,
    groupId,
    cellSize,
    componentName: MaterialNames.MText,
    config: {},
});

test('获取选区内元素', () => {
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
    expect(selection).toEqual(paper.materialList.filter((m) => [2, 3].includes(m.z)));
});

test('元素增减', () => {
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
    // 批量删除
    paper.removeMaterial([m1.id, m3.id]);
    expect(paper.materialList.length).toEqual(1);
    expect(paper.materialList[0].id).toEqual(m4.id);
    expect(m4.z).toEqual(1);
});

test('分组操作', () => {
    const paper = new Paper({});
    const mOptions = makeTestMaterialOptions({ x: 0, y: 0, w: 100, h: 100 });
    const mOptions2 = makeTestMaterialOptions({
        groupId: 'testGroup',
        x: 100,
        y: 100,
        w: 100,
        h: 100,
    });
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions);
    paper.addMaterial(mOptions2);
    const [m1, m2, m3, m4, m5] = paper.materialList;
    expect(m5.groupId).toEqual('testGroup');
    paper.groupMaterials([m1.id, m3.id]);
    const firstGroupId = m1.groupId;
    expect(m1.groupId === m3.groupId && m1.groupId !== undefined).toEqual(true);
    expect(!m2.groupId && !m4.groupId).toEqual(true);
    paper.groupMaterials([m1.id, m2.id, m3.id]);
    expect(
        m1.groupId === m2.groupId && m2.groupId === m3.groupId && m3.groupId !== firstGroupId,
    ).toEqual(true);
    paper.unGroupMaterials(m1.groupId!);
    expect([m1.groupId, m2.groupId, m3.groupId, m4.groupId]).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
    ]);
});

test('获取分组边缘矩形', () => {
    const paper = new Paper({});
    paper.addMaterial(
        makeTestMaterialOptions({
            groupId: 'test',
            x: 480,
            y: 480,
            w: 100,
            h: 100,
        }),
    );
    paper.addMaterial(
        makeTestMaterialOptions({
            groupId: 'test',
            x: 380,
            y: 640,
            w: 100,
            h: 100,
        }),
    );
    paper.addMaterial(
        makeTestMaterialOptions({
            groupId: 'test',
            x: 40,
            y: 480,
            w: 200,
            h: 296,
        }),
    );
    expect(paper.getGroupRect('test')).toEqual({
        x: 40,
        y: 480,
        w: 540,
        h: 296,
    });
});

test('层级调整', () => {
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

test('对齐操作:左对齐', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({ x: 12, y: 0, w: 100, h: 100 });
    const mOptions2 = makeTestMaterialOptions({ x: 450, y: 0, w: 100, h: 100 });
    const mOptions3 = makeTestMaterialOptions({ x: 0, y: 0, w: 100, h: 100 });
    const mOptions4 = makeTestMaterialOptions({ x: 70, y: 0, w: 100, h: 100 });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    paper.addMaterial(mOptions4);
    const [m1, m2, m3, m4] = paper.materialList;
    paper.alignHorizontalLeft([m1.id, m2.id, m3.id, m4.id]);
    expect([m1.x, m2.x, m3.x, m4.x]).toEqual([0, 0, 0, 0]);
});

test('对齐操作:右对齐', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 300,
        y: 100,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 100,
        y: 200,
        w: 300,
        h: 100,
    });
    const mOptions3 = makeTestMaterialOptions({ x: 0, y: 300, w: 100, h: 200 });
    const mOptions4 = makeTestMaterialOptions({
        x: 400,
        y: 400,
        w: 400,
        h: 100,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    paper.addMaterial(mOptions4);
    const [m1, m2, m3, m4] = paper.materialList;
    paper.alignHorizontalRight([m1.id, m2.id, m3.id, m4.id]);
    expect([m1.x + m1.w, m2.x + m2.w, m3.x + m3.w, m4.x + m4.w]).toEqual([800, 800, 800, 800]);
});

test('对齐操作:水平居中对齐', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 0,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 300,
        y: 300,
        w: 100,
        h: 100,
    });
    const mOptions3 = makeTestMaterialOptions({
        x: 600,
        y: 400,
        w: 200,
        h: 200,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    const [m1, m2, m3] = paper.materialList;
    paper.alignHorizontalCenter([m1.id, m2.id, m3.id]);
    expect([m1.x, m2.x, m3.x]).toEqual([350, 350, 300]);
});

test('对齐操作:水平均匀分布', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 0,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 100,
        y: 300,
        w: 100,
        h: 100,
    });
    const mOptions3 = makeTestMaterialOptions({
        x: 120,
        y: 400,
        w: 200,
        h: 200,
    });
    const mOptions4 = makeTestMaterialOptions({
        x: 300,
        y: 400,
        w: 200,
        h: 200,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    paper.addMaterial(mOptions4);
    const [m1, m2, m3, m4] = paper.materialList;
    paper.alignHorizontalDistribute([m1.id, m2.id, m3.id, m4.id]);
    expect(paper.sortIdsByPosition([m1.id, m2.id, m3.id, m4.id], 'y')).toEqual([
        m1.id,
        m2.id,
        m3.id,
        m4.id,
    ]);
    expect([m1.x, m2.x, m3.x, m4.x]).toEqual([0, 100, 200, 300]);
});

test('对齐操作:顶端对齐', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 150,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 300,
        y: 300,
        w: 100,
        h: 100,
    });
    const mOptions3 = makeTestMaterialOptions({
        x: 600,
        y: 400,
        w: 200,
        h: 200,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    const [m1, m2, m3] = paper.materialList;
    paper.alignVerticalTop([m1.id, m2.id, m3.id]);
    expect([m1.y, m2.y, m3.y]).toEqual([150, 150, 150]);
});

test('对齐操作:底端对齐', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 150,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 300,
        y: 300,
        w: 100,
        h: 200,
    });
    const mOptions3 = makeTestMaterialOptions({
        x: 600,
        y: 400,
        w: 200,
        h: 100,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    const [m1, m2, m3] = paper.materialList;
    paper.alignVerticalBottom([m1.id, m2.id, m3.id]);
    expect([m1.y, m2.y, m3.y]).toEqual([400, 300, 400]);
});

test('对齐操作:垂直居中对齐', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 100,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 300,
        y: 300,
        w: 100,
        h: 100,
    });
    const mOptions3 = makeTestMaterialOptions({
        x: 600,
        y: 400,
        w: 200,
        h: 200,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    const [m1, m2, m3] = paper.materialList;
    paper.alignVerticalCenter([m1.id, m2.id, m3.id]);
    expect([m1.y, m2.y, m3.y]).toEqual([300, 300, 250]);
});

test('对齐操作:垂直均匀分布', () => {
    const paper = new Paper({});
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 0,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 100,
        y: 100,
        w: 100,
        h: 100,
    });
    const mOptions3 = makeTestMaterialOptions({
        x: 120,
        y: 150,
        w: 200,
        h: 200,
    });
    const mOptions4 = makeTestMaterialOptions({
        x: 300,
        y: 330,
        w: 200,
        h: 1,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.addMaterial(mOptions3);
    paper.addMaterial(mOptions4);
    const [m1, m2, m3, m4] = paper.materialList;
    paper.alignVerticalDistribute([m1.id, m2.id, m3.id, m4.id]);
    expect([m1.y, m2.y, m3.y, m4.y]).toEqual([0, 110, 220, 330]);
});

test('页面操作:添加页面', () => {
    const paper = new Paper({});
    paper.pageCount = 2;
    paper.cellSize = 1;
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 0,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 100,
        y: paper.h,
        w: 1,
        h: 100,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    paper.insertPage(2);
    expect(paper.pageCount).toEqual(3);
    const [m1, m2] = paper.materialList;
    expect(m1.y).toEqual(0);
    expect(m2.y).toEqual(paper.h * 2);
});

test('页面操作:删除页面', () => {
    const paper = new Paper({});
    paper.pageCount = 2;
    paper.cellSize = 1;
    const mOptions1 = makeTestMaterialOptions({
        x: 0,
        y: 0,
        w: 100,
        h: 100,
    });
    const mOptions2 = makeTestMaterialOptions({
        x: 100,
        y: paper.h,
        w: 100,
        h: 1,
    });
    paper.addMaterial(mOptions1);
    paper.addMaterial(mOptions2);
    const [, _m2] = paper.materialList;
    paper.deletePage(1);
    expect(paper.pageCount).toEqual(1);
    expect(paper.materialList.length).toEqual(1);
    const [m1] = paper.materialList;
    expect(m1.id).toEqual(_m2.id);
    expect(m1.y).toEqual(0);
});
