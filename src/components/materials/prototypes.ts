import type { MaterialBaseConfig, MaterialOptions } from '@/classes/Material';
import { type CtrlDotFunction, type CtrlDotType, MaterialNames } from './config';
import { Paper } from '@/classes/Paper';
import { type UnwrapNestedRefs } from 'vue';
import MText from './MText.vue';
import MImage from './MImage.vue';
import MList from './MList.vue';
import MDivider from './MDivider.vue';
import MRect from './MRect.vue';
import MRating from './MRating.vue';
import MIcon from './MIcon.vue';
import MPie from './MPie.vue';
import MTimeline from './MTimeline.vue';

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

export type PrototypeMap = Record<MaterialNames, ProtoInfo<any> & { tempStyle: string }>;

export const prototypeMap: PrototypeMap = {
    [MaterialNames.MText]: { ...MText.protoInfo, tempStyle: '' },
    [MaterialNames.MImage]: { ...MImage.protoInfo, tempStyle: '' },
    [MaterialNames.MList]: { ...MList.protoInfo, tempStyle: '' },
    [MaterialNames.MRating]: { ...MRating.protoInfo, tempStyle: '' },
    [MaterialNames.MIcon]: { ...MIcon.protoInfo, tempStyle: '' },
    [MaterialNames.MDivider]: { ...MDivider.protoInfo, tempStyle: '' },
    [MaterialNames.MRect]: { ...MRect.protoInfo, tempStyle: '' },
    [MaterialNames.MPie]: { ...MPie.protoInfo, tempStyle: '' },
    [MaterialNames.MTimeline]: { ...MTimeline.protoInfo, tempStyle: '' },
};
