import { MaterialBaseConfig, MaterialOptions } from '../../classes/Material';
import {
    CtrlDotFunction,
    CtrlDotType,
    M_DIVIDER_NAME,
    M_ICON_NAME,
    M_IMAGE_NAME,
    M_LIST_NAME,
    M_PIE_NAME,
    M_RATING_NAME,
    M_RECT_NAME,
    M_TEXT_NAME,
    MaterialComponentNameType,
} from './config';
import { Paper } from '../../classes/Paper';
import { UnwrapNestedRefs } from 'vue';
import MText from './MText.vue';
import MImage from './MImage.vue';
import MList from './MList.vue';
import MDivider from './MDivider.vue';
import MRect from './MRect.vue';
import MRating from './MRating.vue';
import MIcon from './MIcon.vue';
import MPie from './MPie.vue';

export interface ProtoInfo<T extends MaterialBaseConfig> {
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
    [M_RATING_NAME]: { ...MRating.protoInfo, tempStyle: '' },
    [M_ICON_NAME]: { ...MIcon.protoInfo, tempStyle: '' },
    [M_DIVIDER_NAME]: { ...MDivider.protoInfo, tempStyle: '' },
    [M_RECT_NAME]: { ...MRect.protoInfo, tempStyle: '' },
    [M_PIE_NAME]: { ...MPie.protoInfo, tempStyle: '' },
};
