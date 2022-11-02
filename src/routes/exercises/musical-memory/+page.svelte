<script lang="ts">
	import type * as Tone from 'tone';
	import type { synth } from '$lib/synth';
	import { getRandomInt } from '$lib/mathUtils';
	import AnswerSubmissionModal, { type Answer } from '$components/AnswerSubmissionModal.svelte';
	import { onMount } from 'svelte';

	let questionsRemaining = 2;
	const initialNumberOfQuestions = questionsRemaining;

	let answers: Answer[];

	let toneSynth: typeof synth;

	onMount(async () => {
		await import('$lib/synth').then((mod) => ({ synth: toneSynth } = mod));

		({ options, correctAnswer } = generateNewMelodyOptions());
		playCorrectMelody(options[correctAnswer]);
	});

	const CHOICE_OPTIONS = ['A', 'B', 'C'] as const;
	type ChoiceType = typeof CHOICE_OPTIONS[number];
	let chosenAnswer: ChoiceType | undefined = undefined;
	let correctAnswer: ChoiceType;
	type Melody = Tone.Unit.Frequency[];
	type MelodyOptions = {
		[k in ChoiceType]: Melody;
	};
	let options: MelodyOptions;

	enum State {
		'lastTryIncorrect',
		'lastTryCorrect',
		'AnsweringFirstQuestion',
		'FinishedTest'
	}
	let state: State = State.AnsweringFirstQuestion;
	let haveHeardMelody = false;

	/** Reset various variables for the next question */
	function moveOnToNextQ() {
		questionsRemaining--;
		chosenAnswer = undefined;
		({ options, correctAnswer } = generateNewMelodyOptions());
		haveHeardMelody = false;
	}
	function generateNewMelodyOptions(): { options: typeof options; correctAnswer: ChoiceType } {
		return { options: { A: [], B: [], C: [] }, correctAnswer: 'A' };
	}
	/** Plays a melody */
	function playMelody(melody: Melody, currentSynth: typeof synth) {
		console.log(currentSynth);
		console.log(melody);
	}
	function playCorrectMelody(correctMelody: Melody) {
		console.log('Playing the correct melody');
		console.log(correctMelody);
		playMelody(correctMelody, toneSynth);
	}
	function playChosenMelody(choice: ChoiceType) {
		console.log(`Play melody: ${choice}`);
		playMelody(options[choice], toneSynth);
	}
	/** Check whether an answer is correct */
	function attemptQuestionAnswer() {
		if (chosenAnswer === correctAnswer) {
			console.log('Correct!');
			state = State.lastTryCorrect;
			moveOnToNextQ();
		} else {
			console.log('Incorrect');
			state = State.lastTryIncorrect;
		}
	}
</script>

<h1 class="text-center text-xl">Musical Memory test</h1>
<table class="w-fit border-collapse [&_td]:border [&_td]:p-1">
	<tbody>
		<tr>
			<td>State</td><td>{State[state]} ({state})</td>
		</tr>
		<tr>
			<td>chosenAnswer</td><td>{chosenAnswer}</td>
		</tr>
		<tr>
			<td>correctAnswer</td><td>{correctAnswer}</td>
		</tr>
		<tr>
			<td>haveHeardMelody</td><td>{haveHeardMelody}</td>
		</tr>
	</tbody>
</table>

<svelte:window
	on:keydown={(event) => {
		if (haveHeardMelody) {
			switch (event.code) {
				case 'KeyA':
					chosenAnswer = 'A';
					break;
				case 'KeyB':
					chosenAnswer = 'B';
					break;
				case 'KeyC':
					chosenAnswer = 'C';
					break;
			}
		}
	}}
/>

{#if questionsRemaining > 0}
	<div class="m-4 mx-auto flex flex-col items-center gap-8 border border-slate-200 p-12 shadow-sm">
		<aside class="self-start">
			Question {initialNumberOfQuestions - questionsRemaining + 1} of {initialNumberOfQuestions}
		</aside>

		<div>
			<button
				class="enabled:bg-blue-900 enabled:text-blue-50"
				disabled={haveHeardMelody}
				on:click={() => {
					playCorrectMelody(options[correctAnswer]);
					haveHeardMelody = true;
				}}
			>
				Play
			</button>
		</div>

		<div class="flex gap-8">
			{#each CHOICE_OPTIONS as option}
				{@const optionId = 'answerId' + option}
				<label class="cursor-pointer">
					<input
						type="radio"
						name="answers"
						disabled={!haveHeardMelody}
						bind:group={chosenAnswer}
						id={optionId}
						value={option}
						class="peer hidden"
						on:click={() => playChosenMelody(option)}
					/>
					<div
						disabled={!haveHeardMelody || undefined}
						class="button peer-checked:bg-blue-100 peer-checked:text-blue-900"
					>
						{option}
					</div>
				</label>
			{/each}
		</div>

		<div class="w-full">
			<button
				class="w-full enabled:bg-blue-100 disabled:text-slate-400 enabled:dark:bg-blue-900"
				type="submit"
				disabled={chosenAnswer === undefined}
				on:click={attemptQuestionAnswer}
			>
				Submit {chosenAnswer ? chosenAnswer : '?'}
			</button>
		</div>
	</div>
{/if}

<AnswerSubmissionModal
	open={questionsRemaining < 1}
	on:close={() => (state = State.FinishedTest)}
	{answers}
/>
