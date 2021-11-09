// next Js config
const path = require("path");
const fs = require("fs");
const WebpackBar = require("webpackbar");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = {
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

    return config;
    //return smp.wrap(config);
  },
};
