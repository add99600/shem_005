module.exports = {
  module: {
    rules: [
      // First Rule
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: ["babel-loader"],
      },

      // Second Rule
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localsConvention: "camelCase",
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
