module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                'last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 9'
            ]
        })
    ]
}