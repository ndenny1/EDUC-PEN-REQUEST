var path = require('path');

module.exports = {
  runtimeCompiler:true,
  configureWebpack: config => {
    config.resolve.alias["vue-mdc-adapter"] = "vue-mdc-adapter/dist/"
  },
  pwa: {
    name: 'EDUC PEN Request',
    themeColor: '#003366',
    msTileColor: '#fafafa'
  },
  chainWebpack: config => {
    config.module
      .rule("scss")
      .oneOf("vue-modules")
      .use("sass-loader")
      .tap(args => {
        args.includePaths = ["./node_modules"]
        return args
      })
  },
  css: {
    loaderOptions: {
      sass: {
        includePaths: [path.resolve(__dirname, "node_modules")],
      },
    },
  }
};
