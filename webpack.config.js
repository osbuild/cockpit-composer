const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const [mode, devtool] =
  process.env.NODE_ENV === "production"
    ? ["production", "source-map"]
    : ["development", "inline-source-map"];

const output = {
  path: path.resolve(__dirname, "./public"),
  filename: "main.js",
  sourceMapFilename: "[file].map",
};

const plugins = [new MiniCssExtractPlugin()];

module.exports = {
  entry: "./src/App.js",
  output,
  mode,
  devtool,
  plugins,
  externals: { cockpit: "cockpit" },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, "./src")],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false },
          },
        ],
      },
    ],
  },
};
