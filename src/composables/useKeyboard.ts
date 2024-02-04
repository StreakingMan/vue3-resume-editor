import { useMagicKeys, whenever } from '@vueuse/core';
import type { Runtime } from '@/classes/Runtime';
import type { Paper } from '@/classes/Paper';
import { type Ref, toRefs, type UnwrapNestedRefs } from 'vue';

export const useKeyboard = (options: {
    runtime: UnwrapNestedRefs<Runtime>;
    paperInstance: UnwrapNestedRefs<Paper>;
}) => {
    const { runtime, paperInstance } = options;
    const { copyMaterialSet, activeMaterialSet } = toRefs(runtime);

    // 复制粘贴
    const { ctrl_c, ctrl_v } = useMagicKeys();
    whenever(ctrl_c, () => {
        copyMaterialSet.value = new Set(activeMaterialSet.value);
    });
    whenever(ctrl_v, () => {
        paperInstance.copyMaterial([...copyMaterialSet.value]);
        copyMaterialSet.value.clear();
    });

    // 按del键删除
    const { Delete } = useMagicKeys();
    whenever(Delete, () => {
        paperInstance.removeMaterial([...activeMaterialSet.value]);
    });

    // ctrl+a全选
    const { ctrl_a } = useMagicKeys();
    whenever(ctrl_a, () => {
        for (const m of paperInstance.materialList) {
            activeMaterialSet.value.add(m.id);
        }
    });

    // 方向键移动
    const onLongPress = (fn: () => void, control: Ref<Boolean>) => {
        fn();
        const repeat = () => {
            if (control.value) {
                fn();
                requestAnimationFrame(repeat);
            }
        };
        setTimeout(repeat, 500);
    };
    const moveAllActiveMaterial = (distanceX: number, distanceY: number) => {
        for (const mId of activeMaterialSet.value) {
            const mInstance = paperInstance.queryMaterial(mId);
            if (!mInstance) continue;
            mInstance.x += distanceX;
            mInstance.y += distanceY;
        }
    };
    const { arrowLeft, arrowRight, arrowUp, arrowDown } = useMagicKeys({
        passive: false,
        onEventFired(e) {
            e.preventDefault();
        },
    });
    whenever(arrowLeft, () => {
        onLongPress(() => moveAllActiveMaterial(-paperInstance.cellSize, 0), arrowLeft);
    });
    whenever(arrowRight, () => {
        onLongPress(() => moveAllActiveMaterial(paperInstance.cellSize, 0), arrowRight);
    });
    whenever(arrowUp, () => {
        onLongPress(() => moveAllActiveMaterial(0, -paperInstance.cellSize), arrowUp);
    });
    whenever(arrowDown, () => {
        onLongPress(() => moveAllActiveMaterial(0, paperInstance.cellSize), arrowDown);
    });
};
