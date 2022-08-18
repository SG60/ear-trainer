const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const tailwindcssnesting = require('tailwindcss/nesting');
const postcss_import = require('postcss-import');

const config = {
	plugins: [
		postcss_import,
		tailwindcssnesting,
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer
	]
};

module.exports = config;
