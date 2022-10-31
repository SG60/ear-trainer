<script lang="ts" context="module">
	export enum QuestionType {
		FunctionalIntervals = 1,
		VerticalIntervals = 2
	}

	export interface Answer {
		correct: boolean;
		interval: number;
		question_type: QuestionType;
		num_tries: number;
	}
</script>

<script lang="ts">
	import { supabase, type DBWithCustomTypes } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import type { PostgrestError } from '@supabase/supabase-js';

	async function submitQuestionScore(
		answers: Answer[]
	): Promise<'success' | { error: PostgrestError }> {
		if (!$user) {
			console.log('No current user, so the score is not being submitted.');
			return 'success';
		}

		const userId = $user.id;

		type AnswerData =
			DBWithCustomTypes['public']['Functions']['submit_question']['Args']['answer_data'];
		const answer_data: AnswerData = answers.map((answer) => {
			return {
				question_data: { interval: answer.interval },
				correct: answer.correct,
				question_type: answer.question_type,
				num_tries: answer.num_tries
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

	let dialog: HTMLDialogElement;

	export let open: boolean;
	$: {
		if (dialog) {
			if (open) dialog.showModal();
			else dialog.close();
		}
	}

	export let answers: Answer[];
</script>

<dialog
	on:close
	on:close={() => (open = false)}
	on:submit
	bind:this={dialog}
	class="rounded-md border p-4 shadow-md"
>
	<p>Would you like to upload your results?</p>
	<form method="dialog">
		<button on:click={() => submitQuestionScore(answers)}>OK</button>
		<button>Don't Submit Result</button>
	</form>
</dialog>
