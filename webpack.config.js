const path = require('path')

module.exports = {
    entry: './src/beatwave/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [],
    },
}
