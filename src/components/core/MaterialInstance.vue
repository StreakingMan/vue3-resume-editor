<template>
    <div
        :key="selfItem.id"
        ref="itemRef"
        class="material-instance animate__animated animate__bounceIn"
        :style="{
            left: selfItem.x + 'px',
            top: selfItem.y + 'px',
            width: selfItem.w + 'px',
            height: selfItem.h + 'px',
            padding: selfItem.config.padding + 'px',
            borderStyle: selfItem.config.borderStyle,
            borderWidth: selfItem.config.borderWidth + 'px',
            borderColor: selfItem.config.borderColor,
            borderRadius: selfItem.config.borderRadius + 'px',
            backgroundColor: selfItem.config.backgroundColor,
        }"
        @click.prevent.stop="onClick"
    >
        <div
            v-for="dot in dots"
            v-show="active"
            :key="dot"
            :style="`transform: scale(${1 / scale});${styleMap[dot]}`"
            class="control-dot"
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
    watch,
} from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import MTitle from '../materials/MTitle.vue';
import MList from '../materials/MList.vue';
import MImage from '../materials/MImage.vue';
import MText from '../materials/MText.vue';

const styleMap = {
    tl: `top: -10px;left: -10px;cursor: nw-resize;`,
    tm: `top: -10px;left: 50%;margin-left: -5px;cursor: n-resize;`,
    tr: `top: -10px;right: -10px;cursor: ne-resize;`,
    mr: `top: 50%;margin-top: -5px;right: -10px;cursor: e-resize;`,
    br: `bottom: -10px;right: -10px;cursor: se-resize;`,
    bm: `bottom: -10px;left: 50%;margin-left: -5px;cursor: s-resize;`,
    bl: `bottom: -10px;left: -10px;cursor: sw-resize;`,
    ml: `top: 50%;margin-top: -5px;left: -10px;cursor: w-resize;`,
};

export default defineComponent({
    name: 'MaterialInstance',
    components: {},
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
        provide('instance', props.item);

        // 状态维护
        const focusMaterial: Ref = inject('focus:material') as Ref;
        const onClick = () => {
            focusMaterial.value = item.value;
        };
        const active = computed(() => {
            return focusMaterial.value === item.value;
        });

        // 缩放值注入
        const scale: Ref<number> = inject('scale', ref(1));

        // 空格键状态注入
        const space: Ref<boolean> = inject('keyboard:space', ref(false));

        const itemRef = ref(null);
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
            bindElementRef: itemRef,
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

                const unit = 10;

                if (newH < unit) newH = unit;
                if (newW < unit) newW = unit;
                if (newX + unit > itemStartX + itemStartW) {
                    newX = itemStartX + itemStartW - unit;
                }
                if (newY + unit > itemStartY + itemStartH) {
                    newY = itemStartY + itemStartH - unit;
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
            itemRef,
            selfItem,
            dots: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
            scale,
            styleMap,
            clickingDot,
            onDotMousedown,
            active,
            onClick,
        };
    },
});
</script>

<style scoped lang="scss">
.material-instance {
    position: absolute;
    //

    .setting-icon {
        position: absolute;
        right: 4px;
        top: 4px;
        transition: 0.16s;
        opacity: 0;
        cursor: pointer;
    }

    .control-dot {
        box-sizing: border-box;
        position: absolute;
        width: 12px;
        height: 12px;
        transition: background-color 0.5s, opacity 0.5s;

        &.active {
            //
        }

        &.hide {
            opacity: 0;
        }
    }

    &:hover {
        //

        .setting-icon {
            opacity: 1;
        }
    }
}
</style>
