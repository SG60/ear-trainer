/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('@tailwindcss/forms')],

	corePlugins: {
		preflight: false // disable preflight, using styles/base.css instead
	}
};

module.exports = config;
