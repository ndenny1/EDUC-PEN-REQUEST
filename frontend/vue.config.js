module.exports = {
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  },
  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/test/'
};
