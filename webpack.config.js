const path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bindy.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }]
    }
};