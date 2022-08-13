<script>
	import { onMount } from 'svelte';
	import * as Tone from 'tone';

	/**
	 * @type {Tone.Synth<Tone.SynthOptions>}
	 */
	let synth;

	onMount(() => {
		// create a new synth and connect it to the main output
		synth = new Tone.Synth().toDestination();
	});

	/**
	 * @param {Tone.Unit.Frequency} startNote
	 * @param {number} interval
	 */
	function playInterval(startNote, interval) {
		synth.triggerAttackRelease(startNote, '8n');
		synth.triggerAttackRelease(
			Tone.Frequency(startNote).transpose(interval).toFrequency(),
			'8n',
			'+8n'
		);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<h1 class="text-5xl text-center my-20">Ear Trainer</h1>

<div class="flex flex-wrap justify-center">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as interval}
		<button
			class="m-1 border-2 bg-lime-100/50 p-2 hover:border-current"
			on:click={() => playInterval('C4', interval)}
		>
			Play C4 and an interval of {interval}
		</button>
	{/each}
</div>
