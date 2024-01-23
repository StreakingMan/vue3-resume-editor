<script setup lang="ts">
import { usePaper } from '@/composables/useApp';

const paper = usePaper();
const onPrintClick = async () => {
    paper.saveToStorage();
    window.open('/?printPage=auto', '_blank');
};
</script>

<template>
    <v-btn icon>
        <v-icon>mdi-printer</v-icon>
        <v-menu activator="parent" location="bottom">
            <v-sheet class="pa-4 rounded print-none" width="200">
                <div class="text-subtitle-2">
                    <v-icon size="small">mdi-lightbulb-on-outline</v-icon>
                    切换目标打印机选项，即可打印或保存为PDF
                </div>
                <v-img src="/print-target.png" width="100%" />
                <div class="d-flex mt-2">
                    <v-spacer />
                    <v-btn variant="tonal" append-icon="mdi-chevron-right" @click="onPrintClick">
                        前往
                    </v-btn>
                </div>
            </v-sheet>
        </v-menu>
    </v-btn>
</template>

<style scoped lang="scss">
@page {
    size: a4;
    margin: 0;
}
</style>
