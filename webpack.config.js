const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// absolute path disables recursive module resolution, so build a relative one
const nodedir = path.relative(
  process.cwd(),
  path.resolve(process.env.SRCDIR || __dirname, "node_modules")
);

const [mode, devtool] =
  process.env.NODE_ENV === "production"
    ? ["production", "source-map"]
    : ["development", "inline-source-map"];

const output = {
  path: path.resolve(__dirname, "./dist"),
  filename: "main.js",
};

const plugins = [
  // automatically load jquery instead of having to import or require them everywhere
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
  }),
  new MiniCssExtractPlugin(),
];

module.exports = {
  mode,
  entry: "./main.js",
  plugins,
  output,
  devtool,
  externals: { cockpit: "cockpit" },
  resolve: {
    alias: {
      "font-awesome": path.resolve(
        nodedir,
        "font-awesome-sass/assets/stylesheets"
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, "./actions"),
          path.resolve(__dirname, "./components"),
          path.resolve(__dirname, "./core"),
          path.resolve(__dirname, "./pages"),
          path.resolve(__dirname, "./data"),
          path.resolve(__dirname, "./main.js"),
          path.resolve(__dirname, "./App.js"),
        ],
        use: {
          loader: "babel-loader",
        },
      },
      {
        include: [
          path.join(__dirname, "node_modules/react-intl"),
          path.join(__dirname, "node_modules/intl-messageformat"),
          path.join(__dirname, "node_modules/intl-messageformat-parser"),
        ],
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
      /* HACK: remove unwanted fonts from PatternFly's css */
      {
        test: /patternfly-cockpit.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false },
          },
          {
            loader: "string-replace-loader",
            options: {
              multiple: [
                {
                  search:
                    /src:url[(]"patternfly-icons-fake-path\/glyphicons-halflings-regular[^}]*/g,
                  replace:
                    'font-display:block; src:url("../base1/fonts/glyphicons.woff") format("woff");',
                },
                {
                  search:
                    /src:url[(]"patternfly-fonts-fake-path\/PatternFlyIcons[^}]*/g,
                  replace:
                    'src:url("../base1/fonts/patternfly.woff") format("woff");',
                },
                {
                  search:
                    /src:url[(]"patternfly-fonts-fake-path\/fontawesome[^}]*/,
                  replace:
                    'font-display:block; src:url("../base1/fonts/fontawesome.woff?v=4.2.0") format("woff");',
                },
                {
                  search: /src:url\("patternfly-icons-fake-path\/pficon[^}]*/g,
                  replace:
                    'src:url("../base1/fonts/patternfly.woff") format("woff");',
                },
                {
                  search: /@font-face[^}]*patternfly-fonts-fake-path[^}]*}/g,
                  replace: "",
                },
              ],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [
                  // Teach webpack to resolve these references in order to build PF3 scss
                  path.resolve(
                    nodedir,
                    "font-awesome-sass",
                    "assets",
                    "stylesheets"
                  ),
                  path.resolve(nodedir, "patternfly", "dist", "sass"),
                  path.resolve(
                    nodedir,
                    "bootstrap-sass",
                    "assets",
                    "stylesheets"
                  ),
                ],
                outputStyle: "compressed",
                quietDeps: true,
              },
            },
          },
        ],
      },
    ],
  },
};
