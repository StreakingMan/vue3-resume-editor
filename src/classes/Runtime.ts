import { type InjectionKey, reactive, ref, type UnwrapNestedRefs } from 'vue';
import { Material } from './Material';

export const runtimeInjectionKey: InjectionKey<UnwrapNestedRefs<Runtime>> = Symbol('Runtime');

// App类主要维护运行时的东西
export class Runtime {
    // 抽屉
    public leftDrawer = ref(true);
    public bottomDrawer = ref(false);
    // 辅助网格显示
    public showGrid = ref(true);
    // 缩放值相关
    public scale = reactive({
        // 实时缩放值
        value: 1,
        // 在进行缩放操作时，记录缩放前的一些信息
        cache: {
            // 缩放中标记
            scaling: false,
            // 鼠标相对于画布的百分比
            mousePaperPercent: { x: 0, y: 0 },
            // 鼠标位置
            mousePosition: { x: 0, y: 0 },
            // 容器滚动位置
            containerScroll: { left: 0, top: 0 },
        },
    });
    // 激活元素集合
    public activeMaterialSet = ref<Set<Material<any>['id']>>(new Set());
    // 复制标记，按ctrlC时将激活列表复制一份
    public copyMaterialSet = ref<Set<Material<any>['id']>>(new Set());
    // 提示条
    public snackbar = reactive({
        show: false,
        text: '',
    });
    // Sketch组件信息
    public sketch = reactive({});
    // Paper组件信息
    public paper = reactive({
        hoveringDeletePageNum: null as null | number,
        bounds: { x: 0, y: 0, width: 0, height: 0 },
    });
}
