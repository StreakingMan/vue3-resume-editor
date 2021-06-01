import { Material, MaterialOptions } from './Material';

const paperSizeMap = {
    a4: {
        w: 620,
        h: 877,
    },
};

export interface PaperOptions {
    size: 'a4';
}

export class Paper {
    public readonly w: number;
    public readonly h: number;
    public materialList: Material[] = [];
    private materialMap: Map<string, Material>;
    constructor(options: Partial<PaperOptions>) {
        const defaultOptions = {
            size: 'a4',
        };
        const { size } = Object.assign(defaultOptions, options);
        const { w, h } = paperSizeMap[size];
        this.w = w;
        this.h = h;
        this.materialMap = new Map();
    }
    addMaterial(options: Partial<MaterialOptions>): Material[] {
        const newMaterial = new Material(options);
        this.materialList.push(newMaterial);
        this.materialMap.set(newMaterial.id, newMaterial);
        return this.materialList;
    }
    removeMaterial(id: string): boolean {
        const findIdx = this.materialList.findIndex((m) => m.id === id);
        if (findIdx) {
            this.materialList.splice(findIdx, 1);
            this.materialMap.delete(id);
        }
        return findIdx !== -1;
    }
}
