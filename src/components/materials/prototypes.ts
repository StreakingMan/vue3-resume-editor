import { Material, MaterialOptions } from '../../classes/Material';
import MText from './MText.vue';
import MImage from './MImage.vue';
import MList from './MList.vue';
import {
    M_IMAGE_NAME,
    M_LIST_NAME,
    M_TEXT_NAME,
    PrototypeComponentName,
} from './config';

export type CtrlDotType = 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml';
export type CtrlDotFunction<T> = (config: T) => CtrlDotType[];

export interface ProtoInfo<T> {
    creator: (options: Partial<MaterialOptions<T>>) => Material<T>;
    dragHandlers: CtrlDotType[] | CtrlDotFunction<T>;
    label: string;
    icon: string;
}

export type PrototypeMap = Record<
    PrototypeComponentName,
    ProtoInfo<{ [key: string]: any }> & { tempStyle: string }
>;

export const prototypeMap: PrototypeMap = {
    [M_TEXT_NAME]: { ...MText.protoInfo, tempStyle: '' },
    [M_IMAGE_NAME]: { ...MImage.protoInfo, tempStyle: '' },
    [M_LIST_NAME]: { ...MList.protoInfo, tempStyle: '' },
};
