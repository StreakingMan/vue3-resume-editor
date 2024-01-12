module.exports = {
    '*.{.ts,.tsx}': ['prettier --write', 'eslint --cache --fix', 'git add'],
    '*.vue': ['eslint --cache --fix', 'stylelint --fix', 'git add'],
    '*.s?css': ['stylelint --fix', 'git add'],
    '*.json': ['prettier --write', 'git add'],
    '*.js': 'prettier --write',
};
