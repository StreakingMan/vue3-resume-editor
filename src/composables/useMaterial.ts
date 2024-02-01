import { inject, type InjectionKey, provide, reactive, type UnwrapNestedRefs } from 'vue';
import type { MaterialBaseConfig, MaterialInjection } from '@/classes/Material';
import { Material } from '@/classes/Material';

const materialInjectionKey: InjectionKey<UnwrapNestedRefs<MaterialInjection>> = Symbol('Material');

const wrapMaterialWithState = (material: Material<any>) => {
    return {
        instance: material,
        active: false,
        hover: false,
        clicked: false,
    };
};

// 与runtime, paper类似，这里也是将Material类包装成响应式对象注入和使用
export const createAndInjectReactiveMaterial = (material: Material<any>) => {
    const reactiveMaterial = reactive(wrapMaterialWithState(material));
    provide(materialInjectionKey, reactiveMaterial);
    return reactiveMaterial;
};

export function useMaterial<T extends MaterialBaseConfig>(): UnwrapNestedRefs<{
    instance: Material<T>;
    active: boolean;
    hover: boolean;
    clicked: boolean;
}> {
    const material = inject(materialInjectionKey);
    if (!material) {
        throw new Error('useMaterial must be used after createAndInjectReactiveMaterial');
    }
    return material;
}
