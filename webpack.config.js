const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'materialistic.min.js',
    path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		compress: true,
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	},
	plugins: [
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/
		})
	]
}