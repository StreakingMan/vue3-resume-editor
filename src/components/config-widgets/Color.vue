<template>
    <v-sheet
        width="24"
        height="24"
        class="position-relative border rounded"
        :class="noMargin ? '' : 'ma-2 ml-0'"
        :color="value"
        style="cursor: pointer"
    >
        <div v-if="!value" class="no-color"></div>
        <v-menu activator="parent" :close-on-content-click="false">
            <v-color-picker v-model="value" show-swatches></v-color-picker>
        </v-menu>
    </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Color',
    props: {
        modelValue: {
            type: String,
            default: '',
            required: true,
        },
        noMargin: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value: string) {
                this.$emit('update:modelValue', value);
            },
        },
    },
});
</script>

<style scoped>
.no-color {
    position: absolute;
    width: 30px;
    height: 2px;
    background: red;
    transform: rotate(45deg);
    left: -5px;
    top: 11px;
}
</style>
