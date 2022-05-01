import { Material, MaterialOptions } from './Material';
import { uniqueString } from '../utils/uniqueString';
import {InjectionKey} from "vue";
import {UnwrapNestedRefs} from "@vue/reactivity";

const LOCAL_STORAGE_KEY = 'paper_cache';

const paperSizeMap = {
    a4: {
        w: 620,
        h: 877,
    },
};

export const paperInjectionKey: InjectionKey<UnwrapNestedRefs<Paper>> = Symbol(
    'Paper'
);

export interface PaperOptions {
    size?: 'a4';
    cellSize?: number;
}

export class Paper {
    public w: number;
    public h: number;
    public background = 'white';
    public materialList: Material<any>[] = [];
    private _materialMap: Map<Material<any>['id'], Material<any>>;
    private _groupMap: Map<
        Material<any>['groupId'],
        Map<Material<any>['id'], Material<any>>
    >;
    // 网格尺寸同步到每个元素实例
    private _cellSize = 10;
    get cellSize(): number {
        return this._cellSize;
    }
    set cellSize(value: number) {
        this._cellSize = value;
        this.materialList.forEach((m) => {
            m.cellSize = value;
        });
    }
    // 当前z值map
    // 该访问器在同一批次的操作中应提前访问然后缓存
    get currentZMap(): Map<number, Material<any>> {
        const map = new Map();
        this.materialList.forEach((m) => {
            map.set(m.z, m);
        });
        return map;
    }
    constructor({ size, cellSize }: PaperOptions) {
        const { w, h } = paperSizeMap[size || 'a4'];
        this.w = w;
        this.h = h;
        this._materialMap = new Map();
        this._groupMap = new Map();
        if (cellSize) this.cellSize = cellSize;
    }
    loadFromStorage(): void {
        const jsonString = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!jsonString) return;
        const data = JSON.parse(jsonString);
        this.loadData(data);
    }
    loadData(data: {
        background: string;
        w: number;
        h: number;
        _cellSize: number;
        materialList: any[];
    }): void {
        const { w, h, _cellSize, materialList = [], background } = data;
        this.background = background;
        this.w = w;
        this.h = h;
        this.cellSize = _cellSize;
        this.materialList = [];
        this._materialMap.clear();
        this._groupMap.clear();
        materialList.forEach((m) => {
            this.addMaterial({
                componentName: m.componentName,
                _id: m._id,
                x: m._x,
                y: m._y,
                z: m.z,
                w: m._w,
                h: m._h,
                cellSize: m.cellSize,
                config: m.config,
                groupId: m.groupId,
            });
        });
    }
    isNeedSave(): boolean {
        return (
            JSON.stringify(this) !==
            window.localStorage.getItem(LOCAL_STORAGE_KEY)
        );
    }
    saveToStorage(): void {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this));
    }
    addMaterial({
        z,
        cellSize,
        groupId,
        ...options
    }: MaterialOptions<any>): Material<any>[] {
        const materialInstance = new Material({
            ...options,
            groupId,
            z: z ?? this.materialList.length + 1,
            cellSize: cellSize ?? this.cellSize,
        });
        this.materialList.push(materialInstance);
        this._materialMap.set(materialInstance.id, materialInstance);
        if (groupId) {
            const group = this._groupMap.get(groupId);
            if (group) {
                group.set(materialInstance.id, materialInstance);
            } else {
                const newGroup = new Map();
                newGroup.set(materialInstance.id, materialInstance);
                this._groupMap.set(groupId, newGroup);
            }
        }
        return this.materialList;
    }
    removeMaterial(idOrIds: Material<any>['id'] | Material<any>['id'][]): void {
        const deleteFunc: (id: Material<any>['id']) => void = (id) => {
            const findIdx = this.materialList.findIndex((m) => m.id === id);
            if (findIdx !== -1) {
                // 调整层级，后面的递补
                const zMap = this.currentZMap;
                let startZ = this._materialMap.get(id)!.z;
                while (startZ < this.materialList.length) {
                    const nextInstance = zMap.get(startZ + 1);
                    if (nextInstance) {
                        nextInstance.z -= 1;
                    }
                    startZ += 1;
                }
                this.materialList.splice(findIdx, 1);
                this._materialMap.delete(id);
            }
        };
        if (Array.isArray(idOrIds)) {
            for (const id of idOrIds) {
                deleteFunc(id);
            }
        } else {
            deleteFunc(idOrIds);
        }
    }
    queryMaterial(id: Material<any>['id']): Material<any> | undefined {
        return this._materialMap.get(id);
    }
    // 编组操作
    groupMaterials(ids: Material<any>['id'][]): void {
        const newGroupId = uniqueString();
        // 查询包含的编组
        const existGroups = [];
        for (const id of ids) {
            const m = this._materialMap.get(id);
            if (m?.groupId) {
                existGroups.push(m.groupId);
            }
        }
        // 所有元素重置分组
        const newGroup = new Map();
        for (const id of ids) {
            const m = this._materialMap.get(id);
            if (m) {
                m.groupId = newGroupId;
                newGroup.set(m.id, m);
            }
        }
        // 缓存
        existGroups.forEach((groupId) => {
            this._groupMap.delete(groupId);
        });
        this._groupMap.set(newGroupId, newGroup);
    }
    // 取消编组
    unGroupMaterials(groupId: string): void {
        const group = this._groupMap.get(groupId);
        if (group) {
            group.forEach((m) => {
                m.groupId = undefined;
            });
            this._groupMap.delete(groupId);
        }
    }
    // 查询分组元素
    queryGroupMaterials(groupId: string): Material<any>[] {
        const group = this._groupMap.get(groupId);
        const res: Material<any>[] = [];
        if (group) {
            group.forEach((m) => res.push(m));
        }
        return res;
    }
    // 获取分组边缘矩形
    getGroupRect(
        groupId: string
    ): { x: number; y: number; w: number; h: number } | undefined {
        const group = this._groupMap.get(groupId);
        if (!group) return;
        let minX: number, maxX: number, minY: number, maxY: number;
        group.forEach(({ x, y, w, h }) => {
            if (minX === undefined) minX = x;
            if (maxX === undefined) maxX = x + w;
            if (minY === undefined) minY = y;
            if (maxY === undefined) maxY = y + h;
            if (x < minX) minX = x;
            if (x + w > maxX) maxX = x + w;
            if (y < minY) minY = y;
            if (y + h > maxY) maxY = y + h;
        });
        return {
            x: minX!,
            y: minY!,
            w: maxY! - minY!,
            h: maxY! - minY!,
        };
    }
    // 调整元素层级
    // 置顶
    bringToFront(id: Material<any>['id']): void {
        const mInstance = this._materialMap.get(id);
        if (!mInstance) return;
        let startZ = mInstance.z;
        const zMap = this.currentZMap;
        while (startZ <= this.materialList.length) {
            const nextInstance = zMap.get(startZ + 1);
            if (nextInstance) {
                nextInstance.z -= 1;
            }
            startZ += 1;
        }
        mInstance.z = this.materialList.length;
    }
    // 上移一层
    bringForward(id: Material<any>['id']): void {
        const mInstance = this._materialMap.get(id);
        if (!mInstance) return;
        const topZ = this.materialList.length;
        if (mInstance.z === topZ) return;
        const newZ = mInstance.z + 1;
        const zMap = this.currentZMap;
        const replaceInstance = zMap.get(newZ);
        if (replaceInstance) {
            replaceInstance.z -= 1;
        }
        mInstance.z = newZ;
    }
    // 下移一层
    sendBackward(id: Material<any>['id']): void {
        const mInstance = this._materialMap.get(id);
        if (!mInstance) return;
        if (mInstance.z === 1) return;
        const newZ = mInstance.z - 1;
        const zMap = this.currentZMap;
        const replaceInstance = zMap.get(newZ);
        if (replaceInstance) {
            replaceInstance.z += 1;
        }
        mInstance.z = newZ;
    }
    // 置底
    sendToBack(id: Material<any>['id']): void {
        const mInstance = this._materialMap.get(id);
        if (!mInstance) return;
        let endZ = mInstance.z;
        const zMap = this.currentZMap;
        while (endZ > 1) {
            const prevInstance = zMap.get(endZ - 1);
            if (prevInstance) {
                prevInstance.z += 1;
            }
            endZ -= 1;
        }
        mInstance.z = 1;
    }
    // 获取选区内的元素
    getSelectRangeMaterial(selection: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): Material<any>[] {
        // 选区的对角坐标
        let [x1, y1, x2, y2] = [
            selection.x,
            selection.y,
            selection.x + selection.w,
            selection.y + selection.h,
        ];
        // w、h可能为负数，转换为原点在左上的坐标
        if (selection.h < 0) {
            y1 = y1 + selection.h;
            y2 = selection.y;
        }
        if (selection.w < 0) {
            x1 = x1 + selection.w;
            x2 = selection.x;
        }

        return this.materialList.filter(({ x, y, w, h }) => {
            // 块与选区有交集视为选中
            // 两矩形不重叠情况取反即为交集
            return !(y + h <= y1 || y >= y2 || x + w <= x1 || x >= x2);
        });
    }
    // 对齐操作
    // 左对齐
    alignHorizontalLeft(ids: Material<any>['id'][]): void {
        const setMinX: (index: number, minX?: number) => number = (
            index,
            minX
        ) => {
            if (index === ids.length) return minX ?? 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMinX(index + 1, minX);
            if (minX === undefined) minX = m.x;
            m.x = setMinX(index + 1, minX > m.x ? m.x : minX);
            return m.x;
        };
        setMinX(0);
    }
    // 水平居中对齐
    alignHorizontalCenter(ids: Material<any>['id'][]): void {
        //
    }
    // 右对齐
    alignHorizontalRight(ids: Material<any>['id'][]): void {
        const setMaxX: (index: number, maxX?: number) => number = (
            index,
            maxX
        ) => {
            if (index === ids.length) return maxX ?? 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMaxX(index + 1, maxX);
            if (maxX === undefined) maxX = m.x + m.w;
            m.x = setMaxX(index + 1, m.x + m.w > maxX ? m.x + m.w : maxX) - m.w;
            return m.x + m.w;
        };
        setMaxX(0);
    }
    // 水平均匀分布
    alignHorizontalDistribute(ids: Material<any>['id'][]): void {
        //
    }
    // 顶对齐
    alignVerticalTop(ids: Material<any>['id'][]): void {
        //
    }
    // 垂直居中对齐
    alignVerticalCenter(ids: Material<any>['id'][]): void {
        //
    }
    // 底对齐
    alignVerticalBottom(ids: Material<any>['id'][]): void {
        //
    }
    // 垂直均匀分布
    alignVerticalDistribute(ids: Material<any>['id'][]): void {
        //
    }
}
