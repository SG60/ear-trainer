import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv, defineConfig } from 'vite';

import vitePluginSentry from 'vite-plugin-sentry-upload';

/** Vite Config */
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [
			sveltekit(),

			vitePluginSentry({
				url: 'https://sentry.io',
				org: 'sam-greening',
				project: 'ear-trainer',
				authToken: env.PRIVATE_SENTRY_CLI_AUTH_TOKEN
					? env.PRIVATE_SENTRY_CLI_AUTH_TOKEN
					: undefined,

				deploy: {
					env: env.PUBLIC_SENTRY_ENVIRONMENT
				},
				sourceMaps: {
					include: ['./.vercel/output']
				},
				setCommits: {
					auto: true,
					ignoreMissing: true
				},

				silent: true
			})
		],

		build: { sourcemap: true }
	};
});
