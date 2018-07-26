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
        'react/destructuring-assignment': [false],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-filename-extension': ['off'],
    },
}
