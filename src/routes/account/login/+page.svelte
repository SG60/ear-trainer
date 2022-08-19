<script lang="ts">
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import Auth from '$components/Auth.svelte';
	import type { User } from '@supabase/supabase-js';
	import LoadingRing from '$components/LoadingRing.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let loading = true;

	onMount(() => {
		if ($user) goto('/account');
		else loading = false;
	});
</script>

<div class="mx-auto flex max-w-2xl justify-evenly rounded-xl border shadow-xl">
	{#if loading}
		<LoadingRing />
	{:else}
		<Auth />
	{/if}
</div>
