/* eslint-disable */
const { defineConfig } = require("@vue/cli-service");
const { google } = require("googleapis");
const url = require("url");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
  },
});
