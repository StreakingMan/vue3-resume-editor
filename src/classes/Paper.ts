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
    // z值map
    get zMap(): Map<number, Material<any>> {
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
    removeMaterial(id: string): void {
        const findIdx = this.materialList.findIndex((m) => m.id === id);
        if (findIdx !== -1) {
            // 调整层级，后面的递补
            const zMap = this.zMap;
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
    }
}
