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
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除dist文件夹
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 用于压缩css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 处理、打包css文件 功能类似style-loader
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 压缩js文件
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; //打包分析报表及优化总结
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map", //开启调试
  mode: "development", // mode 模式只有 development和production两种，需使用插件在打包时替换process.env.NODE_ENV
  entry: ["babel-polyfill", path.resolve(__dirname, "../src/main.js")],
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "../dist") //output.filename必须是绝对路径，如果是一个相对路径，打包时webpack会抛出异常。
  },
  devServer: {
    hot: true,
    open: true,
    port: 3009,
    contentBase: path.join(__dirname, "../dist"), //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true //实时刷新
    /*proxy: { // 设置代理
    "/api": {
      target: "http://localhost:3000",
      pathRewrite: {"^/api" : ""}
    }
  },
   before: function(app) {
          apiMocker(app, path.resolve('public/mocker.js'));
   },

  */
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], //在import的时候，可以省略后缀
    alias: {
      "@": path.resolve(__dirname, "../src/"),
      assets: path.resolve(__dirname, "../src/assets/")
    }
  },
  externals: {
    //暴露全局变量
    jquery: "jQuery"
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      date: new Date(),
      // options配置
      title: "123",
      filename: "index.html",
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        /*options:{sourceMap:true},*/
        use: ["css-loader"]
      },
      {
        test: /\.less$/,
        /*options:{sourceMap:true},*/
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: "imgs/[name].[contenthash:5].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/, //排除某些文件：在编译时，不去处理node_modules下面的文件
        use: ["ts-loader"]
      }
    ]
  }
};
