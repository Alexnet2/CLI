const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");

module.exports = {
  entry: "./index.ts",
  mode: "production",
  devtool: "inline-source-map",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.join(__dirname, "node_modules")],
    alias: {
    },
  },
  optimization: {
    sideEffects: false,
    emitOnErrors: true,
    concatenateModules: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: "all",
          test: /node_modules/,
          name: "vendor",
        },
        common: {
          name: "commons",
          chunks: "async",
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
};
