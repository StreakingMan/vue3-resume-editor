// vuex.d.ts
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { Item } from '../interface/Item';

declare module '@vue/runtime-core' {
    // declare your own store states
    interface State {
        activeItems: Item[];
        guideState: number;
    }

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
