import { onMounted, onUnmounted, ref, Ref } from 'vue';

interface MouseDragCbs {
    onMousedown: (ev: MouseEvent) => void;
    clicking: Ref<boolean>;
}

interface MouseDragOptions {
    onStart: MouseEvtCb;
    onDrag: MouseEvtCb;
    onFinish: MouseEvtCb;
    bindElementRef?: Ref<HTMLElement> | Ref;
    stopPropagation?: boolean;
    preventDefault?: boolean;
}

export interface MouseEvtInfo {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    transX: number;
    transY: number;
}

export interface MouseEvtCb {
    (info: MouseEvtInfo): void | boolean;
}

// 动态的拖拽监听
// 在鼠标按下时才会监听鼠标移动和抬起事件，以减少不必要的监听
// 鼠标抬起时会自动移除监听
export default function useMouseDragDynamic(options: MouseDragOptions): MouseDragCbs {
    const clicking = ref(false);
    const { onStart, onDrag, onFinish, stopPropagation = true, preventDefault = true } = options;
    let startX: number;
    let startY: number;

    const resetCache = () => {
        startX = 0;
        startY = 0;
    };

    const onMousedown = (ev: MouseEvent) => {
        resetCache();
        const { clientX, clientY } = ev;
        if (
            onStart({
                startX: clientX,
                startY: clientY,
                currentX: clientX,
                currentY: clientY,
                transX: 0,
                transY: 0,
            }) ??
            true
        ) {
            startX = clientX;
            startY = clientY;
            clicking.value = true;
            if (stopPropagation) ev.stopPropagation();
            if (preventDefault) ev.preventDefault();
            window.addEventListener('mousemove', onMousemove);
            window.addEventListener('mouseup', onMouseup);
        }
    };

    const onMousemove = (ev: MouseEvent) => {
        if (!clicking.value) return;
        const { clientX, clientY } = ev;
        onDrag({
            startX,
            startY,
            currentX: clientX,
            currentY: clientY,
            transX: clientX - startX,
            transY: clientY - startY,
        });
    };

    const onMouseup = (ev: MouseEvent) => {
        if (!clicking.value) return;
        clicking.value = false;
        const { clientX, clientY } = ev;
        onFinish({
            startX,
            startY,
            currentX: clientX,
            currentY: clientY,
            transX: clientX - startX,
            transY: clientY - startY,
        });
        resetCache();
        window.removeEventListener('mousemove', onMousemove);
        window.removeEventListener('mouseup', onMouseup);
    };

    onMounted(() => {
        const target = options.bindElementRef?.value?.$el || options.bindElementRef?.value;
        if (!target) return;
        target.addEventListener('mousedown', onMousedown);
    });

    onUnmounted(() => {
        const target = options.bindElementRef?.value?.$el || options.bindElementRef?.value;
        if (!target) return;
        target.removeEventListener('mousedown', onMousedown);
    });

    return {
        onMousedown,
        clicking,
    };
}
