<script lang="ts">
	import { user } from '$lib/sessionStore';
	import Auth from '$components/Auth.svelte';
	import LoadingRing from '$components/LoadingRing.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let loading = true;

	onMount(() => {
		throw 'test error for sentry!!';

		if ($user) goto('/account');
		else loading = false;
	});
</script>

<div class="mx-auto flex max-w-2xl flex-col justify-evenly rounded-xl border shadow-xl">
	{#if loading}
		<LoadingRing />
	{:else}
		<Auth />
	{/if}
</div>
