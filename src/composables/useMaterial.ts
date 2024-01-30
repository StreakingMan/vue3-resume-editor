import { inject, type InjectionKey, provide, reactive, type UnwrapNestedRefs } from 'vue';
import type { MaterialBaseConfig, MaterialInjection } from '@/classes/Material';
import { Material } from '@/classes/Material';
import { MaterialNames } from '@/components/materials/config';

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
    return inject(
        materialInjectionKey,
        reactive(
            wrapMaterialWithState(
                new Material<T>({
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                    config: {} as T,
                    componentName: MaterialNames.MText,
                }),
            ),
        ),
    );
}
