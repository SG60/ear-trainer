import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import * as Sentry from '@sentry/svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
			sourceMap: true
		}),
		Sentry.componentTrackingPreprocessor({
			// Add the components you want to be tracked to this array.
			// Specify `true` to track all components or `false` to disable
			// tracking entirely
			// (defaults to `true`)
			// trackComponents: ['Navbar', 'PrimaryButton', 'LoginForm'],
			trackComponents: true,
			// To disable component initialization spans, set this to `false`.
			// (defaults to `true`)
			trackInit: true,
			// To disable component update spans, set this to `false`
			// (defaults to `true`)
			trackUpdates: false
		})
	],

	compilerOptions: {
		enableSourcemap: true
	},

	kit: {
		adapter: adapter({ edge: true }),
		alias: {
			$components: 'src/lib/components'
		}
	}
};

export default config;
