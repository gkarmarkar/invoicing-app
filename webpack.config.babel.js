import webpack  from 'webpack';
import path     from 'path';

const assetsDir       = path.resolve(__dirname, 'public/assets');
const nodeModulesDir  = path.resolve(__dirname, 'node_modules');

let config = {
  entry: [
    path.resolve(__dirname, 'views/app/index')
  ],
  output: {
    path: assetsDir,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.js?$/,
      loader: 'babel-loader',
      exclude: [nodeModulesDir]
    },
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [nodeModulesDir]
    }, {
      test: /\.scss$/,
      loader: 'sass-loader'
    }, {
      test: /\.css$/,
      loader: 'css-loader'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
      loader: 'url?limit=100000@name=[name][ext]'
    }]
  },
  plugins: [
    getImplicitGlobals()
  ]
};

function getImplicitGlobals() {
  return new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  });
}

export default config;