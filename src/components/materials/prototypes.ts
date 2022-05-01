import { MaterialOptions } from '../../classes/Material';
import MText from './MText.vue';
import MImage from './MImage.vue';
import MList from './MList.vue';
import {
    CtrlDotFunction,
    CtrlDotType,
    M_DIVIDER_NAME,
    M_IMAGE_NAME,
    M_LIST_NAME,
    M_TEXT_NAME,
    MaterialComponentNameType,
} from './config';
import MDivider from './MDivider.vue';
import { Paper } from '../../classes/Paper';
import { UnwrapNestedRefs } from '@vue/reactivity';

export interface ProtoInfo<T> {
    label: string;
    icon: string;
    dragHandlers: CtrlDotType[] | CtrlDotFunction<T>;
    genInitOptions: (options: {
        x: number;
        y: number;
        paperInstance: UnwrapNestedRefs<Paper>;
    }) => MaterialOptions<T>;
}

export type PrototypeMap = Record<
    MaterialComponentNameType,
    ProtoInfo<any> & { tempStyle: string }
>;

export const prototypeMap: PrototypeMap = {
    [M_TEXT_NAME]: { ...MText.protoInfo, tempStyle: '' },
    [M_IMAGE_NAME]: { ...MImage.protoInfo, tempStyle: '' },
    [M_LIST_NAME]: { ...MList.protoInfo, tempStyle: '' },
    [M_DIVIDER_NAME]: { ...MDivider.protoInfo, tempStyle: '' },
};
