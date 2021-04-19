import { MouseEvtCb } from '../interface/mouseEvtCb';
import { ref, Ref } from 'vue';

type MouseEvtName =
    | 'onMousedown'
    | 'onMousemove'
    | 'onMouseup'
    | 'onMouseleave';

interface MouseDragCbs
    extends Record<MouseEvtName, (this: HTMLElement, ev: MouseEvent) => void> {
    clicking: Ref<boolean>;
}

interface MouseDragOptions {
    finishWhenLeave: boolean;
}

export default function useMouseDrag(
    onStart: MouseEvtCb,
    onDrag: MouseEvtCb,
    onFinish: MouseEvtCb,
    options: MouseDragOptions = {
        finishWhenLeave: true,
    }
): MouseDragCbs {
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
        if (options.finishWhenLeave) {
            clicking.value = false;
            const { clientX, clientY } = ev;
            onFinish({ clientX, clientY });
        }
    };

    return {
        clicking,
        onMousedown,
        onMousemove,
        onMouseup,
        onMouseleave,
    };
}
