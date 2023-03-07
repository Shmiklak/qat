const { entry, output, rules, plugins } = require('./webpack.base.config');

const config =  {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    entry,
    output,
    module: {
        rules: [
            ...rules,
        ],
    },
    plugins,
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js',
        },
    },
    devServer: {
        hot: true,
        proxy: {
            '/': 'http://localhost:3001',
        },
        client: {
            webSocketURL: {
              hostname: "0.0.0.0",
              pathname: "/http",
              port: 8080,
            },
          },
        devMiddleware: {
            publicPath: './public',
            stats: 'minimal',
        }
    },
};

module.exports = config;
