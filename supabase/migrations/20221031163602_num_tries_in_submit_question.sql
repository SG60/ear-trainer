drop type "public"."answer_information";

set check_function_bodies = off;

create type "public"."answer_information" as ("question_data" jsonb, "correct" boolean, "question_type" bigint, "num_tries" integer);

CREATE OR REPLACE FUNCTION public.submit_question(user_id uuid, is_public boolean, answer_data answer_information[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  game_played_id int8;
begin
  insert into games_played("user_id","is_public") VALUES(submit_question.user_id,submit_question.is_public) RETURNING id INTO game_played_id;
  INSERT INTO answers("game_played_id","user_id","question_data", "correct", "question_type", "num_tries")
    SELECT * FROM unnest(array_fill(game_played_id,ARRAY[array_length(submit_question.answer_data,1)]),array_fill(submit_question.user_id,ARRAY[array_length(submit_question.answer_data,1)]),submit_question.answer_data);
end;
$function$
;


