module.exports = {
    env: {
        browser: true,
    },
    extends: 'airbnb',
    plugins: ['react', 'import'],
    parser: 'babel-eslint',
    rules: {
        indent: ['error', 4],
        semi: ['error', 'never'],
        'max-len': ['error', 160],
        'no-param-reassign': ['off'],
        'object-curly-newline': ['off'],
        'react/destructuring-assignment': ['off'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-filename-extension': ['off'],
        'jsx-a11y/no-static-element-interactions': ['off'],
        'jsx-a11y/click-events-have-key-events': ['off'],
    },
}
