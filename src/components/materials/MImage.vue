<template>
    <v-img
        :src="instance.config.url"
        :transition="false"
        :aspect-ratio="instance.config.aspectRatio"
        :cover="instance.config.cut"
        lazy-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIxIDE3LjJMNi44IDNIMTlDMjAuMSAzIDIxIDMuOSAyMSA1VjE3LjJNMjAuNyAyMkwxOS43IDIxSDVDMy45IDIxIDMgMjAuMSAzIDE5VjQuM0wyIDMuM0wzLjMgMkwyMiAyMC43TDIwLjcgMjJNMTYuOCAxOEwxMi45IDE0LjFMMTEgMTYuNUw4LjUgMTMuNUw1IDE4SDE2LjhaIiAvPjwvc3ZnPg=="
        @mousedown.prevent
    >
    </v-img>

    <MaterialConfigPopover>
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <div class="d-flex align-center mb-2">
                <div class="text-subtitle-2">类型：</div>
                <v-btn-toggle
                    v-model="instance.config.type"
                    color="primary"
                    class="border"
                    style="height: 36px"
                    divided
                >
                    <v-btn value="local" variant="text" size="small">
                        <v-icon> mdi-laptop </v-icon>
                        本地
                    </v-btn>
                    <v-btn value="web" variant="text" size="small">
                        <v-icon> mdi-web </v-icon>
                        网络
                    </v-btn>
                </v-btn-toggle>
            </div>

            <div class="d-flex align-center">
                <div class="text-subtitle-2">链接：</div>
                <v-text-field
                    v-if="instance.config.type === 'web'"
                    v-model="instance.config.url"
                    density="compact"
                    variant="outlined"
                    placeholder="输入图片地址"
                    clearable
                    hide-details
                    @input="onUrlChange"
                ></v-text-field>
                <template v-else>
                    <v-btn
                        variant="outlined"
                        color="primary"
                        height="40"
                        @click="clickFileInput"
                    >
                        选择图片
                    </v-btn>
                    <v-file-input
                        :id="instance.id + 'fileInput'"
                        style="position: fixed; right: -1000px; bottom: 1000px"
                        :rules="fileRules"
                        accept="image/*"
                        @update:modelValue="(files) => onFileChange(files[0])"
                    ></v-file-input>
                </template>
            </div>

            <div class="d-flex align-center">
                <div class="text-subtitle-2">裁切：</div>
                <v-switch
                    v-model="instance.config.cut"
                    color="primary"
                    hide-details
                >
                    <template #label>
                        <div class="text-caption">
                            {{
                                instance.config.cut
                                    ? '宽度适配，裁切多余高度'
                                    : '保持图片原有比例'
                            }}
                        </div>
                    </template>
                </v-switch>
            </div>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, watch } from 'vue';
import { Material } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { M_IMAGE_NAME } from './config';

interface MImageConfig {
    url: string;
    aspectRatio?: number;
    type: 'local' | 'web';
    cut: boolean;
}

const protoInfo: ProtoInfo<MImageConfig> = {
    label: '图像',
    icon: 'image',
    dragHandlers: (config) =>
        config.cut
            ? ['tl', 'tr', 'tm', 'ml', 'mr', 'bl', 'bm', 'br']
            : ['br', 'mr', 'bl', 'ml'],
    genInitOptions: ({ x, y }) => ({
        componentName: M_IMAGE_NAME,
        x: x - 50,
        y: y - 50,
        w: 100,
        h: 100,
        z: '123',
        config: {
            url: `https://avatars.dicebear.com/v2/avataaars/12e951b855470f70b2f3051992f61f26.svg`,
            type: 'web',
            aspectRatio: 1,
            cut: false,
        },
    }),
};

export default defineComponent({
    name: M_IMAGE_NAME,
    components: { MaterialConfigPopover },
    protoInfo,
    setup() {
        const instance = inject('m-instance') as Material<MImageConfig>;

        watch(
            () => ({
                w: instance.w,
                url: instance.config.url,
                cut: instance.config.cut,
            }),
            async () => {
                await nextTick();
                // 保持长宽比
                const { aspectRatio, cut } = instance.config;
                if (aspectRatio && !cut) {
                    instance.h = instance.w / aspectRatio;
                }
            }
        );

        const onUrlChange = async () => {
            try {
                const { width, height, ratio } = await getImageSizeInfo(
                    instance.config.url
                );
                instance.config.aspectRatio = ratio;
                if (width > 200) {
                    instance.w = 200;
                    instance.h = 200 * ratio;
                } else {
                    instance.w = width;
                    instance.h = height;
                }
            } catch (e) {
                console.log(e);
            }
        };

        const onFileChange = (file: File) => {
            if (!file) {
                instance.config.url = '';
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                instance.config.url = reader.result as string;
                try {
                    const { width, height, ratio } = await getImageSizeInfo(
                        reader.result as string
                    );
                    instance.config.aspectRatio = ratio;
                    if (width > 200) {
                        instance.w = 200;
                        instance.h = 200 * ratio;
                    } else {
                        instance.w = width;
                        instance.h = height;
                    }
                } catch (e) {
                    console.log(e);
                }
            };
        };

        const getImageSizeInfo = (url: string) => {
            return new Promise<{
                width: number;
                height: number;
                ratio: number;
            }>((resolve, reject) => {
                const image = new Image();
                image.src = url;
                image.onload = () => {
                    console.log('fuck');
                    const { width, height } = image;
                    resolve({
                        width: width,
                        height: height,
                        ratio: width / height,
                    });
                };
                image.onerror = () => {
                    reject('图片加载失败');
                };
            });
        };

        const clickFileInput = () => {
            document.getElementById(instance.id + 'fileInput')?.click();
        };

        return {
            clickFileInput,
            onFileChange,
            onUrlChange,
            instance,
        };
    },
    data: () => ({
        fileRules: [
            (value: string | any[]) => {
                return (
                    !value ||
                    !value.length ||
                    value[0].size < 1000000 ||
                    '图片大小最大 2 MB!'
                );
            },
        ],
    }),
});
</script>

<style scoped lang="scss">
//
</style>
