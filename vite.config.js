import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [sveltekit(), sentryUploadPlugin(env.PUBLIC_SENTRY_ENVIRONMENT)],
		build: { sourcemap: true }
	};
});

import { loadEnv } from 'vite';

/** @type {(environment: string) => import('vite').Plugin} */
function sentryUploadPlugin(sentryEnvironment) {
	return {
		name: 'sentry-upload',
		apply: 'build',
		writeBundle(options, bundle) {
			// upload sourcemaps to sentry
			console.log('uploading sourcemaps to sentry');
			console.log(`environment: ${sentryEnvironment}`);
		}
	};
}
