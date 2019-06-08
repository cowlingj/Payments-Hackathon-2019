var path = require('path');

module.exports = {
    entry: path.resolve(process.cwd(), 'src', 'main', 'index.js'),
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: 'main.bundle.js'
    },
    target: "node",
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader'
            },
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    stats: {
        colors: true
    },
};