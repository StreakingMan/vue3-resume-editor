import { Material, MaterialOptions } from './Material';

const paperSizeMap = {
    a4: {
        w: 620,
        h: 877,
    },
};

export interface PaperOptions {
    size?: 'a4';
    cellSize?: number;
}

export class Paper {
    public readonly w: number;
    public readonly h: number;
    public background = 'white';
    public materialList: Material<any>[] = [];
    private _materialMap: Map<Material<any>['id'], Material<any>>;
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
        if (cellSize) this.cellSize = cellSize;
    }
    addMaterial(materialOptions: MaterialOptions<any>): Material<any>[] {
        const materialInstance = new Material({
            ...materialOptions,
            z: this.materialList.length + 1,
            cellSize: this.cellSize,
        });
        this.materialList.push(materialInstance);
        this._materialMap.set(materialInstance.id, materialInstance);
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
        const [x1, y1, x2, y2] = [
            selection.x,
            selection.y,
            selection.x + selection.w,
            selection.y + selection.h,
        ];
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
        const setCenterX: (
            index: number,
            maxX?: number,
            minX?: number
        ) => number = (index, maxX, minX) => {
            if (index === ids.length) {
                if (maxX && minX) {
                    return (maxX + minX) / 2;
                }

                return 0;
            }

            const m = this._materialMap.get(ids[index]);

            if (!m) {
                return setCenterX(index + 1, maxX, minX);
            }

            if (!maxX) {
                maxX = m.x;
            }

            if (!minX) {
                minX = m.x;
            }

            m.x = setCenterX(
                index + 1,
                minX > m.x ? m.x : minX,
                maxX > m.x ? maxX : m.x
            );
            return m.x;
        };

        setCenterX(0);
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
        if (ids.length < 2) {
            return
        }

        let maxX = Number.MIN_SAFE_INTEGER, minX = Number.MAX_SAFE_INTEGER

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            maxX = m.x > maxX ? m.x : maxX
            minX = m.x > minX ? minX : m.x
        }

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            m.x = minX + (maxX - minX) / (ids.length - 1) * i
        }
    }
    // 顶对齐
    alignVerticalTop(ids: Material<any>['id'][]): void {
        const setMinY: (index: number, minY?: number) => number = (
            index,
            minY
        ) => {
            if (index === ids.length) return minY || 0;
            const m = this._materialMap.get(ids[index]);
            if (!m) return setMinY(index + 1, minY);
            if (minY === undefined) minY = m.y;
            m.y = setMinY(index + 1, minY > m.y ? m.y : minY);
            return m.y;
        };
        setMinY(0);
    }
    // 垂直居中对齐
    alignVerticalCenter(ids: Material<any>['id'][]): void {
        if (ids.length < 2) {
            return
        }

        let maxY = Number.MIN_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            maxY = m.y > maxY ? m.y : maxY
            minY = m.y > minY ? minY : m.y
        }

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            m.y = (maxY + minY) / 2
        }
    }
    // 底对齐
    alignVerticalBottom(ids: Material<any>['id'][]): void {
        if (!ids.length) {
            return;
        }

        let maxY = this._materialMap.get(ids[0])?.y || 0;

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue;
            }

            maxY = m.y > maxY ? m.y : maxY;
        }


        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            m.y = maxY
        }
    }
    // 垂直均匀分布
    alignVerticalDistribute(ids: Material<any>['id'][]): void {
        if (ids.length < 2) {
            return
        }

        let maxY = Number.MIN_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            maxY = m.y > maxY ? m.y : maxY
            minY = m.y > minY ? minY : m.y
        }

        for (let i = 0; i < ids.length; i++) {
            const m = this._materialMap.get(ids[i]);

            if (!m) {
                continue
            }

            m.y = minY + (maxY - minY) / (ids.length - 1) * i
        }
    }
}
