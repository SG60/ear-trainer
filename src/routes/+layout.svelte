<script context="module">
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

<script>
	import '../app.css';

	/** @type{import('./$types').LayoutData} */
	export let data;
</script>

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
