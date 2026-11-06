import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";

const root = path.dirname(fileURLToPath(import.meta.url));

export default function webpackConfig(_env, argv) {
  const production = argv.mode === "production";
  return {
    entry: "./src/app.js",
    output: {
      path: path.resolve(root, "dist"),
      filename: production ? "app.[contenthash].js" : "app.js",
      publicPath: "/",
      clean: true,
    },
    devtool: production ? false : "eval-source-map",
    devServer: {
      host: "127.0.0.1",
      port: 3000,
      historyApiFallback: false,
      static: [
        {
          directory: path.resolve(root, "brand"),
          publicPath: "/brand",
        },
        {
          directory: path.resolve(root, "public"),
          publicPath: "/",
        },
      ],
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [production ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        template: "./src/404.html",
        filename: "404.html",
      }),
      new CopyPlugin({
        patterns: [
          { from: "brand/lockups", to: "brand/lockups" },
          { from: "public", to: "." },
        ],
      }),
      ...(production ? [new MiniCssExtractPlugin({ filename: "style.[contenthash].css" })] : []),
    ],
  };
}
