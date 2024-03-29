import { uniqueString } from '@/utils/uniqueString';
import { calcCellingValue } from '@/utils/calcCellingValue';
import { MaterialNames } from '@/components/materials/config';

export interface MaterialBaseConfig {
    padding?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    backgroundColor?: string;
}

export interface MaterialOptions<T extends MaterialBaseConfig> {
    componentName: MaterialNames;
    _id?: string;
    _freePosition?: boolean;
    _freeSize?: boolean;
    x: number;
    y: number;
    z?: number;
    w: number;
    h: number;
    config: T;
    groupId?: string;
    cellSize?: number;
}

export class Material<T extends MaterialBaseConfig> {
    private readonly _id: string;
    get id(): string {
        return this._id;
    }
    public readonly componentName: MaterialNames;
    public groupId?: string;
    public config: T;
    public cellSize = 10; // 网格尺寸
    public z: number;
    private readonly _freePosition?: boolean; // 不受网格系统束缚
    private readonly _freeSize?: boolean; // 不受网格系统束缚

    private _x = 0;
    get x(): number {
        return this._x;
    }
    set x(value: number) {
        this._x = this._freePosition ? value : calcCellingValue(value, this.cellSize);
    }

    private _y = 0;
    get y(): number {
        return this._y;
    }
    set y(value: number) {
        this._y = this._freePosition ? value : calcCellingValue(value, this.cellSize);
    }

    private _w = 100;
    get w(): number {
        return this._w;
    }
    set w(value: number) {
        this._w = this._freeSize ? value : calcCellingValue(value, this.cellSize, true);
    }

    private _h = 100;
    get h(): number {
        return this._h;
    }
    set h(value: number) {
        // 内容需要可能需要固定长宽比，仅对宽度做单元格落点控制，高度不做控制
        this._h = Math.round(value);
    }

    constructor(options: MaterialOptions<T>) {
        const {
            componentName,
            _id,
            _freePosition,
            _freeSize,
            x,
            y,
            z,
            w,
            h,
            groupId,
            config,
            cellSize,
        } = options;
        if (_id) {
            this._id = _id;
        } else {
            this._id = uniqueString();
        }
        this._freePosition = _freePosition;
        this._freeSize = _freeSize;
        if (cellSize) this.cellSize = cellSize;
        this.componentName = componentName;
        this.config = config;
        this.groupId = groupId;
        this.x = x;
        this.y = y;
        this.z = z || 1;
        this.w = w;
        this.h = h;
    }

    // 中心旋转
    centerRotate(): void {
        const [centerX, centerY] = [this.x + this.w / 2, this.y + this.h / 2];
        const newX = centerX - this.h / 2;
        const newY = centerY - this.w / 2;
        const [newW, newH] = [this.h, this.w];
        this.x = newX < 0 ? 0 : newX;
        this.y = newY < 0 ? 0 : newY;
        this.w = newW;
        this.h = newH;
    }
}
