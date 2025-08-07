eslint-disable import/no-commonjs */
const path = require('path')
const pkg = require('../package.json')
const { webpackChain, addAnalyzerPlugin } = require('./utils')
const appRouter = require('../src/app.router.json')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const config = {
    projectName: pkg.name,
    date: '2021-10-27',
    designWidth: 720,
    deviceRatio: {
        640: 2.34 / 2,
        720: 2 / 1.92,
        750: 1,
        828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: `dist-${process.env.TARO_ENV}`,
    plugins: ['@fta/plugins-platform-mw', '@fta/plugin-platform-thresh'],
    env: {
        CODE_ENV: `"${process.env.CODE_ENV}"`,
    },
    defineConstants: {},
    compiler: {
        type: 'webpack5',
        // 依赖预编译配置
        prebundle: {
            enable: true,
            timings: true,
            exclude: ['@fta/components', '@fta/apis-track', 'react', 'react-dom'],
        },
    },
    cache: {
        enable: true,
    },
    // fix safari 10 特定语法问题 [terser](https://github.com/terser/terser#minify-options)
    terser: {
        enable: true,
        config: {
            safari10: true,
        },
    },
    isWatch: process.env.NODE_ENV === 'development',
    framework: 'react',
    reactJsxRuntime: 'classic',
    alias: {
        '@fta': path.resolve(__dirname, '../node_modules/@fta'),
        '@/': path.resolve(__dirname, '../src/'),
        src: path.resolve(__dirname, '../src/'),
    },
    mini: {
        miniCssExtractPluginOption: {
            ignoreOrder: true,
        },
        postcss: {
            pxtransform: {
                enable: true,
                config: {},
            },
            url: {
                enable: true,
                config: {
                    limit: 1024, // 设定转换尺寸上限
                },
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css三角形2.html modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        resolve: {
            include: ['@fta'],
        },
        webpackChain,
    },
    resolve: {
        include: ['@fta'],
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        devServer: {
            allowedHosts: ['web.amh-group.com'],
            proxy: {
                '/ymm-userCenter-app': {
                    target: 'https://dev.ymm56.com', // 服务端地址
                    pathRewrite: {},
                    secure: false,
                    changeOrigin: true,
                },
            },
        },
        postcss: {
            autoprefixer: {
                enable: true,
                config: {},
            },
            pxtransform: {
                enable: true,
                config: {},
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css三角形2.html modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        resolve: {
            include: ['@fta'],
        },
        webpackChain,
    },
    mw: {
        mw: 'mirco-web',
        devServer: {
            allowedHosts: ['web.amh-group.com'],
            proxy: {
                '/xxx-xxx': {
                    target: 'https://dev.ymm56.com', // 服务端地址
                    pathRewrite: {},
                    secure: false,
                    changeOrigin: true,
                },
            },
        },
        router: {
            mode: 'multi',
        },
        resolve: {
            include: ['@fta'],
        },
        postcss: {
            cssModules: {
                enable: true, // 默认为 false，如需使用 css三角形2.html modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                },
            },
        },
        webpackChain,
    },
    thresh: {
        appName: 'thresh',
        withoutUserInfoJustInitAppInfo: true,
        postcss: {
            cssModules: {
                enable: true, // 默认为 false，如需使用 css三角形2.html modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                    test: 1,
                },
            },
        },
        enableMultipleClassName: true,
        enableHotReload: true,
        enableCareMode: true,
        enableSourceMap: false,
        resolve: {
            include: ['@fta'],
        },
        router: { customRoutes: appRouter.customRoutes },
        nativeComponents: {
            externals: ['@fta'],
            output: 'dist-thresh-comp',
        },
        webpackChain(chain) {
            addAnalyzerPlugin(chain, {
                reportFilename: `bundle_analyzer.html`,
            })
            chain.plugin('LodashModuleReplacementPlugin').use(LodashModuleReplacementPlugin)
        },
        useES2020: false,
        enableEsbuildMinimize: false,
    },
}

if (process.env.TARO_ENV === 'thresh') {
    config.alias['react-redux'] = path.resolve(
        __dirname,
        '../node_modules/react-redux/es/alternate-renderers.js'
    )
}

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'))
    }
    return merge({}, config, require('./prod'))
}