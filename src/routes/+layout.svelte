<script context="module">
	import { navigating } from '$app/stores';

	import * as Sentry from '@sentry/svelte';
	import { BrowserTracing } from '@sentry/tracing';
	import { Replay } from '@sentry/replay';
	import { PUBLIC_SENTRY_ENVIRONMENT } from '$env/static/public';

	import { release } from 'virtual:sentry-upload';
</script>

<script lang="ts">
	import PageNavigationIndicator from '$components/PageNavigationIndicator.svelte';
	import '../app.css';
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import type { LayoutData } from './$types';
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	/** @type{import('./$types').LayoutData} */
	export let data: LayoutData;

	supabase.auth.getSession().then((promise) => user.set(promise.data.session?.user ?? undefined));
	supabase.auth.onAuthStateChange((_, session) => {
		if (session?.user) {
			user.set(session.user);
		}
	});

	if (browser && !dev) {
		Sentry.init({
			dsn: 'https://3ea9767fb4b945a98effa7c4b49d2ee3@o1154464.ingest.sentry.io/6661120',
			integrations: [
				new BrowserTracing(),
				new Replay({
					// Capture 10% of all sessions
					sessionSampleRate: 0.1,
					// Of the remaining 90% of sessions, if an error happens start capturing
					errorSampleRate: 1.0
				})
			],
			environment: PUBLIC_SENTRY_ENVIRONMENT,

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0,

			release
		});
	}

	let themeModeSelected: 'dark' | 'light' | null;
	const themeOptions = ['auto', 'light', 'dark'];

	onMount(() => (themeModeSelected = localStorage.theme));
</script>

<svelte:head>
	<title>{$page.data.title || 'Ear Trainer'}</title>
	<meta name="description" content={$page.data.title || 'Ear Training Application'} />
	<script>
		// On page load
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

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
<footer class="mt-20 flex flex-col items-center bg-slate-50 py-8 dark:bg-slate-800">
	<p class="text-center">
		{#if !browser}
			loading login info...
		{:else if $user}
			<a href="/account">Logged in as {$user.email}</a>
		{:else}
			<a href="/account/login">Log in</a>
		{/if}
	</p>
	<select
		class="mt-4 cursor-pointer rounded-full hover:outline-[0.5rem] dark:bg-slate-900 dark:outline-slate-700"
		value={themeModeSelected ?? 'auto'}
		on:change={({ currentTarget: { value } }) => {
			value === 'auto' ? localStorage.removeItem('theme') : (localStorage.theme = value);
			if (
				value === 'dark' ||
				(value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}}
	>
		{#each themeOptions as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</footer>
