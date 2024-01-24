import { onMounted, onUnmounted } from 'vue';

interface MouseWheelOptions {
    onWheel: {
        (delta: number, mousePosition: { x: number; y: number }, e: WheelEvent): void;
    };
}

export default function useWindowMouseWheel(options: MouseWheelOptions): void {
    const onMousewheel = (e: WheelEvent) => {
        options.onWheel(-e.deltaY / 200, { x: e.clientX, y: e.clientY }, e);
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
