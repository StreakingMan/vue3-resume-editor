<template>
    <v-btn icon @click="onImportClick">
        <v-icon>mdi-import</v-icon>
    </v-btn>
    <v-file-input
        id="importFileInput"
        style="position: fixed; right: -1000px; bottom: 1000px"
        accept="application/json"
        @update:model-value="(files) => onImportFileChange(files[0])"
    ></v-file-input>
    <v-btn icon>
        <v-icon>mdi-export</v-icon>
        <v-dialog
            v-model="exportDialog"
            activator="parent"
            width="600"
            @update:model-value="exportFilename = new Date().toLocaleString()"
        >
            <v-card width="600">
                <v-card-text>
                    <v-text-field
                        v-model="exportFilename"
                        hide-details
                        placeholder="请输入文件名"
                        suffix=".json"
                        variant="outlined"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="exportPaperJSON"> 导出JSON文件 </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { downloadJSON } from '../../utils/download';

import { usePaper } from '@/composables/usePaper';

export default defineComponent({
    name: 'ImportExport',
    setup() {
        const paper = usePaper();
        const exportPaperJSON = () => {
            downloadJSON(paper, `${exportFilename.value}.json`);
            exportDialog.value = false;
        };
        const exportDialog = ref(false);
        const exportFilename = ref('');

        const onImportClick = () => {
            document.getElementById('importFileInput')?.click();
        };
        const onImportFileChange = (file: File) => {
            const reader = new FileReader();
            reader.onloadend = (evt: ProgressEvent<FileReader>) => {
                if (!evt.target) return;
                if (evt.target.readyState === FileReader.DONE) {
                    const data = JSON.parse(evt.target.result as string);
                    paper.loadData(data);
                }
            };
            // 包含中文内容用gbk编码
            reader.readAsText(file, 'utf-8');
        };

        return {
            onImportClick,
            onImportFileChange,
            exportDialog,
            exportFilename,
            exportPaperJSON,
        };
    },
});
</script>
