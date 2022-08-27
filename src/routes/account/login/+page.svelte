<script lang="ts">
	import { user } from '$lib/sessionStore';
	import Auth from '$components/Auth.svelte';
	import LoadingRing from '$components/LoadingRing.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let loading = true;

	onMount(() => {
		if ($user) goto('/account');
		else loading = false;
	});
</script>

<div class="mx-auto flex flex-col max-w-2xl justify-evenly rounded-xl border shadow-xl">
	{#if loading}
		<LoadingRing />
	{:else}
		<Auth />
	{/if}
</div>
