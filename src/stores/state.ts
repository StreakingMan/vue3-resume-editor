import { Item } from '../interface/Item';

// define your typings for the store state
export interface State {
    activeItems: Item[];
    count: number;
}

export const state: State = {
    activeItems: [],
    count: 0,
};
