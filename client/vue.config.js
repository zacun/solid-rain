module.exports = {
  devServer: {
    port: 9000,
  },
  publicPath: "/",
  pwa: {
    manifestOptions: {
      name: "Solid Rain",
      short_name: "SR",
      start_url: process.env.VUE_APP_BASE_URL,
      display: "standalone",
      themeColor: "#4DBA87",
      icons: [
        {
          src: "/img/meteors-icon-192x192.jpg",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/img/meteors-icon-512x512.jpg",
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    },
    name: "Solid Rain",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/sw.js",
    },
  },
  configureWebpack: {},
};
