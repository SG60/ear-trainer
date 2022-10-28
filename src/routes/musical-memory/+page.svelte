<script lang="ts">
	import type * as Tone from 'tone';
	import type { synth } from '$lib/synth';
	import { getRandomInt } from '$lib/mathUtils';
	import AnswerSubmissionModal, { type Answer } from '$components/AnswerSubmissionModal.svelte';

	let questionsRemaining = 2;
	const initialNumberOfQuestions = questionsRemaining;

	let answers: Answer[];

	/** Plays a random melody */
	let playMelody: (arg0: Tone.Unit.Frequency, arg1: number) => void;
	let toneSynth: typeof synth;

	let choices: string | undefined;
	const options = ['A', 'B', 'C'];
</script>

<h1 class="text-center text-xl">Musical Memory test</h1>
{#if questionsRemaining > 0}
	<div class="m-4 mx-auto flex flex-col items-center gap-8 border border-slate-200 p-12 shadow-sm">
		<aside class="self-start">
			Question {initialNumberOfQuestions - questionsRemaining + 1} of {initialNumberOfQuestions}
		</aside>

		<div>
			<button class="bg-blue-900 text-blue-50" style:--_ink-shadow="#000">Play</button>
		</div>

		<div class="flex gap-8">
			{#each options as option}
				{@const optionId = 'answerId' + option}
				<label class="cursor-pointer">
					<input
						type="radio"
						name="answers"
						bind:group={choices}
						id={optionId}
						value={option}
						class="peer hidden"
					/>
					<div class="button peer-checked:bg-blue-100 peer-checked:text-blue-900">
						{option}
					</div>
				</label>
			{/each}
		</div>

		<div class="w-full">
			<button class="w-full enabled:bg-blue-100" type="submit" disabled={choices === undefined}>
				Submit {choices ? choices : '?'}
			</button>
		</div>
	</div>
{/if}

<AnswerSubmissionModal open={questionsRemaining < 1} {answers} />
