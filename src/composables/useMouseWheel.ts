import { onMounted, onUnmounted, Ref } from 'vue';

interface MouseWheelOptions {
    onWheel: {
        (delta: number, mousePosition: { x: number; y: number }): void;
    };
}

export default function useMouseWheel(options: MouseWheelOptions): void {
    const onMousewheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
            // 阻止冒泡默认考虑交给调用者去做
            e.stopPropagation();
            e.preventDefault();
            options.onWheel(-e.deltaY / 4000, { x: e.clientX, y: e.clientY });
        }
    };

    onMounted(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.addEventListener('mousewheel', onMousewheel, { passive: false });
    });

    onUnmounted(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.removeEventListener('mousewheel', onMousewheel, {
            passive: false,
        });
    });
}
