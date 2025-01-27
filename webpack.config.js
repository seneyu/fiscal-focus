const path = require('path');

module.exports = {
  mode: 'development',
  entry: './client/src/index.jsx',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './client/public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: path.resolve(__dirname, './client/public'),
    historyApiFallback: true,
    open: true, // automatically open browser
    port: 8080,
    compress: true,
    hot: true,
  },
  devtool: 'source-map', // helps with debugging
};
