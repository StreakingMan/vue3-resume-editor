import { Material, MaterialOptions } from './Material';
import { uniqueString } from '@/utils/uniqueString';
import { InjectionKey, UnwrapNestedRefs } from 'vue';
import { easeInOut } from '@/utils/timeFunction';

const LOCAL_STORAGE_KEY = 'paper_cache';

const a4Ratio = 210 / 297;

export const paperSizeMap = {
    a4: {
        w: 793,
        h: 793 / a4Ratio,
    },
};

export const paperInjectionKey: InjectionKey<UnwrapNestedRefs<Paper>> =
    Symbol('Paper');

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
    loadFromStorage(): boolean {
        const jsonString = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!jsonString) return false;
        const data = JSON.parse(jsonString);
        this.loadData(data);
        return true;
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
            this.addMaterialFromJSON(m);
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
    addMaterialFromJSON(m: any): void {
        this.addMaterial({
            componentName: m.componentName,
            _id: m._id,
            _freePosition: m._freePosition,
            _freeSize: m._freeSize,
            x: m._x,
            y: m._y,
            z: m.z,
            w: m._w,
            h: m._h,
            cellSize: m.cellSize,
            config: m.config,
            groupId: m.groupId,
        });
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
    copyMaterial(idOrIds: Material<any>['id'] | Material<any>['id'][]): void {
        const addFunc: (id: Material<any>['id']) => void = (id) => {
            const m = this._materialMap.get(id);
            if (!m) return;
            const copy = JSON.parse(JSON.stringify(m));
            let offset = copy._h;
            if (copy.groupId) {
                offset = this.getGroupRect(copy.groupId)?.h || copy._h;
            }
            delete copy._id;
            delete copy.z;
            delete copy.groupId;
            copy._y = copy._y + offset;
            this.addMaterialFromJSON(copy);
        };
        if (Array.isArray(idOrIds)) {
            for (const id of idOrIds) {
                addFunc(id);
            }
        } else {
            addFunc(idOrIds);
        }
    }
    removeMaterial(idOrIds: Material<any>['id'] | Material<any>['id'][]): void {
        const deleteFunc: (id: Material<any>['id']) => void = (id) => {
            const findIdx = this.materialList.findIndex((m) => m.id === id);
            if (findIdx !== -1) {
                // 删除分组缓存
                const groupId = this._materialMap.get(id)!.groupId;
                if (this._groupMap.has(groupId)) {
                    const mSet = this._groupMap.get(groupId);
                    if (mSet) {
                        mSet.delete(id);
                        if (mSet.size < 2) {
                            const mlist = this.queryGroupMaterials(groupId!);
                            this._groupMap.delete(groupId);
                            mlist.forEach((m) => (m.groupId = undefined));
                        }
                    }
                }

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
    clear(): void {
        this.materialList = [];
        this._groupMap.clear();
        this._materialMap.clear();
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
        groupId: string,
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
            w: maxX! - minX!,
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
            minX,
        ) => {
            if (index === ids.length) return minX ?? 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMinX(index + 1, minX);
            if (minX === undefined) minX = m.x;
            const _minX = setMinX(index + 1, minX > m.x ? m.x : minX);
            easeInOut({
                start: m.x,
                end: _minX,
                callback: (value) => {
                    m.x = value;
                },
            });
            return _minX;
        };
        setMinX(0);
    }
    // 水平居中对齐
    alignHorizontalCenter(ids: Material<any>['id'][]): void {
        if (ids.length < 2) {
            return;
        }

        let maxX = Number.MIN_SAFE_INTEGER,
            minX = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue;
            }

            maxX = m.x + m.w > maxX ? m.x + m.w : maxX;
            minX = m.x > minX ? minX : m.x;
        }

        const centerX = (maxX + minX) / 2;

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue;
            }

            easeInOut({
                start: m.x,
                end: centerX - m.w / 2,
                callback: (value) => {
                    m.x = value;
                },
            });
        }
    }
    // 右对齐
    alignHorizontalRight(ids: Material<any>['id'][]): void {
        const setMaxX: (index: number, maxX?: number) => number = (
            index,
            maxX,
        ) => {
            if (index === ids.length) return maxX ?? 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMaxX(index + 1, maxX);
            if (maxX === undefined) maxX = m.x + m.w;
            const _maxX =
                setMaxX(index + 1, m.x + m.w > maxX ? m.x + m.w : maxX) - m.w;
            easeInOut({
                start: m.x,
                end: _maxX,
                callback: (value) => {
                    m.x = value;
                },
            });
            return _maxX + m.w;
        };
        setMaxX(0);
    }
    // 水平均匀分布
    alignHorizontalDistribute(ids: Material<any>['id'][]): void {
        if (ids.length < 2) {
            return;
        }

        let maxX = Number.MIN_SAFE_INTEGER,
            minX = Number.MAX_SAFE_INTEGER;

        const _ids = this.sortIdsByPosition(ids, 'x');

        for (let i = 0; i < _ids.length; i++) {
            const m = this._materialMap.get(_ids[i]);

            if (!m) {
                continue;
            }

            maxX = m.x > maxX ? m.x : maxX;
            minX = m.x > minX ? minX : m.x;
        }

        for (let i = 0; i < _ids.length; i++) {
            const m = this._materialMap.get(_ids[i]);

            if (!m) {
                continue;
            }

            const _x = minX + ((maxX - minX) / (_ids.length - 1)) * i;
            easeInOut({
                start: m.x,
                end: _x,
                callback: (value) => {
                    m.x = value;
                },
            });
        }
    }
    // 顶对齐
    alignVerticalTop(ids: Material<any>['id'][]): void {
        const setMinY: (index: number, minY?: number) => number = (
            index,
            minY,
        ) => {
            if (index === ids.length) return minY || 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMinY(index + 1, minY);
            if (minY === undefined) minY = m.y;
            const _minY = setMinY(index + 1, minY > m.y ? m.y : minY);
            easeInOut({
                start: m.y,
                end: _minY,
                callback: (value) => {
                    m.y = value;
                },
            });
            return _minY;
        };
        setMinY(0);
    }
    // 垂直居中对齐
    alignVerticalCenter(ids: Material<any>['id'][]): void {
        if (ids.length < 2) {
            return;
        }

        let maxY = Number.MIN_SAFE_INTEGER,
            minY = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue;
            }

            maxY = m.y + m.h > maxY ? m.y + m.h : maxY;
            minY = m.y > minY ? minY : m.y;
        }

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue;
            }

            const _y = (maxY + minY) / 2 - m.h / 2;
            easeInOut({
                start: m.y,
                end: _y,
                callback: (value) => {
                    m.y = value;
                },
            });
        }
    }
    // 底对齐
    alignVerticalBottom(ids: Material<any>['id'][]): void {
        const setMaxY: (index: number, maxX?: number) => number = (
            index,
            maxY,
        ) => {
            if (index === ids.length) return maxY ?? 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMaxY(index + 1, maxY);
            if (maxY === undefined) maxY = m.y + m.h;
            const _maxY =
                setMaxY(index + 1, m.y + m.h > maxY ? m.y + m.h : maxY) - m.h;
            easeInOut({
                start: m.y,
                end: _maxY,
                callback: (value) => {
                    m.y = value;
                },
            });
            return _maxY + m.h;
        };
        setMaxY(0);
    }
    // 垂直均匀分布
    alignVerticalDistribute(ids: Material<any>['id'][]): void {
        if (ids.length < 2) {
            return;
        }

        let maxY = Number.MIN_SAFE_INTEGER,
            minY = Number.MAX_SAFE_INTEGER;

        const _ids = this.sortIdsByPosition(ids, 'y');
        for (let i = 0; i < _ids.length; i++) {
            const m = this._materialMap.get(_ids[i]);

            if (!m) {
                continue;
            }

            maxY = m.y > maxY ? m.y : maxY;
            minY = m.y > minY ? minY : m.y;
        }

        for (let i = 0; i < _ids.length; i++) {
            const m = this._materialMap.get(_ids[i]);

            if (!m) {
                continue;
            }

            const _y = minY + ((maxY - minY) / (_ids.length - 1)) * i;
            easeInOut({
                start: m.y,
                end: _y,
                callback: (value) => {
                    m.y = value;
                },
            });
        }
    }

    // 仅对ids涉及的material按横/纵坐标排序
    sortIdsByPosition(
        ids: Material<any>['id'][],
        type: 'x' | 'y',
    ): Material<any>['id'][] {
        if (ids.length < 2) return ids.slice();
        return ids.slice().sort((id1, id2) => {
            const mA = this.queryMaterial(id1);
            const mB = this.queryMaterial(id2);
            if (mA && mB) {
                if (mA[type] > mB[type]) return 1;
                if (mA[type] === mB[type]) return 0;
            }
            return -1;
        });
    }
}
