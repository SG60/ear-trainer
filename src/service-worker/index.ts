/// <reference lib="webworker"/>

import { build, files, prerendered, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = `cache${version}`;

/** 'build' files and all static files from 'files' */
const files_to_cache = build.concat(files, prerendered);

/**
 * Takes care of the installation of the service worker, as well as the creation of the cache.
 */
worker.addEventListener('install', (event) => {
	console.info('Installing Service Worker');
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(files_to_cache))
			.then(() => worker.skipWaiting())
	);
});

worker.addEventListener('activate', (event) => {
	console.info('Activating Service Worker');
	// when this SW becomes activated, we claim all the opened clients
	// they can be standalone PWA windows or browser tabs
	event.waitUntil(
		(async function () {
			// Feature-detect
			if (worker.registration.navigationPreload) {
				// Enable navigation preloads!
				await worker.registration.navigationPreload.enable();
			}
			caches.keys().then((keys) => {
				keys.forEach(async (key) => {
					// delete old caches
					if (key !== CACHE_NAME) await caches.delete(key);
				});
				worker.clients.claim();
			});
		})()
	);
});

/**
 * Intercepts requests made by the page so we can decide what to do with each one.
 */
worker.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	// Don't run if we can't handle the request
	if (
		event.request.method !== 'GET' ||
		event.request.headers.has('range') ||
		!url.protocol.startsWith('http') ||
		(!files_to_cache.includes(url.pathname) && event.request.cache === 'only-if-cached') ||
		url.host.includes('supabase')
	)
		return;

	// Fetch from the network unless the user is offline
	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);

			// Use the preloaded response, if it's there
			try {
				const preloaded_response = await event.preloadResponse;
				if (preloaded_response) return preloaded_response;
			} catch {} // eslint-disable-line no-empty

			try {
				const response = await fetch(event.request);
				cache.put(event.request, response.clone());
				return response;
			} catch (e) {
				const response = await cache.match(event.request);
				if (response) return response;
				else if (!url.pathname.endsWith('.json')) {
					let count = 0;
					for (const i of url.pathname) {
						if (i === '/') count++;
					}
					console.log('/fallback'.repeat(count));
					return await cache.match('/fallback'.repeat(count));
				}

				throw e;
			}
		})()
	);
});
