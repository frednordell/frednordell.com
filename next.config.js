// next Js config
const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");
const path = require("path");
const fs = require("fs");
const WebpackBar = require("webpackbar");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = withPlugins([optimizedImages], {
  webpack(config) {
    //Absolute imports paths
    const ROOT_DIR = process.cwd();

    const directories = fs
      .readdirSync(ROOT_DIR, { withFileTypes: true })
      // Disregard hidden folders
      .filter((file) => file.isDirectory() && file.name[0] !== ".")
      .map((file) => file.name);

    directories.forEach((directory) => {
      config.resolve.alias[directory] = path.join(__dirname, directory);
    });

    config.plugins.push(
      new WebpackBar({
        fancy: true,
        profile: true,
        basic: false,
      })
    );

    config.module.rules.push({
      test: /\.(pdf|md|ico)$/,
      loaders: [
        {
          loader: "file-loader",
          options: {},
        },
      ],
    });

    /* config.module.rules.push({
      test: /\.(png|jpe?g)$/,
      use: [
        {
          loader: "image-trace-loader",
          options: {
            // publicPath: "/_next/",
            // outputPath: "static/",
          },
        },
        {
          loader: "webp-loader",
        },
        {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            //base64: true,
            //palette: true,
            //publicPath: "/_next/",
            //outputPath: "static/",
          },
        },
      ],
    }); */

    return config;
    //return smp.wrap(config);
  },
});
