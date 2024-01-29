<script setup lang="ts">
import { toRef } from 'vue';
import { usePaper } from '@/composables/useApp';
import { SCALE_RANGE } from '@/components/core/config';
import { useRuntime } from '@/composables/useRuntime';

const runtime = useRuntime();
const paper = usePaper();
const scale = toRef(runtime.scale, 'value');
const showGrid = toRef(runtime, 'showGrid');
</script>

<template>
    <v-btn icon>
        <v-icon>mdi-grid</v-icon>
        <v-menu activator="parent" location="bottom" :close-on-content-click="false">
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="text-subtitle-2">背景辅助网格</div>
                <div class="d-flex align-center ga-2">
                    <v-btn
                        icon
                        density="comfortable"
                        :disabled="paper.cellSize < 10"
                        @click="showGrid = !showGrid"
                    >
                        <v-icon>
                            {{ paper.cellSize >= 10 && showGrid ? 'mdi-eye' : 'mdi-eye-off' }}
                        </v-icon>
                    </v-btn>
                    <v-slider
                        v-model="paper.cellSize"
                        hide-details
                        min="1"
                        max="48"
                        step="1"
                        thumb-label
                        :thumb-size="18"
                    ></v-slider>
                </div>
            </v-sheet>
        </v-menu>
    </v-btn>

    <v-btn icon>
        <v-icon :style="{ color: paper.background }"> mdi-palette </v-icon>
        <v-menu activator="parent" location="bottom" :close-on-content-click="false">
            <v-sheet class="pa-4 rounded print-none" width="fit-content">
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">简历背景色</div>
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
        <v-icon>mdi-magnify-plus-outline</v-icon>
        <v-menu activator="parent" location="bottom" :close-on-content-click="false">
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="d-flex align-center ga-2">
                    <div class="text-subtitle-2">缩放视图</div>
                    <v-slider
                        v-model="scale"
                        hide-details
                        :min="SCALE_RANGE[0]"
                        :max="SCALE_RANGE[1]"
                        :thumb-size="18"
                    ></v-slider>
                </div>
                <div class="text-caption">[ctrl + 滚轮] 快捷操作</div>
            </v-sheet>
        </v-menu>
    </v-btn>

    <v-btn icon>
        <v-icon>mdi-broom</v-icon>
        <v-menu activator="parent" location="bottom">
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="text-subtitle-2">
                    <v-icon color="warning" size="small">mdi-alert</v-icon>
                    该操作将清空页面所有元素，确认清空？
                </div>
                <div class="d-flex">
                    <v-spacer />
                    <v-btn variant="tonal" color="warning" @click="paper.clear()">确认 </v-btn>
                </div>
            </v-sheet>
        </v-menu>
    </v-btn>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.print-none {
    @include printNone;
}
</style>
