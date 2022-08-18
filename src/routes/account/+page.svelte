<script lang="ts">
	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';
	import Profile from '$components/Profile.svelte';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import LoadingRing from '$components/LoadingRing.svelte';

	user.set(supabase.auth.user() as User);

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user as User);
	});

	let loading = true;
	onMount(() => {
		if (!$user) goto('/account/login');
		else loading = false;
	});
</script>

<div class="mx-auto flex max-w-2xl justify-evenly rounded-xl border shadow-xl">
	{#if loading}
		<LoadingRing />
	{:else}
		<Profile />
	{/if}
</div>
