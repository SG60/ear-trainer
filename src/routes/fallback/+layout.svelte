<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	onMount(async () => {
		console.info('going to:', $page.url.pathname);
		goto($page.url)
			.catch((reason) => {
				console.log('rejected promise', reason);
			})
			.then(() => console.info('success'));
	});
</script>

<div class="grid place-items-center">
	<div class="m-4 text-center">
		<h1 class="text-2xl">Offline Fallback Page</h1>
		<p class="p-2 text-lg">Cached Page Not Found</p>
	</div>
</div>
