const path = require('path');
const nodeExternals = require('webpack-node-externals');
const package_json = require('./package.json');

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
			index: './src/server/index.ts',
			// server: './src/server/server.ts',
		},
		devtool: 'inline-source-map',
		output: {
			path: path.resolve(__dirname, './lib/server'),
			filename: '[name].js',
			libraryTarget: 'umd',
			library: 'users',
			umdNamedDefine: true
		},
		resolve: {
			extensions: ['.ts', '.js', '.json'],
		},
		module:
		{
			rules: [
				{
					test: /\.ts?$/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								//transpileOnly: true
								configFile:'compile.tsconfig.json'
							}
						}
					],
					exclude: /node_modules/
				},
			],
		},
		externals: [nodeExternals({
			whitelist: [...Object.keys(package_json.devDependencies)]
		})],
		mode: mode,
		node: {
			__dirname: false
		},
		target: 'node'
	};
};