import { uniqueString } from '../utils/uniqueString';

interface MaterialConfig {
    componentName: string;
    [key: string]: any;
}

export interface MaterialOptions {
    x: number;
    y: number;
    w: number;
    h: number;
    groupName?: string;
    config: MaterialConfig;
}

export class Material {
    public readonly id: string;
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public groupName: string | undefined;
    public config: MaterialConfig;

    constructor(options: Partial<MaterialOptions>) {
        this.id = uniqueString();
        const defaultOptions = {
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
