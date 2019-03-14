const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  addWebpackAlias
} = require('customize-cra');

const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname + '/src')
    // components: path.resolve(__dirname + '/src/components'),
    // sagas: path.resolve(__dirname + '/src/sagas'),
    // reducers: path.resolve(__dirname + '/src/reducers'),
    // actions: path.resolve(__dirname + '/src/actions'),
    // layouts: path.resolve(__dirname + '/src/layouts')
  }),
  addDecoratorsLegacy(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  })
);
