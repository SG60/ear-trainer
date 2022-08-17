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
</script>

<slot />
