const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = env => {
	if (!env) env = {};

	let defines = {
		APP_KEY: JSON.stringify('681861617d59c9287a87eec1b7ad495a2a16b28a')
	};

	let mode = 'development';

	if (env.NODE_ENV === 'production') {
		defines = {
			APP_KEY: JSON.stringify('afbca5438a7d9c08b131ec0d89572df0ae26af84')
		};
		mode = 'production';
	}
	return {
		entry: {
			index: './src/ui/index.ts',
			// ui: './src/ui/ui.ts',
			// common: './src/common/common.ts',
		},
		devtool: 'inline-source-map',
		output: {
			path: path.resolve(__dirname, './lib/ui'),
			filename: '[name].js',
			libraryTarget: 'umd',
			library: 'users',
			umdNamedDefine: true
		},
		watch: false,
		resolve: {
			extensions: ['.ts', '.js', '.json', 'vue'],
			// plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, './compile.tsconfig.json') })]
		},
		module:
		{
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.ts?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						appendTsSuffixTo: [/\.vue$/],
						configFile: 'compile.tsconfig.json'
					}
				},
				{
					test: /\.less$/,
					use: [
						{
							loader: 'vue-style-loader',
							options: {
								// convertToAbsoluteUrls: true
							}
						},
						{
							loader: 'css-loader',
							options: { url: false }
						},
						{
							loader: 'less-loader',
							options: {
								relativeUrls: false
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				},
				// {
				// 	test: /\.s(c|a)ss$/,
				// 	use: [
				// 	  'vue-style-loader',
				// 	  'css-loader',
				// 	  {
				// 		loader: 'sass-loader',
				// 		// Requires sass-loader@^7.0.0
				// 		options: {
				// 		  implementation: require('sass'),
				// 		  indentedSyntax: true // optional
				// 		},
				// 		// Requires sass-loader@^8.0.0
				// 		options: {
				// 		  implementation: require('sass'),
				// 		  sassOptions: {
				// 			indentedSyntax: true // optional
				// 		  },
				// 		},
				// 	  },
				// 	],
				//   },
			],
		},
		mode: mode,
		node: {
			__dirname: false
		},
		plugins: [
			new VueLoaderPlugin({
				esModule: false
			}),
			// new VuetifyLoaderPlugin()
		],
		target: 'web'
	};
};