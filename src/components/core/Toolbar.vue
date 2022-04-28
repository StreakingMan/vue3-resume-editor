<template>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-left</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-center</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-right</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-distribute</v-icon>
    </v-btn>
    <v-divider vertical class="mx-4"></v-divider>
    <v-btn icon>
        <v-icon>mdi-align-vertical-top</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-vertical-center</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-vertical-bottom</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-vertical-distribute</v-icon>
    </v-btn>
    <v-divider vertical class="mx-4"></v-divider>
    <v-btn icon>
        <v-icon>mdi-grid</v-icon>
        <v-menu activator="parent">
            <v-sheet class="pa-4 rounded" width="200">
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">显示网格</div>
                    <v-btn
                        icon
                        :disabled="paperInstance.cellSize < 10"
                        @click="showGrid = !showGrid"
                    >
                        <v-icon>
                            {{
                                paperInstance.cellSize >= 10 && showGrid
                                    ? 'mdi-eye'
                                    : 'mdi-eye-off'
                            }}
                        </v-icon>
                    </v-btn>
                </div>
                <div class="d-flex align-center">
                    <div class="text-subtitle-2">单元大小</div>
                    <v-slider
                        v-model="paperInstance.cellSize"
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
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';

export default defineComponent({
    name: 'Toolbar',
    setup() {
        // Paper实例注入
        const paperInstance: UnwrapNestedRefs<Paper> = inject(
            'paper'
        ) as UnwrapNestedRefs<Paper>;

        const showGrid = inject('showGrid');

        return {
            showGrid,
            paperInstance,
        };
    },
});
</script>

<style scoped lang="scss">
.toolbar {
    //
}
</style>
