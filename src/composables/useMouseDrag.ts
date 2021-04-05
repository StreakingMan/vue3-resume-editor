import { MouseEvtCb } from '../interface/mouseEvtCb';
import { ref } from 'vue';

export default function useMouseDrag(
    onStart: MouseEvtCb,
    onDrag: MouseEvtCb,
    onFinish: MouseEvtCb
): Record<string, unknown> {
    const clicking = ref(false);

    const onMousedown = (ev: MouseEvent) => {
        const { clientX, clientY } = ev;
        clicking.value = true;
        onStart({ clientX, clientY });
    };

    const onMousemove = (ev: MouseEvent) => {
        if (!clicking.value) return;
        const { clientX, clientY } = ev;
        onDrag({ clientX, clientY });
    };

    const onMouseup = (ev: MouseEvent) => {
        clicking.value = false;
        const { clientX, clientY } = ev;
        onFinish({ clientX, clientY });
    };

    const onMouseleave = (ev: MouseEvent) => {
        clicking.value = false;
        const { clientX, clientY } = ev;
        onFinish({ clientX, clientY });
    };

    return {
        clicking,
        onMousedown,
        onMousemove,
        onMouseup,
        onMouseleave,
    };
}
