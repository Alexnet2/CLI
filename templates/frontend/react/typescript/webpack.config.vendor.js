var webpack = require("webpack");
var path = require("path");
module.exports = {
  mode: "production",
  entry: {
    vendor: [
      "react",
      "react-router-dom",
      "react-dom",
      "moment",
    ],
  },
  output: {
    filename: "vendor.bundle.js",
    path: path.resolve(__dirname, "build"),
    library: "[name]_dll",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "build", "[name]-manifest.json"),
      name: "[name]_dll",
      context: path.resolve(__dirname, "src"),
    }),
  ],
};
