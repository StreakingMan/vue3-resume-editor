import { Material, MaterialOptions } from '../../classes/Material';
import MTitle from './MTitle.vue';
import MText from './MText.vue';
import MImage from './MImage.vue';
import MList from './MList.vue';

const prototypeMap = new Map();

export interface ProtoInfo {
    creator: (options: Partial<MaterialOptions>) => Material;
    label: string;
    icon: string;
    configOptions?: Record<string, string | number>;
}

interface MaterialComponent extends Record<any, any> {
    name?: string;
    protoInfo?: ProtoInfo;
}

const appendPrototype = ({ name, protoInfo }: MaterialComponent) => {
    if (!name || !protoInfo) return;
    const { creator, label, icon, configOptions } = protoInfo;
    prototypeMap.set(name, {
        label,
        icon,
        tempStyle: '',
        creator,
        configOptions,
    });
};

appendPrototype(MTitle);
appendPrototype(MText);
appendPrototype(MImage);
appendPrototype(MList);

export default Object.fromEntries(prototypeMap.entries());