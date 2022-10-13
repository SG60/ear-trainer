<script context="module">
	import { navigating } from '$app/stores';

	import * as Sentry from '@sentry/svelte';
	import { BrowserTracing } from '@sentry/tracing';
	import { PUBLIC_SENTRY_ENVIRONMENT } from '$env/static/public';

	import { release } from 'virtual:sentry-upload';
</script>

<script lang="ts">
	import PageNavigationIndicator from '$components/PageNavigationIndicator.svelte';
	import '../app.css';
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';

	/** @type{import('./$types').LayoutData} */
	export let data: LayoutData;

	supabase.auth.getSession().then((promise) => user.set(promise.data.session?.user ?? undefined));
	supabase.auth.onAuthStateChange((_, session) => {
		if (session?.user) {
			user.set(session.user);
		}
	});

	if (browser) {
		Sentry.init({
			dsn: 'https://3ea9767fb4b945a98effa7c4b49d2ee3@o1154464.ingest.sentry.io/6661120',
			integrations: [new BrowserTracing()],
			environment: PUBLIC_SENTRY_ENVIRONMENT,

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0,

			release
		});
	}
</script>

{#if $navigating}
	<PageNavigationIndicator />
{/if}
<header class="mb-20 pt-20 shadow">
	<a href="/"><h1 class="text-center text-5xl hover:underline">Ear Trainer</h1></a>

	<nav class="my-8 flex flex-wrap justify-center">
		{#each data.pages as page}
			<a
				href={page}
				class="m-1 bg-lime-100/50 p-2 hover:bg-lime-300 hover:underline"
				data-sveltekit-prefetch
			>
				{page}
			</a>
		{/each}
	</nav>
</header>

<slot />

<div class="grow" />
<footer class="mt-20 bg-slate-50 py-8">
	<p class="text-center">
		{#if !browser}
			loading login info...
		{:else if $user}
			<a href="/account">Logged in as {$user.email}</a>
		{:else}
			<a href="/account/login">Log in</a>
		{/if}
	</p>
</footer>
