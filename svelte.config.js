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
		adapter: createAdapter(),
		alias: {
			$components: 'src/lib/components'
		},
		serviceWorker: { register: false }
	}
};

export default withSentryConfig(config);

/** @type {() => import('@sveltejs/kit').Adapter} */
function createAdapter() {
	const vercelAdapter = adapter({ edge: true });

	return {
		name: vercelAdapter.name,
		adapt: function (builder) {
			vercelAdapter.adapt(builder);
			//
			// builder.writePrerendered(`.vercel/output/static${builder.config.kit.paths.base}`, {
			// 	fallback: 'spa-fallback4.html'
			// });

			// Copy the fallback.html file (used by offline mode)
			// builder.copy(
			// 	`${config.kit.outDir || '.svelte-kit'}/output/prerendered/fallback.html`,
			// 	'.vercel/output/static/fallback.html'
			// );
			// builder.copy(
			// 	`${config.kit.outDir || '.svelte-kit'}/output/prerendered/fallback.html`,
			// 	'.vercel/output/static/fallback.html'
			// );
		}
	};
}
