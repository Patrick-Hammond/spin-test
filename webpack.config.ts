const path = require("path");
const merge = require("webpack-merge").merge;
const terser = require("terser-webpack-plugin");

// plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env: { mode: "development" | "production" }) => {
    const config = {
        entry: "/src/index.ts",
        mode: env.mode,
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: "css-loader"
                },
            ],
        },

        plugins: [
          new HtmlWebpackPlugin(),
          new CopyPlugin(
            {
              patterns: [
                {
                  from: "src/assets",
                  to: "assets"
                },
              ]
            }
        ),
      ],
    };

    const envConfig = env.mode === "development" ? 
    {
      mode: "development",

      devtool: "inline-source-map",

      devServer: {
          open: true,
          client: {
              overlay: {
                  warnings: false,
                  errors: true,
              },
          },
      },

      module: {
          rules: [
              {
                  test: /\.tsx?$/,
                  loader: "ts-loader",
                  exclude: /node_modules/,
              },
          ],
      },

      output: {
          path: path.resolve(__dirname, "dist"),
          filename: "[name].js",
      }
    } : {
      mode: "production",

      module: {
          rules: [
              {
                  // test: /\.(js|jsx|ts|tsx)$/,
                  test: /\.(ts|tsx)$/, //temp fix for imports in config.js
                  use: [
                      {
                          loader: "babel-loader",
                      },
                  ],
                  exclude: /node_modules/,
              },
              {
                  test: /\.tsx?$/,
                  use: "ts-loader",
                  exclude: /node_modules/,
              },
          ],
      },

      output: {
          path: path.resolve(__dirname, "dist"),
          filename: "build.[contenthash].js",
      },

      optimization: {
          minimize: true,
          minimizer: [new terser()],
          splitChunks: false,
      },
  };

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};