const path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bindy.js",
        libraryTarget: 'umd',
        library: 'Bindy'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.js$/,
            loader: 'babel-loader?presets[]=env'
        }]
    }
};