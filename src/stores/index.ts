import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { state, State } from './state';

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state,
});

// define your own `useStore` composition function
export function useStore(): Store<State> {
    return baseUseStore(key);
}
