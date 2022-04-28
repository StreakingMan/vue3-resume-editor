export const M_TEXT_NAME = 'MText';
export const M_IMAGE_NAME = 'MImage';
export const M_LIST_NAME = 'MList';
export const M_DIVIDER_NAME = 'MDivider';

export type MaterialComponentNameType =
    | 'MText'
    | 'MImage'
    | 'MList'
    | 'MDivider';
export type CtrlDotType = 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml';
export type CtrlDotFunction<T> = (config: T) => CtrlDotType[];
