import { Item } from '../interface/Item';

// define your typings for the store state
export interface State {
    activeItems: Item[];
    guideState: number;
}

export const state: State = {
    activeItems: [],
    guideState: 0,
};
