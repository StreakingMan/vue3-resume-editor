import { MaterialBaseConfig, MaterialOptions } from '@/classes/Material';
import { CtrlDotFunction, CtrlDotType, MaterialComponentNames } from './config';
import { Paper } from '@/classes/Paper';
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
    MaterialComponentNames,
    ProtoInfo<any> & { tempStyle: string }
>;

export const prototypeMap: PrototypeMap = {
    [MaterialComponentNames.MText]: { ...MText.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MImage]: { ...MImage.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MList]: { ...MList.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MRating]: { ...MRating.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MIcon]: { ...MIcon.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MDivider]: { ...MDivider.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MRect]: { ...MRect.protoInfo, tempStyle: '' },
    [MaterialComponentNames.MPie]: { ...MPie.protoInfo, tempStyle: '' },
};
