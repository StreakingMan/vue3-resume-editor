<template>
    <div
        :key="instance.id"
        class="material-instance"
        :style="{
            backgroundColor: hover || active ? 'rgba(128,128,128,0.2)' : '',
            left: instance.x + 'px',
            top: instance.y + 'px',
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
            <component :is="instance.componentName">
                <template #activator>
                    <!-- 复制 -->
                    <v-btn
                        variant="outlined"
                        color="primary"
                        size="x-small"
                        icon
                        class="border-r-0"
                        :rounded="0"
                        @mousedown.stop="() => paper.copyMaterial(instance.id)"
                    >
                        <v-icon size="x-small">mdi-content-copy</v-icon>
                        <v-tooltip activator="parent" anchor="top">
                            复制
                        </v-tooltip>
                    </v-btn>

                    <!-- 层级 -->
                    <v-btn
                        variant="outlined"
                        color="primary"
                        size="x-small"
                        icon
                        class="border-r-0"
                        :rounded="0"
                        title="层级调整"
                        @mousedown.stop
                    >
                        <v-icon size="x-small">mdi-layers-triple</v-icon>
                        <v-tooltip activator="parent" anchor="top">
                            层级调整
                        </v-tooltip>
                        <v-menu activator="parent" anchor="bottom">
                            <v-list density="compact">
                                <v-list-item
                                    v-for="({ icon, text, onClick }, i) in [
                                        {
                                            icon: 'mdi-arrange-bring-to-front',
                                            text: '置于顶层',
                                            onClick: () =>
                                                paper.bringToFront(instance.id),
                                        },
                                        {
                                            icon: 'mdi-arrange-bring-forward',
                                            text: '上移一层',
                                            onClick: () =>
                                                paper.bringForward(instance.id),
                                        },
                                        {
                                            icon: 'mdi-arrange-send-backward',
                                            text: '下移一层',
                                            onClick: () =>
                                                paper.sendBackward(instance.id),
                                        },
                                        {
                                            icon: 'mdi-arrange-send-to-back',
                                            text: '置于底层',
                                            onClick: () =>
                                                paper.sendToBack(instance.id),
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
                                            <v-icon
                                                :icon="icon"
                                                size="small"
                                            ></v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-subtitle
                                        v-text="text"
                                    ></v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>

                    <!-- 删除 -->
                    <v-btn
                        variant="outlined"
                        color="error"
                        size="x-small"
                        icon
                        class="border-r-0"
                        :rounded="0"
                        title="双击删除"
                        @mousedown.stop
                        @dblclick="removeMaterialInstance"
                    >
                        <v-icon size="x-small">mdi-trash-can</v-icon>
                        <v-tooltip activator="parent" anchor="top">
                            双击删除
                        </v-tooltip>
                    </v-btn>
                </template>
            </component>
        </div>

        <div
            v-for="dot in ableCtrlDots"
            :key="dot"
            :style="[
                `transform: scale(${1 / scale});${styleMap[dot]}`,
                {
                    opacity:
                        (clickingDot && clickingDot !== dot) ||
                        !(active || hover)
                            ? 0
                            : 1,
                    width: CTRL_DOT_SIZE + 'px',
                    height: CTRL_DOT_SIZE + 'px',
                },
            ]"
            class="control-dot bg-primary"
            @mousedown.stop.prevent="
                (clickingDot = dot) && onDotMousedown($event)
            "
        ></div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    PropType,
    provide,
    reactive,
    ref,
    toRef,
    watch,
} from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import MImage from '../materials/MImage.vue';
import MList from '../materials/MList.vue';
import MText from '../materials/MText.vue';
import { CTRL_DOT_SIZE, UNIT_SIZE } from './config';
import MaterialConfig from './MaterialConfigPopover.vue';
import { prototypeMap } from '../materials/prototypes';
import { CtrlDotType } from '../materials/config';
import { Material, materialInjectionKey } from '../../classes/Material';
import MDivider from '../materials/MDivider.vue';
import { usePaper, useRuntime } from '../../composables/useApp';
import MRect from '../materials/MRect.vue';
import MRating from '../materials/MRating.vue';
import MIcon from '../materials/MIcon.vue';

const ctrlDots: CtrlDotType[] = [
    'tl',
    'tm',
    'tr',
    'mr',
    'br',
    'bm',
    'bl',
    'ml',
];
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

export default defineComponent({
    name: 'MaterialInstance',
    components: {
        MIcon,
        MRating,
        MRect,
        MDivider,
        MaterialConfig,
        MText,
        MImage,
        MList,
    },
    props: {
        item: {
            type: Object as PropType<Material<any>>,
            default: null,
            required: true,
        },
    },
    emits: ['update:item'],
    setup(props) {
        const runtime = useRuntime();
        const paper = usePaper();

        const material = reactive({
            instance: props.item,
            hover: false,
            active: computed(() =>
                runtime.activeMaterialSet.has(props.item.id),
            ),
            clicked: false,
        });
        provide(materialInjectionKey, material);

        watch(
            () => material.active,
            () => {
                if (!material.active) material.clicked = false;
            },
        );

        const focus = (e: MouseEvent) => {
            material.clicked = true;
            // 没按空格时阻止冒泡
            if (!runtime.keyboardStatus.space) e.stopPropagation();

            if (runtime.keyboardStatus.shift) {
                // 按住shift点击元素则切换选中状态
                if (!runtime.activeMaterialSet.delete(material.instance.id)) {
                    runtime.activeMaterialSet.add(material.instance.id);
                }
            } else {
                // 否则重置为该元素
                runtime.activeMaterialSet.clear();
                runtime.activeMaterialSet.add(material.instance.id);
            }
        };
        const blur = () => {
            runtime.activeMaterialSet.clear();
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
        const { onMousedown: onDotMousedown } = useMouseDrag({
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

                const { itemStartX, itemStartY, itemStartH, itemStartW } =
                    posInfoCache;

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
            const dragHandlers =
                prototypeMap[material.instance.componentName].dragHandlers;
            if (dragHandlers instanceof Function) {
                return dragHandlers(material.instance.config);
            } else {
                return dragHandlers;
            }
        });

        const removeMaterialInstance = () => {
            paper.removeMaterial(material.instance.id);
        };

        return {
            hover: toRef(material, 'hover'),
            active: toRef(material, 'active'),
            instance: toRef(material, 'instance'),
            clicked: toRef(material, 'clicked'),
            scale: toRef(runtime.scale, 'value'),
            paper,
            dots: ctrlDots,
            ableCtrlDots,
            styleMap,
            clickingDot,
            onDotMousedown,
            focus,
            blur,
            CTRL_DOT_SIZE,
            removeMaterialInstance,
        };
    },
});
</script>

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
