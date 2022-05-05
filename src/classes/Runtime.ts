import useKeyboardStatus from '../composables/useKeyboardStatus';
import { InjectionKey, reactive, ref } from 'vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Material } from './Material';

export const runtimeInjectionKey: InjectionKey<
    UnwrapNestedRefs<Runtime>
> = Symbol('Runtime');

// App类主要维护运行时的东西
export class Runtime {
    // 抽屉
    public drawer = ref(true);
    // 键盘状态
    public keyboardStatus = useKeyboardStatus();
    // 辅助网格显示
    public showGrid = ref(true);
    // 缩放值和缩放中心
    public scale = reactive({
        value: 1,
        position: { x: 0, y: 0 },
    });
    // 激活元素集合
    public activeMaterialSet = ref<Set<Material<any>['id']>>(new Set());
    // 提示条
    public snackbar = reactive({
        show: false,
        text: '',
    });
    // Sketch组件信息
    public sketch = reactive({
        wrapperDiv: ref<HTMLDivElement | null>(null),
        paddingX: 0,
        paddingY: 0,
    });
}
