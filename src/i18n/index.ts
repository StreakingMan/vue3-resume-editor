import { createI18n } from 'vue-i18n';
import { Chinese } from './Chinese';
import { English } from './English';

export const i18n = createI18n({
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {
        'zh-CN': Chinese,
        en: English,
    },
});
