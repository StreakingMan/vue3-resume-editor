module.exports = {
    '*.{.ts,.tsx}': ['prettier --write', 'eslint --cache --fix', 'git add'],
};
