// vuex.d.ts
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { Item } from '../interface/Item';

type PaperSize = 'a4';
interface State {
    activeItems: Item[];
    guideState: number;
    keyboardStatus: {
        ctrl: boolean;
        space: boolean;
        alt: boolean;
    };
    scale: number;
    paperSize: PaperSize;
}

declare module '@vue/runtime-core' {
    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
