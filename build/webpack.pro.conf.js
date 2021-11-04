/**
 * @author zhangjunling
 * @date 2020/9/2/0002 17:28
 */
const path = require("path");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const common = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");// 清除dist文件夹
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");// 用于压缩css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 处理、打包css文件 功能类似style-loader
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");// 压缩js文件
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; //打包分析报表及优化总结

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        // 将引入的第三方库文件单独打包
        splitChunks: {
            // 所有引入的文件都打包
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_module[\\/]/,
                    priority: -10,
                    chunks: 'initial'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        // 使用MiniCssExtractPlugin.loader替代style-loader
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 解决图片路径不对的问题
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: 'imgs/[name].[contenthash:5].[ext]'
                        }
                    },
                    {
                        // 对图片进行压缩处理，配置项参考官方文档
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            webp: {
                            quality: 75
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin("注释内容"), //内置的 BannerPlugin 插件，用于在文件头部输出一些注释信息
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: {
                // 压缩选项
                caseSensitive: false, //是否大小写敏感
                collapseBooleanAttributes: true, //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
                collapseWhitespace: true, //是否去除空格
                removeComments: true, // 移除注释
                removeAttributeQuotes: true, // 移除双引号
                showErrors: true // showErrors 的作用是，如果 webpack 编译出现错误，webpack会将错误信息包裹在一个 pre 标签内，属性的默认值为 true
            }
        }),
        new UglifyJsPlugin({
            //压缩js
            cache: true, //当js无变化则不压缩
            parallel: true, //是否启用并行压缩
            sourceMap: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../src/assets"),
                    to: path.resolve(__dirname, "../dist/assets")
                }
            ],
            options: {}
        }),
        /*new BundleAnalyzerPlugin(),*/
        new OptimizeCssAssetsPlugin({}), //压缩css
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:5].css'
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    // 去除debugger和console
                    drop_debugger: true,
                    drop_console: true,
                    warnings:false
                }
            },
            cache: true,
            parallel: true,
            sourceMap: false
            //sourceMap: config.build.productionSourceMap,
        })
    ]
});