import { inject, type InjectionKey, provide, reactive } from 'vue';
import { Runtime } from '@/classes/Runtime';

const runtimeInjectionKey: InjectionKey<Runtime> = Symbol('Runtime');

// 设计思路：
// 因为应用中的大多数地方都是对runtime进行读取，所以直接包装成响应式对象注入和使用
// 需要修改的地方，主动使用toRef将属性转换为ref
export const createAndInjectReactiveRuntime = () => {
    const runtime = reactive(new Runtime());
    provide(runtimeInjectionKey, runtime);
    return runtime;
};

export function useRuntime() {
    return inject(runtimeInjectionKey, reactive(new Runtime()));
}
