<script lang="ts">
	import LoadingRing from '$components/LoadingRing.svelte';

	import { supabase } from '$lib/supabaseClient';

	// Using the "game_summaries" view. This filters out private
	// games by other users.
	let supabaseData = Array(getSupaData(10));

	/** True if the last supabase request didn't return anything */
	let noMoreItems = false;

	function getSupaData(limit: number) {
		return supabase.from('game_summaries').select(`*`).limit(limit);
	}

	function loadMore(amount: number, currentLength: number) {
		return supabase
			.from('game_summaries')
			.select('*')
			.range(currentLength, currentLength + (amount - 1));
	}

	async function numberOfItemsInArray(supabaseData: any[]): Promise<number> {
		return supabaseData.reduce(async (acc, cur) => {
			return (await acc) + ((await cur).data?.length ?? 0);
		}, Promise.resolve(0));
	}

	$: currentNumberOfItems = numberOfItemsInArray(supabaseData);
</script>

<button
	class="my-2 w-96 text-sm"
	on:click={async () => {
		supabaseData = Array(getSupaData(await currentNumberOfItems));
		noMoreItems = false;
	}}
>
	Refresh
</button>

{#each supabaseData as supabaseDataItem}
	{#await supabaseDataItem}
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
					<li class={'p-2' + (correct ? ' bg-green-700 text-green-50 font-bold' : '')}>
						<div>
							{item.n_correct}/{item.n_questions}, by {item.username}
						</div>
						<div>{item.created_at}</div>
					</li>
				{/each}
			</ul>
		{/if}
	{/await}
{/each}
{#if !noMoreItems}
	<button
		class="my-2 w-96 text-sm"
		on:click={async () => {
			const extraStuff = loadMore(10, await currentNumberOfItems);
			if ((await extraStuff).data?.length) {
				supabaseData = [...supabaseData, extraStuff];
			} else noMoreItems = true;
		}}
	>
		Load More
	</button>
{:else}
	No more results!
{/if}
