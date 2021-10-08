import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import commonjs from '@rollup/plugin-commonjs';
import typescript from "rollup-plugin-typescript2";
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-css-only';
import scss from 'rollup-plugin-scss';
import fs from "fs";

function rename() {
	return {
		name: 'rename',
		writeBundle() {
			fs.renameSync('lib/index.js', 'lib/ui/index.js');
		}
	};
}

export default {
	input: 'src/ui/index.ts',
	output: {
		dir: 'lib'
	},
	plugins: [
		rename(),
		scss(),
		vue({
			css: true
		}),
		image(),
		commonjs(),
		typescript({
			tsconfig: 'compile.tsconfig.json',
			tsconfigOverride: {
				compilerOptions: {
					module: 'esnext',
				},
				include: ['src/ui', 'src/common']
			}
		}),
		css({ output: true }),
	],
};
