const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  addWebpackAlias
} = require("customize-cra");

const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname + "/src")
  }),
  addDecoratorsLegacy(),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  })
);
