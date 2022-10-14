<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tone from 'tone';
	import { getRandomInt } from '$lib/mathUtils';

	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import type { PostgrestError } from '@supabase/supabase-js';

	let playInterval: (arg0: Tone.Unit.Frequency, arg1: number) => void;

	onMount(async () => {
		await import('$lib/intervalPlayers').then((mod) => ({ playInterval } = mod));
		setupNewQuestion();
	});

	let questionsTotal = 3;
	let questionsRemaining = questionsTotal;

	let startingNote: Tone.Unit.Frequency, intervalSemitones: number;

	let lastAnswerCorrect: boolean;

	let notPlayedNewQuestion = true;

	let numberOfTries = 0;

	let answers: { correct: boolean; interval: number }[] = [];

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

			answers.push({
				correct: true,
				interval: submittedInterval
			});
			lastAnswerCorrect = true;

			setupNewQuestion();
		} else {
			console.log('wrong');

			answers.push({
				correct: false,
				interval: submittedInterval
			});
			lastAnswerCorrect = false;
			numberOfTries++;
		}

		if (questionsRemaining === 0 && $user) {
			submitQuestionScore();
		}
	}

	async function submitQuestionScore(): Promise<'success' | { error: PostgrestError }> {
		if (!$user) {
			console.log('No current user, so the score is not being submitted.');
			return 'success';
		}

		/*
Combined SQL function to do submissions in one transaction.

CREATE TYPE answer_information as (
  question_data jsonb,
  correct boolean,
  question_type int8
);

CREATE OR REPLACE FUNCTION submit_question(user_id uuid, is_public boolean, answer_data answer_information[])
returns void                                                                                                  
language plpgsql
as $$
declare
  game_played_id int8;
begin
  insert into games_played("user_id","is_public") VALUES(submit_question.user_id,submit_question.is_public) RETURNING id INTO game
_played_id;
  INSERT INTO answers("game_played_id","user_id","question_data", "correct", "question_type")
    SELECT * FROM unnest(array_fill(game_played_id,ARRAY[array_length(submit_question.answer_data,1)]),array_fill(submit_question.
user_id,ARRAY[array_length(submit_question.answer_data,1)]),submit_question.answer_data);
end;
$$;


Using the function:

SELECT submit_question('d5163409-b6b4-465f-bf96-2765c42f45c3'::uuid, true, ARRAY[
(jsonb_object('{{thingy,5},{ahh,1}}'),true,1), (jsonb_object('{thingy,200}'),false,1)]::answer_information[]);


		*/

		const userId = $user.id;
		const { data, error } = (await supabase.from('games_played').insert({
			user_id: userId,
			is_public: true
		})) as { data: { id: number }[]; error: undefined } | { data: null; error: PostgrestError };
		console.log(data);

		if (error) {
			return { error: error };
		}

		const { data: data2, error: error2 } = await supabase.from('answers').insert(
			answers.map((answer) => {
				return {
					game_played_id: data[0].id,
					user_id: userId,
					question_data: { interval: answer.interval },
					correct: answer.correct,
					question_type: 1
				};
			})
		);
		console.log(data2);
		if (error2) {
			return { error: error2 };
		}

		return 'success';
	}

	const semitonesIntervals = [
		'unison',
		'minor second',
		'major second',
		'minor third',
		'major third',
		'perfect fourth',
		'tritone',
		'perfect fifth',
		'minor sixth',
		'major sixth',
		'minor seventh',
		'major seventh'
	];
	function semitoneToInterval(semitone: number) {
		const num = Math.floor(semitone / 12);
		return `${semitonesIntervals[semitone % 12]}${num > 0 ? ` (${num} octaves)` : ''}`;
	}
</script>

<svelte:head>
	<title>Ear Trainer</title>
	<meta name="description" content="Ear Training Application" />
</svelte:head>

<h1 class="text-center text-xl">Random Intervals (from any note!)</h1>

<ul class="flex flex-row flex-wrap justify-around">
	<li>
		questions remaining: {questionsRemaining} of {questionsTotal}
	</li>
	{#if numberOfTries}
		<li>number of tries for this question: {numberOfTries}</li>
	{/if}
</ul>

{#if questionsRemaining > 0}
	<div class="flex flex-wrap justify-center">
		<button class="m-2 bg-blue-900 text-blue-50" style:--_ink-shadow="#000" on:click={playQuestion}>
			{#if lastAnswerCorrect && notPlayedNewQuestion}
				Play Next Interval!
			{:else}
				Play Interval
			{/if}
		</button>
	</div>

	<h2 class="text-center text-lg font-bold">How many semitones was that?</h2>
	<div id="answerbox" class="flex flex-wrap justify-center">
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as interval}
			<button
				disabled={notPlayedNewQuestion}
				class="m-1 border-2 bg-lime-100/50 p-2 disabled:border-inherit disabled:bg-gray-100"
				on:click={() => submitAnswer(interval)}
			>
				{semitoneToInterval(interval)}
			</button>
		{/each}
	</div>

	{#if lastAnswerCorrect === true && notPlayedNewQuestion}
		<div class="h-12 w-full bg-green-200 text-center">Correct answer!!</div>
	{:else if lastAnswerCorrect === false}
		<div class="my-4 w-full bg-red-200 py-8 text-center">Try again! Incorrect answer!!</div>
	{/if}
{:else}
	All done!
{/if}
