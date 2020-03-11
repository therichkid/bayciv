const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new CompressionPlugin()]
  }
};
