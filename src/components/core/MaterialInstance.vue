<template>
    <div
        :key="selfItem.id"
        class="material-instance"
        :style="{
            left: selfItem.x + 'px',
            top: selfItem.y + 'px',
            width: selfItem.w + 'px',
            height: selfItem.h + 'px',
            padding: CTRL_DOT_SIZE + 'px',
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
                padding: selfItem.config.padding || 0 + 'px',
                borderStyle: selfItem.config.borderStyle,
                borderWidth: selfItem.config.borderWidth || 0 + 'px',
                borderColor: selfItem.config.borderColor,
                borderRadius: selfItem.config.borderRadius || 0 + 'px',
                backgroundColor: selfItem.config.backgroundColor,
            }"
        >
            <component :is="selfItem.config.componentName">
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
                {
                    opacity: active ? 1 : 0,
                    width: CTRL_DOT_SIZE + 'px',
                    height: CTRL_DOT_SIZE + 'px',
                },
            ]"
            class="control-dot bg-primary"
            :class="{
                active: clickingDot === dot,
                hide: clickingDot && clickingDot !== dot,
            }"
            @mousedown.stop.prevent="
                clickingDot = dot;
                onDotMousedown($event);
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

const styleMap = {
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
    setup(props, { emit }) {
        // 位置信息缓存
        const posInfoCache = {
            itemStartX: 0,
            itemStartY: 0,
            itemStartW: 0,
            itemStartH: 0,
        };

        // 数据源
        const { item } = toRefs(props);
        const selfItem = computed({
            get: () => item.value,
            set: (v) => emit('update:item', v),
        });
        provide('m-instance', props.item);

        // 状态维护
        const focusMaterial: Ref = inject('focus:material') as Ref;
        const focus = () => {
            focusMaterial.value = item.value;
        };
        const blur = () => {
            focusMaterial.value = null;
        };
        const active = computed(() => {
            return focusMaterial.value === item.value;
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
                const { x, y } = selfItem.value;
                posInfoCache.itemStartX = x;
                posInfoCache.itemStartY = y;
            },
            onDrag({ transX, transY }: MouseEvtInfo) {
                selfItem.value.x =
                    posInfoCache.itemStartX + transX / scale.value;
                selfItem.value.y =
                    posInfoCache.itemStartY + transY / scale.value;
            },
            onFinish() {
                posInfoCache.itemStartX = 0;
                posInfoCache.itemStartY = 0;
            },
            bindElementRef: moveHandlerRef,
        });

        // 缩放控制点
        const clickingDot = ref('');
        const { onMousedown: onDotMousedown } = useMouseDrag({
            onStart() {
                if (!active.value) return;
                const { x, y, w, h } = selfItem.value;
                posInfoCache.itemStartX = x;
                posInfoCache.itemStartY = y;
                posInfoCache.itemStartW = w;
                posInfoCache.itemStartH = h;
            },
            onDrag({ transX, transY }: MouseEvtInfo) {
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

                selfItem.value.x = newX;
                selfItem.value.y = newY;
                selfItem.value.w = newW;
                selfItem.value.h = newH;
            },
            onFinish() {
                clickingDot.value = '';
                posInfoCache.itemStartX = 0;
                posInfoCache.itemStartY = 0;
                posInfoCache.itemStartW = 0;
                posInfoCache.itemStartH = 0;
            },
        });

        return {
            moveHandlerRef,
            selfItem,
            dots: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
            scale,
            styleMap,
            clickingDot,
            onDotMousedown,
            active,
            focus,
            blur,
            CTRL_DOT_SIZE,
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

        &.active {
            opacity: 1;
        }

        &.hide {
            opacity: 0;
        }
    }
}
</style>
