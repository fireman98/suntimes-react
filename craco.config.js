const path = require('path');
module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    plugins: [
        {
            plugin: require('craco-plugin-scoped-css'),
        },
    ],
};