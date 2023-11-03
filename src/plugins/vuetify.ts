/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

export default createVuetify(
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
    {
        theme: {
            defaultTheme: 'dark',
        },
    },
);
