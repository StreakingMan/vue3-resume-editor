export enum MaterialNames {
    MText = 'MText',
    MImage = 'MImage',
    MList = 'MList',
    MDivider = 'MDivider',
    MRect = 'MRect',
    MRating = 'MRating',
    MIcon = 'MIcon',
    MPie = 'MPie',
    MTimeline = 'MTimeline',
}

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
