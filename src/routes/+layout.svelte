<script context="module">
	import { navigating } from '$app/stores';

	import * as Sentry from '@sentry/svelte';
	import { BrowserTracing } from '@sentry/tracing';

	Sentry.init({
		dsn: 'https://3ea9767fb4b945a98effa7c4b49d2ee3@o1154464.ingest.sentry.io/6661120',
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0
	});
</script>

<script lang="ts">
	import PageNavigationIndicator from '$components/PageNavigationIndicator.svelte';
	import '../app.css';
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import type { User } from '@supabase/supabase-js';
	import type { LayoutData } from './$types';
	import { browser } from '$app/env';

	/** @type{import('./$types').LayoutData} */
	export let data: LayoutData;

	user.set(supabase.auth.user() as User);
	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user as User);
	});
</script>

{#if $navigating}
	<PageNavigationIndicator />
{/if}
<header class="my-20">
	<a href="/"><h1 class="text-center text-5xl hover:underline">Ear Trainer</h1></a>

	<nav class="mt-8 flex flex-wrap justify-center">
		{#each data.pages as page}
			<a
				href={page}
				class="m-1 bg-lime-100/50 p-2 hover:bg-lime-300 hover:underline"
				sveltekit:prefetch
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
