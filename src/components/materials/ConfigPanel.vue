<template>
    <div
        v-if="state === 'active'"
        :style="`transform: scale(${1 / scale});`"
        class="config-panel animate__animated animate__bounceIn"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';

export default defineComponent({
    name: 'ConfigPanel',

    setup() {
        const state = inject('state');

        const scale = inject('scale', ref(1));
        watch(scale, (v) => {
            console.log(v);
        });

        return { scale, state };
    },
});
</script>

<style scoped lang="scss">
@import 'src/styles/elevation';
.config-panel {
    z-index: 500;
    position: absolute;
    left: calc(100% + 16px);
    top: 0;
    background-color: white;
    border-radius: 4px;
    padding: 16px;
    @include elevation(2);
    @include elevationTransition();
}
</style>
