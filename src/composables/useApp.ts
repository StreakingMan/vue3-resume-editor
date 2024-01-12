import { inject, reactive, UnwrapNestedRefs } from 'vue';
import { Runtime, runtimeInjectionKey } from '../classes/Runtime';
import { Paper, paperInjectionKey } from '../classes/Paper';
import {
    Material,
    MaterialBaseConfig,
    materialInjectionKey,
} from '../classes/Material';

export function useRuntime(): UnwrapNestedRefs<Runtime> {
    return inject(runtimeInjectionKey, reactive(new Runtime()));
}

export function usePaper(): UnwrapNestedRefs<Paper> {
    return inject(paperInjectionKey, reactive(new Paper({})));
}

export function useMaterial<T extends MaterialBaseConfig>(): UnwrapNestedRefs<{
    instance: Material<T>;
    active: boolean;
    hover: boolean;
    clicked: boolean;
}> {
    return inject(
        materialInjectionKey,
        reactive({
            instance: new Material<T>({
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                config: {} as T,
                componentName: 'MText',
            }),
            active: false,
            hover: false,
            clicked: false,
        }),
    );
}
