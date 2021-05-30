<template>
    <div class="shortcut-tip" :class="`state-${appState}`">
        <MyButton type="pressed" :color="ctrl ? 'accent' : 'dark'">
            CTRL+WHEEL for scale
        </MyButton>
        <MyButton
            class="ml-3"
            :color="space ? 'accent' : 'dark'"
            type="pressed"
        >
            SPACE for move
        </MyButton>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import MyButton from '../ui/MyButton.vue';

export default defineComponent({
    name: 'ShortcutTip',
    components: { MyButton },
    setup() {
        return {
            appState: inject('appState'),
            space: inject('keyboard:space'),
            ctrl: inject('keyboard:ctrl'),
        };
    },
});
</script>

<style scoped lang="scss">
@import 'src/styles/animate';
.shortcut-tip {
    position: absolute;
    left: 16px;
    top: 16px;
    @include transition();
    &.state- {
        &welcome {
            transform: translateX(-120%);
        }
        &running {
            transform: translateX(0);
        }
    }
}
</style>
