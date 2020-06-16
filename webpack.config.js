const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: "./public/assets/index.js",
    offline: "./public/assets/indexedDB.js",
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].bundle.js",
  },
  // currently in development
  mode: "development",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  
  plugins: [
    new WebpackPwaManifest({
      // the name of the generated manifest file
      filename: "manifest.json",
      inject: false,
      // set fingerprints to `false` to make the names of the generated
      // files predictable making it easier to refer to them in our code
      fingerprints: false,

      name: " Online/Offline Budget Trackers app",
      short_name: "Budget",
      description:
        "An application that allows you to add expenses and deposits to your budget with or without a connection.",
      background_color: "#ffffff",
      theme_color: "#000000",
      start_url: "/",
      display: "standalone",

      icons: [
        {
          src: path.resolve("./public/assets/icons/icon-192x192.png"),
          sizes: [48,72,96, 120,128, 144,152, 180, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],
};

module.exports = config;
