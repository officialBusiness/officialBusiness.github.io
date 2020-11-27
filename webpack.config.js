const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    //设置入口文件，即这个js文件为起点，寻找被调用的模块
	entry: './index.js', 
    //输出文件的相关属性设定
	output: {
    //打包的文件路径
		path: path.join(__dirname, 'webpack'),
    //打包后的文件名
		filename: 'demo.js'
	},
	module: {
		rules: [
			{
				// 命中 CSS 文件
				test: /\.css$/,
				// 排除 node_modules 目录下的文件，防止被打抱
				exclude: path.resolve(__dirname, 'node_modules'),
				// css用来解析css格式，style让css样式在打包的html文件中生效
				use: [
					'style-loader', 'css-loader'
				]
			},
			{
				test: /\.jsx?/,
				// 排除 node_modules 目录下的文件，防止被打抱
				exclude: path.resolve(__dirname, 'node_modules'),
				use: {
					loader: 'babel-loader',
					options: {
						babelrc: false,
						presets: [
							require.resolve('@babel/preset-react'),
							[require.resolve('@babel/preset-env', {module: false})],
						],
					}
				}
			}
		]
	},
	devtool: 'inline-source-map',
	plugins: [
    new HtmlWebpackPlugin({
      title: '博客',
    }),
  ],
	devServer: {
		port: 8081 ,
		contentBase: './webpack',
		// hot: true
	}
}