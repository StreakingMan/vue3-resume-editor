import type { InjectionKey, UnwrapNestedRefs } from 'vue';
import { inject, provide, reactive } from 'vue';
import { Paper, PaperMode } from '@/classes/Paper';

export const paperInjectionKey: InjectionKey<UnwrapNestedRefs<Paper>> = Symbol('Paper');
export const paperShowPageNumInjectionKey: InjectionKey<number | null | undefined> =
    Symbol('PaperShowPageNum');
export const paperModeInjectionKey: InjectionKey<PaperMode> = Symbol('PaperMode');

// 与useRuntime类似，这里也是将Paper类包装成响应式对象注入和使用
// 需要修改的地方，主动使用toRef将属性转换为ref
export const createAndInjectReactivePaper = (options?: { initData?: any }) => {
    const paperInstance = reactive(new Paper({}));
    const { initData } = options || {};
    if (initData) paperInstance.loadData(initData);
    provide(paperInjectionKey, paperInstance);
    return paperInstance;
};

export function usePaper(): UnwrapNestedRefs<Paper> {
    return inject(paperInjectionKey, reactive(new Paper({})));
}

export const usePaperMode = () => {
    return inject(paperModeInjectionKey, PaperMode.Edit);
};
