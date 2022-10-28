<script lang="ts" context="module">
	export enum QuestionType {
		FunctionalIntervals = 1,
		VerticalIntervals = 2
	}

	export interface Answer {
		correct: boolean;
		interval: number;
		question_type: QuestionType;
	}
</script>

<script lang="ts">
	import { supabase, type DBWithCustomTypes } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	async function submitQuestionScore(
		answers: Answer[]
	): Promise<'success' | { error: PostgrestError }> {
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

		type AnswerData =
			DBWithCustomTypes['public']['Functions']['submit_question']['Args']['answer_data'];
		const answer_data: AnswerData = answers.map((answer) => {
			return {
				question_data: { interval: answer.interval },
				correct: answer.correct,
				question_type: answer.question_type
			};
		});

		const { error } = await supabase.rpc('submit_question', {
			user_id: userId,
			is_public: true,
			answer_data: answer_data
		});

		if (error) {
			console.log('error');
			console.log(error);
			return { error: error };
		}

		return 'success';
	}

	export let open: boolean;
	$: if (open) dialog.showModal();

	export let answers: Answer[];

	let dialog: HTMLDialogElement;

	onMount(() => {
		// dialog.showModal();
	});
</script>

<dialog {open} on:close on:close={() => (open = false)} on:submit bind:this={dialog}>
	<p>Greetings, one and all!</p>
	<form method="dialog">
		<button on:click={() => submitQuestionScore(answers)}>OK</button>
		<button>Don't Submit Result</button>
	</form>
</dialog>
