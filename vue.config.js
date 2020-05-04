module.exports = {
  configureWebpack: {
    output: {
      filename: "[name].[hash:8].js"
    }
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/style.scss";`
      }
    }
  }
};
