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

	let answers: any[] | null;
	onMount(async () => {
		if (!$user) goto('/account/login');
		else loading = false;

		({ data: answers } = await supabase.from('answers').select('*')) as { data: any[] };
		console.log(answers);
	});
</script>

<div class="mx-auto flex max-w-2xl justify-evenly rounded-xl border shadow-xl">
	{#if loading}
		<LoadingRing />
	{:else}
		<Profile />
	{/if}
</div>

<ul>
	{#if answers}
		{#each answers as answer}
			<li>
				question_data: {answer.question_data}
				id: {answer.id}
				question_type: {answer.question_type}
				correct: {answer.correct}
			</li>
		{/each}
	{/if}
</ul>
