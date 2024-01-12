export const M_TEXT_NAME = 'MText';
export const M_IMAGE_NAME = 'MImage';
export const M_LIST_NAME = 'MList';
export const M_DIVIDER_NAME = 'MDivider';
export const M_RECT_NAME = 'MRect';
export const M_RATING_NAME = 'MRating';
export const M_ICON_NAME = 'MIcon';
export const M_PIE_NAME = 'MPie';

export type MaterialComponentNameType =
    | 'MText'
    | 'MImage'
    | 'MList'
    | 'MDivider'
    | 'MRect'
    | 'MRating'
    | 'MIcon'
    | 'MPie';
export type CtrlDotType = 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml';
export type CtrlDotFunction<T> = (config: T) => CtrlDotType[];

export const typographyClass = [
    'text-h1',
    'text-h2',
    'text-h3',
    'text-h4',
    'text-h5',
    'text-h6',
    'text-subtitle-1',
    'text-subtitle-2',
    'text-body-1',
    'text-body-2',
    'text-button',
    'text-caption',
    'text-overline',
];

export const fontWeightClass = [
    'font-weight-black',
    'font-weight-bold',
    'font-weight-medium',
    'font-weight-regular',
    'font-weight-light',
    'font-weight-thin',
    'font-italic',
];

export const textAlignOptions: Array<{
    icon: string;
    value: 'left' | 'right' | 'center';
}> = [
    {
        icon: 'mdi-format-align-left',
        value: 'left',
    },
    {
        icon: 'mdi-format-align-center',
        value: 'center',
    },
    {
        icon: 'mdi-format-align-right',
        value: 'right',
    },
];
