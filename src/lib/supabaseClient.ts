import { createClient } from '@supabase/supabase-js';

import type { Database } from '$lib/generated/database.types';

const supabaseUrl = 'https://weajrtbsntmezicrvolh.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYWpydGJzbnRtZXppY3J2b2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA4MzE5NTcsImV4cCI6MTk3NjQwNzk1N30.qeCt7aUoFq4Uj3gGqggSLDq9Ab9RgWyhwCgfj_Ku56k';

/** Client-side supabase client *****************************************/
export const supabase = createClient<DBWithCustomTypes>(supabaseUrl, supabaseAnonKey, {
	global: { fetch: (...args) => fetch(...args) }
});

/********************* Improved DB Types ******************************/
interface IndividualAnswer {
	question_data: {
		interval: number;
	};
	correct: boolean;
	question_type: QuestionType;
	num_tries: number;
}
type SubmitQuestionAnswerData = IndividualAnswer[];
export enum QuestionType {
	FunctionalIntervals = 1,
	VerticalIntervals = 2
}

export type DBWithCustomTypes = Database & {
	public: { Functions: { submit_question: { Args: { answer_data: SubmitQuestionAnswerData } } } };
};
