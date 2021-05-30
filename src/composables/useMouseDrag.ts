import { ref, Ref, onMounted, onUnmounted } from 'vue';

interface MouseDragCbs {
    clicking: Ref<boolean>;
}

interface MouseDragOptions {
    onStart: MouseEvtCb;
    onDrag: MouseEvtCb;
    onFinish: MouseEvtCb;
    bindElementRef: Ref<HTMLElement> | Ref;
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

export default function useMouseDrag(options: MouseDragOptions): MouseDragCbs {
    const clicking = ref(false);
    const { onStart, onDrag, onFinish } = options;
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
            ev.stopPropagation();
            window.addEventListener('mousemove', onMousemove);
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
    };

    onMounted(() => {
        const target =
            options.bindElementRef.value.$el || options.bindElementRef.value;
        if (!target) return;
        target.addEventListener('mousedown', onMousedown);
        target.addEventListener('mouseup', onMouseup);
    });

    onUnmounted(() => {
        const target =
            options.bindElementRef.value.$el || options.bindElementRef.value;
        if (!target) return;
        target.removeEventListener('mousedown', onMousedown);
        target.removeEventListener('mouseup', onMouseup);
    });

    return {
        clicking,
    };
}
