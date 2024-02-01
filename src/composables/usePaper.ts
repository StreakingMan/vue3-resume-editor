import type { InjectionKey, UnwrapNestedRefs } from 'vue';
import { inject, provide, reactive } from 'vue';
import { Paper, PaperMode } from '@/classes/Paper';

// 与useRuntime类似，这里也是将Paper类包装成响应式对象注入和使用
// 需要修改的地方，主动使用toRef将属性转换为ref
const paperInjectionKey: InjectionKey<UnwrapNestedRefs<Paper>> = Symbol('Paper');
export const createAndProvideReactivePaper = (options?: { initData?: any }) => {
    const paperInstance = reactive(new Paper({}));
    const { initData } = options || {};
    if (initData) paperInstance.loadData(initData);
    provide(paperInjectionKey, paperInstance);
    return paperInstance;
};
export function usePaper() {
    const paper = inject(paperInjectionKey);
    if (!paper) {
        throw new Error('usePaper must be used after createAndInjectReactivePaper');
    }
    return paper;
}

// paperMode设计为不可变的，不在PaperMode中维护，封装单独的方法供不同场景使用
const paperModeInjectionKey: InjectionKey<PaperMode> = Symbol('PaperMode');
export function usePaperMode(): PaperMode;
export function usePaperMode(mode: PaperMode): void;
export function usePaperMode(mode?: PaperMode) {
    if (!mode) {
        const _mode = inject(paperModeInjectionKey);
        if (!_mode) {
            throw new Error('usePaperMode() must be used after usePaperMode(mode)');
        }
        return _mode;
    }
    provide(paperModeInjectionKey, mode);
}

// 只显示某一页，用于预览和导航器
// 设计为不可变的，不在Paper中维护，在场景中单独维护
const paperShowPageNumInjectionKey: InjectionKey<number | undefined> = Symbol('PaperShowPageNum');
export function userPaperShowPageNum(): number | undefined;
export function userPaperShowPageNum(pageNum: number): void;
export function userPaperShowPageNum(pageNum?: number) {
    if (!pageNum) {
        return inject(paperShowPageNumInjectionKey, undefined);
    }
    provide(paperShowPageNumInjectionKey, pageNum);
}
