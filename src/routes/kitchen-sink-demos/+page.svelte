<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tone from 'tone';
	import { getRandomInt } from '$lib/mathUtils';

	let synth: Tone.Synth<Tone.SynthOptions>;

	onMount(async () => {
		// create a new synth and connect it to the main output
		await import('$lib/synth').then((mod) => ({ synth } = mod));
	});

	let startingNote: Tone.Unit.Frequency, intervalSemitones: number;

	function playInterval(startNote: Tone.Unit.Frequency, interval: number) {
		console.log(`start: ${startNote} interval: ${interval}`);
		startingNote = startNote;
		intervalSemitones = interval;
		synth.triggerAttackRelease(startNote, '8n');
		synth.triggerAttackRelease(
			Tone.Frequency(startNote).transpose(interval).toFrequency(),
			'8n',
			'+8n'
		);
	}

	function playRandomInterval(startNote: Tone.Unit.Frequency) {
		playInterval(startNote, getRandomInt(1, 13));
	}
</script>

<svelte:head>
	<title>Ear Trainer</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<div class="flex flex-wrap justify-center">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as interval}
		<button
			class="m-1 border-2 bg-lime-100/50 p-2 hover:border-current"
			on:click={() => playInterval('C4', interval)}
		>
			Play C4 and an interval of {interval}
		</button>
	{/each}
	<button
		class="m-1 border-2 bg-red-100/50 p-2 hover:border-current"
		on:click={() => playRandomInterval('C4')}
	>
		Play C4 and a RANDOM interval!
	</button>
	<button
		class="m-1 border-2 bg-red-100/50 p-2 hover:border-current"
		on:click={() => playRandomInterval(Tone.Frequency(getRandomInt(60, 73), 'midi').toNote())}
	>
		Both RANDOM!
	</button>
</div>

startingNote: {startingNote}, interval in semitones: {intervalSemitones}
