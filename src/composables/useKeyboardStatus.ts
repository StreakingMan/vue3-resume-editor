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

    const onKeydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Space':
                space.value = true;
                break;
            case 'Ctrl':
                ctrl.value = true;
                break;
            case 'Alt':
                alt.value = true;
                break;
        }
    };

    const onKeyup = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Space':
                space.value = false;
                break;
            case 'Ctrl':
                ctrl.value = false;
                break;
            case 'Alt':
                alt.value = false;
                break;
        }
    };

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
    });

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);

    return {
        space,
        ctrl,
        alt,
    };
}
