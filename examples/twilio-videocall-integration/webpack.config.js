const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {VueLoaderPlugin} = require("vue-loader");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const DefinePlugin = require('webpack').DefinePlugin;

const toExclude = [/node_modules/];

module.exports = (env, options = {}) => {
  const development = ((env || {}).mode || options.mode || "development") === "development";
  const publicPath = (env || {}).publicPath || "";

  return {
    mode: development ? "development" : "production",
    context: __dirname,
    devtool: development ? "inline-sourcemap" : false,
    entry: {
      main: "./app/index.js",
    },
    optimization: {
      minimize: !development,
    },
    output: {
      path: path.join(__dirname, "dist/"),
      filename: "[name].[chunkhash].js",
      chunkFilename: "[name].[chunkhash].js",
      publicPath: publicPath,
    },
    plugins: [
      new DefinePlugin({
        LANG: JSON.stringify((env || {}).lang || "IT")
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "app/index.html",
        title: "VideoCall",
        chunks: ["main"],
      }),
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ["dist"],
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
    },
    resolve: {
      alias: {
        vue: "vue/dist/vue.min.js",
      },
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          use: "eslint-loader",
          exclude: toExclude,
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/,
          use: ["vue-style-loader", {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          }],
        },
        {
          test: /\.scss$/,
          use: ["vue-style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.mp3$|\.m4v$|\.ogv$|\.webm$|\.mp4$|\.wav$|\.ogg$/,
          use: {
            loader: "file-loader",
            options: {
              esModule: false,
            },
          },
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.svg$$/,
          use: [
            {
              loader: "file-loader",
              options: {
                esModule: false,
                name: "[contenthash].[name].[ext]",
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                disable: development,
              },
            },
          ],
        },
        {
          test: /\.woff$|\.eot$|\.ttf$|\.woff2$$/,
          use: {
            loader: "file-loader",
            options: {
              esModule: false,
            },
          },
        },
      ],
    },
  };
};
