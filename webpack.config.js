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
        test: /\.scss/, //配置sass转css
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
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
	// devtool: 'source-map',
	plugins: [
    new HtmlWebpackPlugin({
      title: '轮回的博客',   //生成的页面标题
      // filename:'index.html',  //webpack-dev-server在内存中生成的文件名称，自动将build注入到这个页面底部，
      // template:'index.html',  //根据index.html这个模版来生成（这个文件请程序员自己生成）
    })
  ],
	devServer: {
		port: 8081 ,
		contentBase: path.resolve(__dirname, 'node_modules'),
		hot: true,
	},
	performance: {
    maxEntrypointSize: 1024*1024*8,
    maxAssetSize: 1024*1024*8,
  }
}