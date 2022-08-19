<script lang="ts">
	import LoadingRing from '$components/LoadingRing.svelte';

	import { supabase } from '$lib/supabaseClient';

	// Using the "game_summaries" view. This filters out private
	// games by other users.
	let supabaseData = getSupaData();

	function getSupaData() {
		return supabase.from('game_summaries').select(`*`);
	}
</script>

<button class="my-2 w-96 text-sm" on:click={() => (supabaseData = getSupaData())}>Refresh</button>
{#await supabaseData}
	<div class="w-full grid justify-center">
		<LoadingRing />
		Loading...
	</div>
{:then { data: supaData, error }}
	{#if error}
		<div>Error :(</div>
	{:else}
		<ul class="divide-y">
			{#each supaData as item}
				{@const correct = item.n_correct === item.n_questions}
				<li class={'p-2' + (correct ? ' bg-green-600 text-green-50 font-bold' : '')}>
					<div>
						{item.n_correct}/{item.n_questions}, by {item.username}
					</div>
					<div>{item.created_at}</div>
				</li>
			{/each}
		</ul>
	{/if}
{/await}
