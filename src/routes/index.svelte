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

	function playNotes() {
		// play a middle 'C' for the duration of an 8th note.
		synth.triggerAttackRelease('C4', '8n');
		synth.triggerAttackRelease('E4', '8n', '+8n');
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<h1 class="text-lg">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={playNotes}>Play note</button>
