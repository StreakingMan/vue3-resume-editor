import { inject, type InjectionKey, provide, reactive } from 'vue';
import { Runtime } from '@/classes/Runtime';

const runtimeInjectionKey: InjectionKey<Runtime> = Symbol('Runtime');
export const createAndInjectReactiveRuntime = () => {
    const runtime = reactive(new Runtime());
    provide(runtimeInjectionKey, runtime);
    return runtime;
};

export function useRuntime() {
    return inject(runtimeInjectionKey, reactive(new Runtime()));
}
