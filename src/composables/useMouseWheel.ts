import { onMounted, onUnmounted } from 'vue';

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
            options.onWheel(-e.deltaY / 200, { x: e.clientX, y: e.clientY });
        }
    };

    onMounted(() => {
        // @ts-ignore
        window.addEventListener('mousewheel', onMousewheel, { passive: false });
    });

    onUnmounted(() => {
        // @ts-ignore
        window.removeEventListener('mousewheel', onMousewheel, {
            passive: false,
        });
    });
}
