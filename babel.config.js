
module.exports = {
  presets: [
    '@quasar/babel-preset-app',
    {
      modules: false,
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8', 'ie >= 11']
      }
    }
  ]
}
