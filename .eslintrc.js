module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    rules: {
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
    },
};
