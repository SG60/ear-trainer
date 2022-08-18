<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tone from 'tone';
	import { getRandomInt } from '$lib/mathUtils';

	let playInterval: (arg0: Tone.Unit.Frequency, arg1: number) => void;

	onMount(async () => {
		await import('$lib/intervalPlayers').then((mod) => ({ playInterval } = mod));
		setupNewQuestion();
	});

	let questionsTotal = 10;
	let questionsRemaining = questionsTotal;

	let startingNote: Tone.Unit.Frequency, intervalSemitones: number;

	let lastAnswerCorrect: boolean;

	let notPlayedNewQuestion = true;

	let numberOfTries = 0;

	function setupNewQuestion() {
		startingNote = Tone.Frequency(getRandomInt(60, 73), 'midi').toNote();
		intervalSemitones = getRandomInt(1, 13);
		notPlayedNewQuestion = true;
		numberOfTries = 0;
	}

	function playQuestion() {
		playInterval(startingNote, intervalSemitones);
		notPlayedNewQuestion = false;
	}

	function submitAnswer(submittedInterval: number) {
		if (submittedInterval === intervalSemitones) {
			questionsRemaining = questionsRemaining - 1;
			console.log('success');
			lastAnswerCorrect = true;

			setupNewQuestion();
		} else {
			console.log('wrong');
			lastAnswerCorrect = false;
			numberOfTries++;
		}
	}
</script>

<svelte:head>
	<title>Ear Trainer</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<div>
	<h2>Debug Info:</h2>
	<ul>
		<li>startingNote: {startingNote}, interval in semitones: {intervalSemitones}</li>
		<li>
			questions remaining: {questionsRemaining} of {questionsTotal}
		</li>
		<li>number of tries for this question: {numberOfTries}</li>
	</ul>
</div>

{#if questionsRemaining > 0}
	<div class="flex flex-wrap justify-center">
		<button
			class="m-1 border-2 bg-blue-900 p-2 text-slate-50 hover:shadow-lg"
			on:click={playQuestion}
		>
			{#if lastAnswerCorrect && notPlayedNewQuestion}
				Play Next Interval!
			{:else}
				Play Interval
			{/if}
		</button>
	</div>

	<h2 class="text-center text-lg font-bold">How many semitones was that?</h2>
	<div id="answerbox" class="flex flex-wrap justify-center">
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as interval}
			<button
				disabled={notPlayedNewQuestion}
				class="m-1 border-2 bg-lime-100/50 p-2 hover:border-current hover:shadow-lg disabled:border-inherit disabled:bg-gray-100"
				on:click={() => submitAnswer(interval)}
			>
				{interval}
			</button>
		{/each}
	</div>

	{#if lastAnswerCorrect === true && notPlayedNewQuestion}
		<div class="h-12 w-full bg-green-200 text-center">Correct answer!!</div>
	{:else if lastAnswerCorrect === false}
		<div class="h-12 w-full bg-red-200 text-center">Try again! Incorrect answer!!</div>
	{/if}
{:else}
	All done!
{/if}
