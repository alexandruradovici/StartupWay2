const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
	if (!env) env = {};

	let defines = {
		APP_KEY: JSON.stringify("681861617d59c9287a87eec1b7ad495a2a16b28a")
	};

	let mode = "development";

	if (env.NODE_ENV === "production") {
		defines = {
			APP_KEY: JSON.stringify("afbca5438a7d9c08b131ec0d89572df0ae26af84")
		};
		mode = "production";
	}
	return {
		entry: {
			index: "./src/ui/index.ts"
		},
		devtool: "inline-source-map",
		output: {
			path: path.resolve(__dirname, "./lib/ui"),
			filename: "[name].js",
			libraryTarget: "umd",
			library: "startupway",
			umdNamedDefine: true
		},
		watch: false,
		resolve: {
			extensions: [".ts", ".js", ".json"],
		},
		module:
		{
			rules: [
				{
					test: /\.css$/,
        			use: ["style-loader", "css-loader"],
				},
				{
					test: /\.less$/,
					use: [
						{
							loader: "vue-style-loader",
							options: {
								// convertToAbsoluteUrls: true
							}
						},
						{
							loader: "css-loader",
							options: { url: false }
						},
						{
							loader: "less-loader",
							options: {
								relativeUrls: false
							}
						}
					]
				},
			],
		},
		mode: mode,
		node: {
			__dirname: false
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: "StartupWay",
				template: path.resolve(__dirname, "src/ui/index.html"),
				favicon: path.resolve(__dirname, "src/ui/favicon.ico")
			})
		],
		target: "web"
	};
};