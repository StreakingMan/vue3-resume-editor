<template>
    <div
        :key="instance.id"
        class="material-instance"
        :style="{
            left: instance.x + 'px',
            top: instance.y + 'px',
            width: instance.w + 'px',
            height: instance.h + 'px',
        }"
        :class="{
            border: active,
        }"
        @mouseenter.prevent.stop="focus"
        @mouseleave.prevent.stop="blur"
        @click.stop="focus"
    >
        <div
            class="w-100 h-100"
            :style="{
                padding: instance.config.padding || 0 + 'px',
                borderStyle: instance.config.borderStyle,
                borderWidth: instance.config.borderWidth || 0 + 'px',
                borderColor: instance.config.borderColor,
                borderRadius: instance.config.borderRadius || 0 + 'px',
                backgroundColor: instance.config.backgroundColor,
            }"
        >
            <component :is="instance.componentName">
                <template #activator>
                    <v-btn
                        ref="moveHandlerRef"
                        variant="outlined"
                        color="primary"
                        size="x-small"
                        :disabled="!active"
                        icon="mdi-arrow-all"
                        class="border-r-0"
                        :rounded="0"
                        title="移动元素"
                    >
                    </v-btn>
                    <v-btn
                        variant="outlined"
                        color="error"
                        size="x-small"
                        :disabled="!active"
                        icon="mdi-trash-can"
                        class="border-r-0"
                        :rounded="0"
                        title="双击删除"
                        @dblclick="removeMaterialInstance"
                    >
                    </v-btn>
                </template>
            </component>
        </div>

        <div
            v-for="dot in dots"
            :key="dot"
            :style="[
                `transform: scale(${1 / scale});${styleMap[dot]}`,
                !ableCtrlDots.includes(dot) ? 'cursor: not-allowed;' : '',
                {
                    opacity:
                        (clickingDot && clickingDot !== dot) || !active
                            ? 0
                            : ableCtrlDots.includes(dot)
                            ? 1
                            : 0.3,
                    width: CTRL_DOT_SIZE + 'px',
                    height: CTRL_DOT_SIZE + 'px',
                },
            ]"
            class="control-dot bg-primary"
            @mousedown.stop.prevent="
                ableCtrlDots.includes(dot) &&
                    (clickingDot = dot) &&
                    onDotMousedown($event)
            "
        ></div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    inject,
    provide,
    Ref,
    ref,
    toRefs,
} from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import MImage from '../materials/MImage.vue';
import MList from '../materials/MList.vue';
import MText from '../materials/MText.vue';
import { CTRL_DOT_SIZE, UNIT_SIZE } from './config';
import MaterialConfig from './MaterialConfigPopover.vue';
import { prototypeMap } from '../materials/prototypes';
import { CtrlDotType } from '../materials/config';
import { Material } from '../../classes/Material';
import { Paper } from '../../classes/Paper';

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
    components: { MaterialConfig, MText, MImage, MList },
    props: {
        item: {
            type: Object,
            default: null,
            require: true,
        },
    },
    emits: ['update:item'],
    setup(props) {
        // 位置信息缓存
        const posInfoCache = {
            itemStartX: 0,
            itemStartY: 0,
            itemStartW: 0,
            itemStartH: 0,
        };

        // 数据源
        const { item: instance } = toRefs<{ item: Material<any> }>(
            props as any
        );
        provide('m-instance', props.item);

        // 状态维护
        const focusMaterial: Ref = inject('focus:material') as Ref;
        const focus = () => {
            focusMaterial.value = instance.value;
        };
        const blur = () => {
            focusMaterial.value = null;
        };
        const active = computed(() => {
            return focusMaterial.value === instance.value;
        });
        provide('m-instance:active', active);

        // 缩放值注入
        const scale: Ref<number> = inject('scale', ref(1));

        // 空格键状态注入
        const space: Ref<boolean> = inject('keyboard:space', ref(false));

        const moveHandlerRef = ref(null);
        useMouseDrag({
            onStart() {
                if (space.value) return false;
                const { x, y } = instance.value;
                posInfoCache.itemStartX = x;
                posInfoCache.itemStartY = y;
            },
            onDrag({ transX, transY }: MouseEvtInfo) {
                instance.value.x =
                    posInfoCache.itemStartX + transX / scale.value;
                instance.value.y =
                    posInfoCache.itemStartY + transY / scale.value;
            },
            onFinish() {
                posInfoCache.itemStartX = 0;
                posInfoCache.itemStartY = 0;
            },
            bindElementRef: moveHandlerRef,
        });

        // 缩放控制点
        const clickingDot = ref<CtrlDotType | null>(null);
        const { onMousedown: onDotMousedown } = useMouseDrag({
            onStart() {
                if (!active.value) return;
                const { x, y, w, h } = instance.value;
                posInfoCache.itemStartX = x;
                posInfoCache.itemStartY = y;
                posInfoCache.itemStartW = w;
                posInfoCache.itemStartH = h;
            },
            onDrag({ transX, transY }: MouseEvtInfo) {
                if (!clickingDot.value) return;

                // TODO 最小值控制，方向锁定，比例锁定，网格吸附
                const {
                    itemStartX,
                    itemStartY,
                    itemStartH,
                    itemStartW,
                } = posInfoCache;

                let newX = itemStartX,
                    newY = itemStartY,
                    newW = itemStartW,
                    newH = itemStartH;

                if (clickingDot.value.includes('b')) {
                    newH = itemStartH + transY / scale.value;
                } else if (clickingDot.value.includes('t')) {
                    newY = itemStartY + transY / scale.value;
                    newH = itemStartH - transY / scale.value;
                }

                if (clickingDot.value.includes('r')) {
                    newW = itemStartW + transX / scale.value;
                } else if (clickingDot.value.includes('l')) {
                    newX = itemStartX + transX / scale.value;
                    newW = itemStartW - transX / scale.value;
                }

                if (newH < UNIT_SIZE) newH = UNIT_SIZE;
                if (newW < UNIT_SIZE) newW = UNIT_SIZE;
                if (newX + UNIT_SIZE > itemStartX + itemStartW) {
                    newX = itemStartX + itemStartW - UNIT_SIZE;
                }
                if (newY + UNIT_SIZE > itemStartY + itemStartH) {
                    newY = itemStartY + itemStartH - UNIT_SIZE;
                }

                instance.value.x = newX;
                instance.value.y = newY;
                instance.value.w = newW;
                instance.value.h = newH;
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
                prototypeMap[instance.value.componentName].dragHandlers;
            if (dragHandlers instanceof Function) {
                return dragHandlers(instance.value.config);
            } else {
                return dragHandlers;
            }
        });

        // Paper实例注入
        const paperInstance: Paper = inject('paper') as Paper;
        const removeMaterialInstance = () => {
            paperInstance.removeMaterial(instance.value.id);
        };

        return {
            moveHandlerRef,
            instance,
            dots: ctrlDots,
            ableCtrlDots,
            scale,
            styleMap,
            clickingDot,
            onDotMousedown,
            active,
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
    border: 1px solid transparent;
    box-sizing: content-box;

    .control-dot {
        box-sizing: border-box;
        position: absolute;
        transition: background-color 0.5s, opacity 0.5s;
    }
}
</style>
