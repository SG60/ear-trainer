import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv, defineConfig } from 'vite';
import type { Plugin } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [sveltekit(), sentryUploadPlugin(env.PUBLIC_SENTRY_ENVIRONMENT)],
		build: { sourcemap: true }
	};
});

function sentryUploadPlugin(sentryEnvironment: string): Plugin {
	const virtualModuleId = 'virtual:sentry-upload';
	const resolvedVirtualModuleId = '\0' + virtualModuleId;

	return {
		name: 'sentry-upload',
		enforce: 'post',
		apply: 'build',

		/* Virtual module stuff */
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				return `export const release = "release from virtual module"`;
			}
		},

		/* Sentry stuff */
		closeBundle() {
			const currentRelease = await getReleasePromise(cli, options);

			// upload sourcemaps to sentry
			console.log('uploading sourcemaps to sentry');
			console.log(`environment: ${sentryEnvironment}`);
		}
	};
}

async function getReleasePromise(cli, options) {
	return null;
}
