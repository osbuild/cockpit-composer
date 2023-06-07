import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const [mode, devtool] =
  process.env.NODE_ENV === "production"
    ? ["production", "source-map"]
    : ["development", "inline-source-map"];

const output = {
  path: path.resolve("public"),
  filename: "main.js",
  sourceMapFilename: "[file].map",
};

const plugins = [new MiniCssExtractPlugin()];

const config = {
  entry: "./src/App.js",
  output,
  mode,
  devtool,
  plugins,
  externals: { cockpit: "cockpit" },
  resolve: {
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve("src")],
        use: {
          loader: "babel-loader",
        },
        resolve: { fullySpecified: false },
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

export default config;
