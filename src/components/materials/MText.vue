<template>
    <div
        ref="eleRef"
        class="m-title text-h6"
        :style="{
            fontSize: instance.config.fontSize + 'px',
        }"
    >
        {{ instance.config.content }}
        <textarea
            v-model="instance.config.content"
            class="text-h6"
            wrap="hard"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, ref, watch } from 'vue';
import { Material, MaterialOptions } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
import { CTRL_DOT_SIZE } from '../core/config';

const name = 'MText';

export default defineComponent({
    name,
    protoInfo: {
        label: '标题',
        icon: 'format-title',
        creator({ x, y }: MaterialOptions): Material {
            return new Material({
                x: x - 100,
                y: y - 50,
                w: 200,
                h: 100,
                config: {
                    componentName: name,
                    content: 'Material Title',
                    fontSize: 18,
                },
            });
        },
        configOptions: {
            content: {
                type: 'text',
            },
            fontSize: {
                type: 'number',
                min: 12,
                max: 100,
            },
        },
    } as ProtoInfo,
    emits: ['update:config'],

    setup() {
        const instance: Material = inject('m-instance', {}) as Material;
        const eleRef = ref<HTMLDivElement | null>(null);
        watch(instance, async () => {
            if (eleRef.value) {
                await nextTick();
                instance.h = eleRef.value.clientHeight + CTRL_DOT_SIZE * 2;
            }
        });

        return {
            instance,
            eleRef,
        };
    },
});
</script>

<style scoped lang="scss">
.m-text {
    position: relative;
    white-space: pre-wrap;
    word-break: break-word;
    textarea {
        width: 100%;
        height: 100%;
        position: absolute;
        white-space: pre-wrap;
        top: 0;
        left: 0;
        resize: none;
        word-break: break-word;
    }
}
</style>
