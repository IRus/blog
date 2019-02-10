const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = function (options = {}) {
  // Settings
  // --env.NODE_ENV root --env.SOURCE_MAP source-map ...
  const NODE_ENV = options.NODE_ENV || "development"; // "production"
  const SOURCE_MAP = options.SOURCE_MAP || "eval-source-map"; // "source-map"

  console.log(`
Build started with following configuration:
===========================================
→ NODE_ENV: ${NODE_ENV}
→ SOURCE_MAP: ${SOURCE_MAP}
`);

  const publicPath = "";
  const limit = 6 * 1024;

  return {
    entry: {
      app: [
        path.resolve(__dirname, "app", "app.ts")
      ]
    },
    output: {
      path: path.resolve(__dirname, "..", "themes", "irus", "static"),
      filename: "[name].js?[contentHash]",
      publicPath
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    bail: false,
    devtool: SOURCE_MAP,
    module: {
      rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }, {
        test: /\.s[ac]ss/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: "css-loader"
        }, {
          loader: "postcss-loader",
          options: {
            plugins: function () {
              return [
                autoprefixer
              ];
            }
          }
        }, {
          loader: "sass-loader",
          options: {
            implementation: require("dart-sass")
          }
        }]
      }, {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: "css-loader"
        }, {
          loader: "postcss-loader",
          options: {
            plugins: function () {
              return [
                autoprefixer
              ];
            }
          }
        }]
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit,
          publicPath,
          name: "/images/[name].[ext]?[hash]"
        }
      }, {
        test: /\.svg$/,
        loader: "url-loader",
        options: {
          limit,
          mimetype: "image/svg+xml",
          publicPath,
          name: "/fonts/[name].[ext]?[hash]"
        }
      }, {
        test: /\.woff$/,
        loader: "url-loader",
        options: {
          limit,
          mimetype: "application/font-woff",
          publicPath,
          name: "/fonts/[name].[ext]?[hash]"
        }
      }, {
        test: /\.woff2$/,
        loader: "url-loader",
        options: {
          limit,
          mimetype: "application/font-woff2",
          publicPath,
          name: "/fonts/[name].[ext]?[hash]"
        }
      }, {
        test: /\.[ot]tf$/,
        loader: "url-loader",
        options: {
          limit,
          mimetype: "application/octet-stream",
          publicPath,
          name: "/fonts/[name].[ext]?[hash]"
        }
      }, {
        test: /\.eot$/,
        loader: "url-loader",
        options: {
          limit,
          mimetype: "application/vnd.ms-fontobject",
          publicPath,
          name: "/fonts/[name].[ext]?[hash]"
        }
      }]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    plugins: createListOfPlugins({NODE_ENV}),
    devServer: {
      stats: {
        chunkModules: false,
        colors: true
      },
      historyApiFallback: true,
      inline: false
    }
  }
};

function createListOfPlugins({NODE_ENV}) {
  return [
    new MiniCssExtractPlugin({
      filename: "[name].css?[contentHash]",
      chunkFilename: "[id].css?[contentHash]"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({
        filename: "../layouts/partials/assets.gohtml",
        template: "app/assets.ejs",
        inject: false
    })
  ];
}
