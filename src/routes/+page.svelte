<script>
	import RealtimeAnswersFeed from './RealtimeAnswersFeed.svelte';
</script>

<svelte:head>
	<title>Ear Trainer</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<section class="grid place-content-center gap-1 divide-y">
	<h1 class="font-light text-2xl">Recent Results!</h1>
	<RealtimeAnswersFeed />
</section>
