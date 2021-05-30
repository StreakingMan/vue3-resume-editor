import { onUnmounted, ref, Ref } from 'vue';

interface KeyboardStatus {
    space: Ref<boolean>;
    ctrl: Ref<boolean>;
    alt: Ref<boolean>;
}

export default function useKeyboardStatus(): KeyboardStatus {
    const space = ref(false);
    const ctrl = ref(false);
    const alt = ref(false);

    const captureMethod = (e: KeyboardEvent) => {
        const pressed = e.type === 'keydown';
        switch (e.code) {
            case 'Space':
                // 防止干扰sketch滚动
                // 考虑将这里的逻辑交给调用者实现
                if (e.target === document.body) {
                    e.preventDefault();
                }
                space.value = pressed;
                break;
            case 'ControlLeft':
            case 'ControlRight':
                ctrl.value = pressed;
                break;
            case 'AltLeft':
            case 'AltRight':
                alt.value = pressed;
                break;
        }
    };
    onUnmounted(() => {
        window.removeEventListener('keydown', captureMethod);
        window.removeEventListener('keyup', captureMethod);
    });

    window.addEventListener('keydown', captureMethod);
    window.addEventListener('keyup', captureMethod);

    return {
        space,
        ctrl,
        alt,
    };
}
