<script lang="ts" setup>
import { computed, inject, ref, toRefs, watch } from 'vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '../../composables/useMouseDragDynamic';
import { CTRL_DOT_SIZE, UNIT_SIZE } from './config';
import { Material } from '@/classes/Material';
import { componentMap, prototypeMap } from '../materials/prototypes';
import { type CtrlDotType } from '../materials/config';
import { useMagicKeys } from '@vueuse/core';
import { PaperMode } from '@/classes/Paper';
import { useRuntime } from '@/composables/useRuntime';
import { paperShowPageNumInjectionKey, usePaper, usePaperMode } from '@/composables/usePaper';
import { createAndInjectReactiveMaterial } from '@/composables/useMaterial';

const styleMap: Record<CtrlDotType, string> = {
    tl: `top: 0px;left: 0px;cursor: nw-resize;transform-origin: top left;`,
    tm: `top: 0px;left: 50%;margin-left: -${
        CTRL_DOT_SIZE / 2
    }px;cursor: n-resize;transform-origin: top center;`,
    tr: `top: 0px;right: 0px;cursor: ne-resize;transform-origin: top right;`,
    mr: `top: 50%;margin-top: -${
        CTRL_DOT_SIZE / 2
    }px;right: 0px;cursor: e-resize;transform-origin: center right;`,
    br: `bottom: 0px;right: 0px;cursor: se-resize;transform-origin: bottom right;`,
    bm: `bottom: 0px;left: 50%;margin-left: -${
        CTRL_DOT_SIZE / 2
    }px;cursor: s-resize;transform-origin: bottom center;`,
    bl: `bottom: 0px;left: 0px;cursor: sw-resize;transform-origin: bottom left;`,
    ml: `top: 50%;margin-top: -${
        CTRL_DOT_SIZE / 2
    }px;left: 0px;cursor: w-resize;transform-origin: center left;`,
};

const props = defineProps<{
    item: Material<any>;
}>();

const runtime = useRuntime();
const paper = usePaper();
const material = createAndInjectReactiveMaterial(props.item);
const { hover, active, clicked, instance } = toRefs(material);
const { scale, activeMaterialSet } = toRefs(runtime);

const { space, shift } = useMagicKeys();

watch(active, (v) => {
    if (v) clicked.value = false;
});
watch(
    () => [...activeMaterialSet.value],
    () => {
        active.value = activeMaterialSet.value.has(material.instance.id);
    },
);

const focus = (e: MouseEvent) => {
    clicked.value = true;
    // 没按空格时阻止冒泡
    if (!space.value) e.stopPropagation();

    if (shift.value) {
        // 按住shift点击元素则切换选中状态
        if (!activeMaterialSet.value.delete(material.instance.id)) {
            activeMaterialSet.value.add(material.instance.id);
        }
    } else {
        // 否则重置为该元素
        activeMaterialSet.value.clear();
        activeMaterialSet.value.add(material.instance.id);
    }
};

// 位置信息缓存
const posInfoCache = {
    itemStartX: 0,
    itemStartY: 0,
    itemStartW: 0,
    itemStartH: 0,
};

// 缩放控制点
const clickingDot = ref<CtrlDotType | null>(null);
const { onMousedown: onDotMousedown } = useMouseDragDynamic({
    onStart() {
        if (!(material.active || material.hover)) return;
        const { x, y, w, h } = material.instance;
        posInfoCache.itemStartX = x;
        posInfoCache.itemStartY = y;
        posInfoCache.itemStartW = w;
        posInfoCache.itemStartH = h;
    },
    onDrag({ transX, transY }: MouseEvtInfo) {
        if (!clickingDot.value) return;

        const { itemStartX, itemStartY, itemStartH, itemStartW } = posInfoCache;

        let newX = itemStartX,
            newY = itemStartY,
            newW = itemStartW,
            newH = itemStartH;

        if (clickingDot.value.includes('b')) {
            newH = itemStartH + transY / runtime.scale.value;
        } else if (clickingDot.value.includes('t')) {
            newY = itemStartY + transY / runtime.scale.value;
            newH = itemStartH - transY / runtime.scale.value;
        }

        if (clickingDot.value.includes('r')) {
            newW = itemStartW + transX / runtime.scale.value;
        } else if (clickingDot.value.includes('l')) {
            newX = itemStartX + transX / runtime.scale.value;
            newW = itemStartW - transX / runtime.scale.value;
        }

        if (newH < UNIT_SIZE) newH = UNIT_SIZE;
        if (newW < UNIT_SIZE) newW = UNIT_SIZE;
        if (newX + UNIT_SIZE > itemStartX + itemStartW) {
            newX = itemStartX + itemStartW - UNIT_SIZE;
        }
        if (newY + UNIT_SIZE > itemStartY + itemStartH) {
            newY = itemStartY + itemStartH - UNIT_SIZE;
        }

        material.instance.x = newX;
        material.instance.y = newY;
        material.instance.w = newW;
        material.instance.h = newH;
    },
    onFinish() {
        clickingDot.value = null;
        posInfoCache.itemStartX = 0;
        posInfoCache.itemStartY = 0;
        posInfoCache.itemStartW = 0;
        posInfoCache.itemStartH = 0;
    },
});

// 可用控制点
const ableCtrlDots = computed(() => {
    const dragHandlers = prototypeMap[material.instance.componentName].dragHandlers;
    if (dragHandlers instanceof Function) {
        return dragHandlers(material.instance.config);
    } else {
        return dragHandlers;
    }
});

const removeMaterialInstance = () => {
    paper.removeMaterial(material.instance.id);
};

const isEdit = usePaperMode() === PaperMode.Edit;

const showPageNum = inject(paperShowPageNumInjectionKey, undefined);
const realY = computed(() => {
    if (showPageNum) {
        return instance.value.y - (showPageNum - 1) * paper.h;
    } else {
        return instance.value.y;
    }
});
</script>

<template>
    <div
        :key="instance.id"
        class="material-instance"
        :style="{
            backgroundColor: hover || active ? 'rgba(128,128,128,0.2)' : '',
            left: instance.x + 'px',
            top: realY + 'px',
            zIndex: active ? paper.materialList.length + 1 : instance.z,
            width: instance.w + 'px',
            height: instance.h + 'px',
        }"
        @mouseenter.prevent.stop="hover = true"
        @mouseleave.prevent.stop="hover = false"
        @mousedown="focus"
    >
        <div
            class="w-100 h-100 material-inner"
            :style="{
                padding: instance.config.padding + 'px',
                borderStyle: instance.config.borderStyle,
                borderWidth: instance.config.borderWidth + 'px',
                borderColor: instance.config.borderColor,
                borderRadius: instance.config.borderRadius + 'px',
                backgroundColor: instance.config.backgroundColor,
            }"
        >
            <component :is="componentMap[instance.componentName]">
                <template v-if="isEdit" #activator>
                    <!-- 复制 -->
                    <v-btn @mousedown.stop="() => paper.copyMaterial(instance.id)">
                        <v-icon>mdi-content-copy</v-icon>
                    </v-btn>

                    <!-- 层级 -->
                    <v-btn title="层级调整" @mousedown.stop>
                        <v-icon>mdi-layers-triple</v-icon>
                        <v-menu activator="parent" location="bottom">
                            <v-list density="compact">
                                <v-list-item
                                    v-for="({ icon, text, onClick }, i) in [
                                        {
                                            icon: 'mdi-arrange-bring-to-front',
                                            text: '置于顶层',
                                            onClick: () => paper.bringToFront(instance.id),
                                        },
                                        {
                                            icon: 'mdi-arrange-bring-forward',
                                            text: '上移一层',
                                            onClick: () => paper.bringForward(instance.id),
                                        },
                                        {
                                            icon: 'mdi-arrange-send-backward',
                                            text: '下移一层',
                                            onClick: () => paper.sendBackward(instance.id),
                                        },
                                        {
                                            icon: 'mdi-arrange-send-to-back',
                                            text: '置于底层',
                                            onClick: () => paper.sendToBack(instance.id),
                                        },
                                    ]"
                                    :key="i"
                                    height="30"
                                    :value="i"
                                    color="primary"
                                    class="pl-0"
                                    @click="onClick"
                                >
                                    <template #prepend>
                                        <v-avatar>
                                            <v-icon :icon="icon" size="small"></v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-subtitle v-text="text"></v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>

                    <!-- 删除 -->
                    <v-btn class="text-error" @mousedown.stop @click="removeMaterialInstance">
                        <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                </template>
            </component>
        </div>

        <template v-if="isEdit">
            <div
                v-for="dot in ableCtrlDots"
                :key="dot"
                :style="[
                    `transform: scale(${1 / scale.value});${styleMap[dot]}`,
                    {
                        opacity: (clickingDot && clickingDot !== dot) || !(active || hover) ? 0 : 1,
                        width: CTRL_DOT_SIZE + 'px',
                        height: CTRL_DOT_SIZE + 'px',
                    },
                ]"
                class="control-dot bg-primary"
                @mousedown.stop.prevent="(clickingDot = dot) && onDotMousedown($event)"
            ></div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.material-instance {
    position: absolute;
    box-sizing: content-box;
    user-select: none;
    transition: border-color 0.3s;

    .control-dot {
        box-sizing: border-box;
        position: absolute;
        transition:
            background-color 0.5s,
            opacity 0.5s;
        z-index: 2;
    }
}

.material-inner {
    box-sizing: border-box;
    overflow: hidden;
}
</style>
