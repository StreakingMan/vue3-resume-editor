<template>
    <v-btn icon>
        <v-icon>mdi-grid</v-icon>
        <v-tooltip activator="parent" anchor="bottom">辅助网格</v-tooltip>
        <v-menu
            activator="parent"
            anchor="bottom"
            :close-on-content-click="false"
        >
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">显示网格</div>
                    <v-btn
                        icon
                        :disabled="paper.cellSize < 10"
                        @click="showGrid = !showGrid"
                    >
                        <v-icon>
                            {{
                                paper.cellSize >= 10 && showGrid
                                    ? 'mdi-eye'
                                    : 'mdi-eye-off'
                            }}
                        </v-icon>
                    </v-btn>
                </div>
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">单元大小</div>
                    <v-slider
                        v-model="paper.cellSize"
                        hide-details
                        min="1"
                        max="48"
                        step="1"
                        thumb-label
                    ></v-slider>
                </div>
            </v-sheet>
        </v-menu>
    </v-btn>

    <v-btn icon>
        <v-icon :style="{ color: paper.background }"> mdi-palette </v-icon>
        <v-tooltip activator="parent" anchor="bottom">纸张背景</v-tooltip>
        <v-menu
            activator="parent"
            anchor="bottom"
            :close-on-content-click="false"
        >
            <v-sheet class="pa-4 rounded print-none" width="fit-content">
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">背景色</div>
                </div>
                <v-color-picker
                    v-model="paper.background"
                    show-swatches
                    elevation="0"
                ></v-color-picker>
            </v-sheet>
        </v-menu>
    </v-btn>

    <v-btn icon>
        <v-icon>mdi-magnify-plus</v-icon>
        <v-tooltip activator="parent" anchor="bottom">缩放视图</v-tooltip>
        <v-menu
            activator="parent"
            anchor="bottom"
            :close-on-content-click="false"
        >
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">比例</div>
                    <v-slider
                        v-model="scale"
                        hide-details
                        :min="SCALE_RANGE[0]"
                        :max="SCALE_RANGE[1]"
                        tick-size="4"
                        step="0.01"
                    ></v-slider>
                </div>
                <div class="text-caption">[ctrl + 滚轮] 快捷操作</div>
            </v-sheet>
        </v-menu>
    </v-btn>

    <v-btn icon>
        <v-icon>mdi-broom</v-icon>
        <v-tooltip activator="parent" anchor="bottom">清空页面</v-tooltip>
        <v-menu activator="parent" anchor="bottom">
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="text-subtitle-2">
                    该操作将清空页面所有元素，确认清空？
                </div>
                <div class="d-flex">
                    <v-spacer />
                    <v-btn color="primary" @click="paper.clear()">确认</v-btn>
                </div>
            </v-sheet>
        </v-menu>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import { usePaper, useRuntime } from '../../composables/useApp';
import { SCALE_RANGE } from '@/components/core/config';

export default defineComponent({
    name: 'Outlook',
    setup() {
        const runtime = useRuntime();
        const paper = usePaper();

        return {
            scale: toRef(runtime.scale, 'value'),
            showGrid: toRef(runtime, 'showGrid'),
            paper,
            SCALE_RANGE,
        };
    },
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.print-none {
    @include printNone;
}
</style>
