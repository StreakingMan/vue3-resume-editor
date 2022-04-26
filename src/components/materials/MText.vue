<template>
    <div
        ref="eleRef"
        class="m-text"
        :class="
            {
                0: 'text-h1',
                1: 'text-h2',
                2: 'text-h3',
                3: 'text-h4',
                4: 'text-h5',
            }[instance.config.typo] || 'text-h6'
        "
    >
        {{ instance.config.content }}
        <textarea
            v-model="instance.config.content"
            :class="
                {
                    0: 'text-h1',
                    1: 'text-h2',
                    2: 'text-h3',
                    3: 'text-h4',
                    4: 'text-h5',
                }[instance.config.typo] || 'text-h6'
            "
            wrap="hard"
            @mousedown.stop
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, ref, watch } from 'vue';
import { Material, MaterialOptions } from '../../classes/Material';
import { ProtoInfo } from './prototypes';

const name = 'MText';

export default defineComponent({
    name,
    protoInfo: {
        label: '文本',
        icon: 'format-title',
        creator({ x, y }: MaterialOptions): Material {
            return new Material({
                x: x - 100,
                y: y - 50,
                w: 200,
                h: 100,
                config: {
                    componentName: name,
                    content: 'Material Text',
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
                instance.h = eleRef.value.clientHeight;
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
    color: transparent;
    textarea {
        width: 100%;
        height: calc(100% + 12px);
        position: absolute;
        white-space: pre-wrap;
        top: 0;
        left: 0;
        resize: none;
        word-break: break-word;
    }
}
</style>
