const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
require("dotenv").config();

module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  target: "web",
  cache: true,
  entry: {
    app: path.resolve(__dirname, "app", "index.tsx"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@pages": path.resolve(__dirname, "app/src", "pages"),
      "@hooks": path.resolve(__dirname, "app/src", "hooks"),
      "@components": path.resolve(__dirname, "app/src/pages", "components"),
      "@css": path.resolve(__dirname, "app/src/assets", "css"),
      "@config": path.resolve(__dirname, "app/src/config"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(css|sass)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new DotEnv({
      path: path.resolve(__dirname, ".env"),
      safe: true,
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, "build", "vendor-manifest.json"),
    }),
  ],
  devServer: {
    port: process.env.WEB_PORT,
    historyApiFallback: true,
    hot: true,
    liveReload: true,
    compress: true,
    client: {
      progress: false,
      logging: "none",
    },
  },
};
