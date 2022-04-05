const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './npm/src/SignaturePad.js',
    output: {
        path: path.resolve(__dirname, './wwwroot/'),
        filename: 'SignaturePad.min.js',
        sourceMapFilename: 'SignaturePad.js.map',
    }
};