<script>
	const links = ['kitchen-sink-demos', 'interval-test', 'account'];
</script>

<svelte:head>
	<title>Ear Trainer</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<div class="flex flex-wrap justify-center">
	{#each links as href}
		<a {href} class="m-1 bg-lime-100/50 p-2 hover:bg-lime-300 hover:underline" sveltekit:prefetch>
			{href}
		</a>
	{/each}
</div>
