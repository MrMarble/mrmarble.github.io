const path = require("path");

const AssetsPlugin = require("assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: { import: "./src/js/main.ts" },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  externals: {
    fs: "fs",
    crypto: "crypto",
    path: "path",
  },
  output: {
    path: path.join(__dirname, "static", "js"),
    filename: "[name].[contenthash].js",
    publicPath: "/js/",
  },

  resolve: {
    alias: {
      three: path.resolve("./node_modules/three"),
    },
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js"],
  },

  plugins: [
    new AssetsPlugin({
      filename: "webpack_assets.json",
      path: path.join(__dirname, "data"),
      prettyPrint: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/three/examples/js/libs/draco/gltf",
          globOptions: { ignore: ["**/draco_encoder.js"] },
          to: "gltf",
        },
      ],
    }),
  ],
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
