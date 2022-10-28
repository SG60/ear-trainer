import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { withSentryConfig } from '@sentry/svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
			sourceMap: true
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

export default withSentryConfig(config);
