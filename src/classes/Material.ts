import { uniqueString } from '../utils/uniqueString';

type MaterialConfig<T> = T & { componentName: string };

export interface MaterialOptions<T> {
    x: number;
    y: number;
    w: number;
    h: number;
    groupName?: string;
    config?: MaterialConfig<T>;
}

export class Material<T> {
    public readonly id: string;
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public groupName: string | undefined;
    public config: MaterialConfig<T>;

    constructor(options: Partial<MaterialOptions<T>>) {
        this.id = uniqueString();
        const defaultOptions: MaterialOptions<any> = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            config: {},
        };

        const { x, y, w, h, groupName, config } = Object.assign(
            defaultOptions,
            options
        );
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.groupName = groupName;
        this.config = config;
    }
}
