import { State } from '../types/vuex';

export const state: State = {
    activeItems: [],
    guideState: 0,
    keyboardStatus: {
        ctrl: false,
        space: false,
        alt: false,
    },
    scale: 1,
    paperSize: 'a4',
};
