import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv, defineConfig } from 'vite';
import type { Plugin } from 'vite';

import type { SentryCliOptions, SentryCliReleases } from '@sentry/cli';
import SentryCli from '@sentry/cli';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [
			sveltekit(),
			sentryUploadPlugin({ sentryEnvironment: env.PUBLIC_SENTRY_ENVIRONMENT })
		],
		build: { sourcemap: true }
	};
});

interface ViteSentryPluginOptions extends SentryCliOptions /*, SentryCliReleases*/ {
	sentryEnvironment: string;
	release?: string;
}

async function sentryUploadPlugin(options: ViteSentryPluginOptions): Promise<Plugin> {
	const virtualModuleId = 'virtual:sentry-upload';
	const resolvedVirtualModuleId = '\0' + virtualModuleId;

	/* Initialise new SentryCli instance */
	const cli = new SentryCli(undefined, {
		authToken: options.authToken,
		org: options.org,
		project: options.project,
		url: options.url,
		vcsRemote: options.vcsRemote
	});

	const currentRelease = await getReleasePromise(cli, options);

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
				return `export const release = "${currentRelease}";`;
			}
		},

		/* Sentry stuff */
		async closeBundle() {
			if (!currentRelease) {
				this.warn('No release found, skipping Sentry upload');
			} else {
				// upload sourcemaps to sentry
				console.log('uploading sourcemaps to sentry (FAKE)');
				console.log(`environment: ${options.sentryEnvironment}`);
				console.log(`currentRelease: ${currentRelease}`);
			}
		}
	};
}

/* Prepare sentry release and returns promise */
const getReleasePromise = (
	cli: SentryCli,
	options: {
		/*
		Unique name for release
		defaults to sentry-cli releases propose version (requires access to GIT and root directory to be repo)
		*/
		release?: string;
	} = {}
) => {
	return (options.release ? Promise.resolve(options.release) : cli.releases.proposeVersion())
		.then((version: string) => `${version}`.trim())
		.catch(() => undefined);
};
