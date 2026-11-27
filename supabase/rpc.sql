CREATE OR REPLACE FUNCTION public.add_invite(p_group_id bigint, p_email text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_invited jsonb;
    v_members jsonb;
    v_total_count integer;
begin
    select 
        coalesce(invited, '[]'::jsonb),
        coalesce(members, '[]'::jsonb)
    into 
        v_invited,
        v_members
    from public."group"
    where id = p_group_id
    for update;

    v_total_count := jsonb_array_length(v_invited) + jsonb_array_length(v_members);

    if v_total_count >= 32 then
        raise exception 'Cannot add invite: group has reached maximum capacity of 32 (members + invited).';
    end if;

    if not (v_invited ? p_email) then
        v_invited := v_invited || to_jsonb(p_email);
    end if;

    update public."group"
    set invited = v_invited
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_match(p_group_id bigint, p_match_key text, p_match jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_match_count int;
begin
    select coalesce(jsonb_object_keys_len, 0)
    into v_match_count
    from public."group",
    lateral (
        select count(*) as jsonb_object_keys_len 
        from jsonb_object_keys(coalesce(matchscout, '{}'::jsonb))
    ) k
    where id = p_group_id;

    if v_match_count >= 750 then
        raise exception 'Match limit of 750 reached for this group';
    end if;

    update public."group"
    set matchscout =
        coalesce(matchscout, '{}'::jsonb)
        || jsonb_build_object(p_match_key, p_match)
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_match(p_group_id bigint, p_match jsonb)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
    v_matchscout jsonb;
    v_match_count int;
    v_key int := 1;
begin
    select coalesce(matchscout, '{}'::jsonb)
    into v_matchscout
    from public."group"
    where id = p_group_id
    for update;

    select count(*)
    into v_match_count
    from jsonb_object_keys(v_matchscout);

    if v_match_count >= 750 then
        raise exception 'Match limit of 750 reached for this group';
    end if;

    while v_matchscout ? v_key::text loop
        v_key := v_key + 1;
    end loop;

    update public."group"
    set matchscout = v_matchscout || jsonb_build_object(v_key::text, p_match)
    where id = p_group_id;

    return v_key::text;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_question(p_group_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_structure jsonb;
    v_sections jsonb;

    v_question jsonb;
    v_question_id integer := 1;

    v_section_id text;
    v_section jsonb;
    v_questions jsonb;

    v_updated_rows integer;
    v_question_count integer;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    if not found then
        raise exception 'Group % not found', p_group_id;
    end if;

    v_structure := coalesce(
        v_prescout->'structure',
        '{}'::jsonb
    );

    v_sections := coalesce(
        v_prescout->'sections',
        '{}'::jsonb
    );

    select count(*)
    into v_question_count
    from jsonb_each(v_structure);

    if v_question_count >= 30 then
        raise exception 'Maximum of 30 questions allowed';
    end if;

    select s.id, s.section
    into v_section_id, v_section
    from jsonb_each(v_sections) as s(id, section)
    where (s.section->>'index')::integer = 0
    limit 1;

    if v_section_id is null then
        raise exception 'No section with index 0 found';
    end if;

    while v_structure ? v_question_id::text loop
        v_question_id := v_question_id + 1;
    end loop;

    v_question := jsonb_build_object(
        'type', 'sn',
        'title', 'New Question'
    );

    v_structure := jsonb_set(
        v_structure,
        array[v_question_id::text],
        v_question,
        true
    );

    v_questions := coalesce(
        v_section->'questions',
        '[]'::jsonb
    );

    v_questions := v_questions || jsonb_build_array(v_question_id::text);

    v_section := jsonb_set(
        v_section,
        '{questions}',
        v_questions,
        true
    );

    v_sections := jsonb_set(
        v_sections,
        array[v_section_id],
        v_section,
        true
    );

    update public."group"
    set
        prescout = v_prescout
            || jsonb_build_object(
                'structure', v_structure,
                'sections', v_sections
            )
    where id = p_group_id;

    get diagnostics v_updated_rows = row_count;

    if v_updated_rows != 1 then
        raise exception 'Expected to update 1 group, updated %', v_updated_rows;
    end if;

    return jsonb_build_object(
        'id', v_question_id::text,
        'sId', v_section_id
    );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_section(p_group_id bigint, p_section jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_id integer := 0;
    v_index integer := 0;
    v_section jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_sections := coalesce(v_prescout->'sections', '{}'::jsonb);

    if (
        select count(*)
        from jsonb_object_keys(v_sections)
    ) >= 10 then
        raise exception 'Maximum number of sections reached';
    end if;

    while v_sections ? v_id::text loop
        v_id := v_id + 1;
    end loop;

    while exists (
        select 1
        from jsonb_each(v_sections) as s(id, section)
        where (section->>'index')::integer = v_index
    ) loop
        v_index := v_index + 1;
    end loop;

    v_section := jsonb_set(
        p_section,
        '{index}',
        to_jsonb(v_index)
    );

    update public."group"
    set
        prescout = jsonb_set(
            v_prescout,
            array['sections', v_id::text],
            v_section,
            true
        )
    where id = p_group_id;

    return jsonb_build_object(
        'id', v_id,
        'index', v_index
    );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_section(p_group_id bigint, p_section_id text, p_section jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    update public."group"
    set
        prescout = jsonb_set(
            coalesce(prescout, '{}'::jsonb),
            array['sections', p_section_id],
            p_section,
            true
        ),
        custom = true
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_team(p_group_id bigint, p_team_num integer, p_team_name text, p_team_code text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_team_count int;
    v_team_exists boolean;
begin
    select 
        coalesce(jsonb_object_keys_len, 0),
        (coalesce(prescout, '{}'::jsonb) #> array['teams', p_team_num::text]) is not null
    into v_team_count, v_team_exists
    from public."group",
    lateral (
        select count(*) as jsonb_object_keys_len 
        from jsonb_object_keys(coalesce(prescout->'teams', '{}'::jsonb))
    ) k
    where id = p_group_id;

    if v_team_count >= 500 and not v_team_exists then
        raise exception 'Team limit of 500 reached for this group';
    end if;

    update public."group"
    set
        prescout = jsonb_set(
            coalesce(prescout, '{}'::jsonb),
            array['teams', p_team_num::text],
            jsonb_build_object(
                'name', p_team_name,
                'code', p_team_code,
                'data', '{}'::jsonb
            ),
            true
        ),
        custom = true
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_teams(p_group_id bigint, p_teams jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    update public."group"
    set
        prescout = jsonb_set(
            coalesce(prescout, '{}'::jsonb),
            '{teams}',
            p_teams,
            true
        )
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_group(p_user_id uuid, p_user_email text)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
  v_group_id bigint;
begin
  insert into "group" (members, invited)
  values (
    jsonb_build_array(
      jsonb_build_object(
        'id', p_user_id,
        'email', p_user_email,
        'isAdmin', true
      )
    ),
    '[]'::jsonb
  )
  returning id into v_group_id;

  insert into usergroup (id, group_id)
  values (p_user_id, v_group_id);

  return v_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_account(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  v_group record;
  v_remaining_members jsonb;
begin
  for v_group in
    select g.id, g.members
    from public."group" g
    join public.usergroup ug
      on ug.group_id = g.id
    where ug.id = p_user_id
  loop

    select coalesce(jsonb_agg(member), '[]'::jsonb)
    into v_remaining_members
    from jsonb_array_elements(v_group.members) as member
    where (member->>'id')::uuid <> p_user_id;

    if jsonb_array_length(v_remaining_members) = 0 then

      delete from public.usergroup
      where group_id = v_group.id;

      delete from public."group"
      where id = v_group.id;

    else

      update public."group"
      set members = v_remaining_members
      where id = v_group.id;

      delete from public.usergroup
      where id = p_user_id
        and group_id = v_group.id;

    end if;

  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_group(p_group_id bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  delete from usergroup
  where group_id = p_group_id;

  delete from "group"
  where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_invite(p_group_id bigint, p_email text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_invited jsonb;
begin
    select coalesce(invited, '[]'::jsonb)
    into v_invited
    from public."group"
    where id = p_group_id
    for update;

    v_invited := coalesce(
        (
            select jsonb_agg(elem)
            from jsonb_array_elements(v_invited) as elem
            where elem #>> '{}' != p_email
        ),
        '[]'::jsonb
    );

    update public."group"
    set invited = v_invited
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_match(p_group_id bigint, p_match_key text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    update public."group"
    set matchscout =
        coalesce(matchscout, '{}'::jsonb)
        - p_match_key
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_member(p_group_id bigint, p_id text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_members jsonb;
    v_user_uuid uuid;
begin
    begin
        v_user_uuid := p_id::uuid;
    exception when invalid_text_representation then
        raise exception 'Invalid UUID format: %', p_id;
    end;

    delete from public.usergroup
    where id = v_user_uuid;

    select coalesce(members, '[]'::jsonb)
    into v_members
    from public."group"
    where id = p_group_id
    for update;

    v_members := coalesce(
        (
            select jsonb_agg(elem)
            from jsonb_array_elements(v_members) as elem
            where elem->>'id' != p_id
        ),
        '[]'::jsonb
    );

    update public."group"
    set members = v_members
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_question(p_group_id bigint, p_question_id text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_structure jsonb;

    v_section_id text;
    v_section jsonb;
    v_questions jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    if not found then
        raise exception 'Group % not found', p_group_id;
    end if;

    v_sections := coalesce(
        v_prescout->'sections',
        '{}'::jsonb
    );

    v_structure := coalesce(
        v_prescout->'structure',
        '{}'::jsonb
    );

    if not (v_structure ? p_question_id) then
        raise exception 'Question % does not exist', p_question_id;
    end if;


    update public."group"
    set
        prescout = jsonb_set(
            jsonb_set(
                v_prescout,
                '{sections}',
                v_sections
            ),
            '{structure}',
            v_structure
        )
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_section(p_group_id bigint, p_section_id text, p_delete_questions boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_structure jsonb;

    v_deleted_section jsonb;
    v_deleted_index integer;

    v_previous_id text;
    v_next_id text;

    v_section_id text;
    v_section jsonb;
    v_old_index integer;
    v_new_index integer := 0;

    v_changed jsonb := '{}'::jsonb;

    v_question_id text;

    v_target_id text;

    v_before boolean := false;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_sections := coalesce(
        v_prescout->'sections',
        '{}'::jsonb
    );

    v_structure := coalesce(
        v_prescout->'structure',
        '{}'::jsonb
    );

    if not (v_sections ? p_section_id) then
        raise exception 'Section does not exist';
    end if;

    if (
        select count(*)
        from jsonb_object_keys(v_sections)
    ) <= 1 then
        raise exception 'At least one section must remain';
    end if;

    v_deleted_section := v_sections->p_section_id;
    v_deleted_index := (v_deleted_section->>'index')::integer;


    return jsonb_build_object(
        'target', v_target_id,
        'before', v_before,
        'indexes', v_changed
    );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_team(p_group_id bigint, p_team_num integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    update public."group"
    set
        prescout = jsonb_set(
            coalesce(prescout, '{}'::jsonb),
            '{teams}',
            coalesce(prescout->'teams', '{}'::jsonb) - p_team_num::text,
            true
        ),
        custom = true
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.join_group(p_user_id uuid, p_group_id bigint, p_user_email text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  insert into usergroup (id, group_id)
  values (p_user_id, p_group_id);

  update "group"
  set 
    invited = (
      select coalesce(
        jsonb_agg(elem),
        '[]'::jsonb
      )
      from jsonb_array_elements_text(coalesce(invited, '[]'::jsonb)) elem
      where elem <> p_user_email
    ),
    members = coalesce(members, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'id', p_user_id, 
        'email', p_user_email,
        'isAdmin', false
      )
    )
  where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.leave_group(p_group_id bigint, p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  v_members jsonb;
  v_remaining_members jsonb;
begin
  select members
  into v_members
  from "group"
  where id = p_group_id;

  if not found then
    raise exception 'Group does not exist';
  end if;

  select coalesce(jsonb_agg(member), '[]'::jsonb)
  into v_remaining_members
  from jsonb_array_elements(v_members) as member
  where (member->>'id')::uuid <> p_user_id;

  if jsonb_array_length(v_remaining_members) = 0 then
    delete from usergroup
    where group_id = p_group_id;

    delete from "group"
    where id = p_group_id;

    return;
  end if;

  update "group"
  set members = v_remaining_members
  where id = p_group_id;

  delete from usergroup
  where id = p_user_id
    and group_id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.move_question(p_group_id bigint, p_question_id text, p_section_id text, p_target_section_id text, p_target_index integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_source jsonb;
    v_target jsonb;
    v_questions jsonb;
    v_source_questions jsonb;
    v_target_questions jsonb;
    v_current_index integer;
    v_insert_index integer;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_sections := coalesce(v_prescout->'sections', '{}'::jsonb);

    if not (v_sections ? p_section_id) then
        raise exception 'Source section does not exist';
    end if;

    if not (v_sections ? p_target_section_id) then
        raise exception 'Target section does not exist';
    end if;

    v_source := v_sections->p_section_id;
    v_target := v_sections->p_target_section_id;

    v_source_questions := coalesce(
        v_source->'questions',
        '[]'::jsonb
    );

    if p_section_id = p_target_section_id then

        select ordinality - 1
        into v_current_index
        from jsonb_array_elements(v_source_questions)
            with ordinality as q(question, ordinality)
        where question = to_jsonb(p_question_id)
        limit 1;

        if v_current_index is null then
            raise exception 'Question does not exist in source section';
        end if;

        v_questions := (
            select coalesce(
                jsonb_agg(question order by ordinality),
                '[]'::jsonb
            )
            from jsonb_array_elements(v_source_questions)
                with ordinality as q(question, ordinality)
            where question <> to_jsonb(p_question_id)
        );

        v_insert_index := p_target_index;

        if v_current_index < p_target_index then
            v_insert_index := p_target_index - 1;
        end if;

        v_questions := (
            select coalesce(
                jsonb_agg(question order by idx),
                '[]'::jsonb
            )
            from (
                select
                    question,
                    row_number() over () - 1 as idx
                from jsonb_array_elements(v_questions) as q(question)

                union all

                select
                    to_jsonb(p_question_id),
                    v_insert_index
            ) q
        );

        v_source := jsonb_set(
            v_source,
            '{questions}',
            v_questions
        );

        v_sections := jsonb_set(
            v_sections,
            array[p_section_id],
            v_source
        );

    else

        v_target_questions := coalesce(
            v_target->'questions',
            '[]'::jsonb
        );

        v_source_questions := (
            select coalesce(
                jsonb_agg(question order by ordinality),
                '[]'::jsonb
            )
            from jsonb_array_elements(v_source_questions)
                with ordinality as q(question, ordinality)
            where question <> to_jsonb(p_question_id)
        );

        v_target_questions := (
            select coalesce(
                jsonb_agg(question order by idx),
                '[]'::jsonb
            )
            from (
                select
                    question,
                    row_number() over () - 1 as idx
                from jsonb_array_elements(v_target_questions) as q(question)

                union all

                select
                    to_jsonb(p_question_id),
                    p_target_index
            ) q
        );

        v_source := jsonb_set(
            v_source,
            '{questions}',
            v_source_questions
        );

        v_target := jsonb_set(
            v_target,
            '{questions}',
            v_target_questions
        );

        v_sections := jsonb_set(
            v_sections,
            array[p_section_id],
            v_source
        );

        v_sections := jsonb_set(
            v_sections,
            array[p_target_section_id],
            v_target
        );

    end if;

    update public."group"
    set
        prescout = jsonb_set(
            v_prescout,
            '{sections}',
            v_sections
        ),
        custom = true
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.move_question(p_group_id bigint, p_section_id text, p_target_section_id text, p_source_questions jsonb, p_target_questions jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_prescout := jsonb_set(
        v_prescout,
        array['sections', p_section_id, 'questions'],
        p_source_questions
    );

    if p_section_id <> p_target_section_id then
        v_prescout := jsonb_set(
            v_prescout,
            array['sections', p_target_section_id, 'questions'],
            p_target_questions
        );
    end if;

    update public."group"
    set
        prescout = v_prescout
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_match_note(p_group_id bigint, p_match_key text, p_alliance integer, p_value text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
    new_value text;
begin
    if length(p_value) > 400 then
        raise exception 'Note cannot exceed 400 characters';
    end if;

    update "group"
    set matchscout = jsonb_set(
        matchscout,
        array[
            p_match_key,
            'scores',
            p_alliance::text,
            '9'
        ],
        to_jsonb(p_value),
        true
    )
    where id = p_group_id

    returning (
        matchscout
        -> p_match_key
        -> 'scores'
        -> p_alliance
        ->> 9
    )
    into new_value;

    return new_value;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_match_score(p_group_id bigint, p_match_key text, p_alliance integer, p_question integer, p_value integer, p_counter boolean)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
    new_value integer;
begin
    if p_value > 10000 then
        raise exception 'Score value cannot exceed 10000';
    end if;

    update "group"
    set matchscout = jsonb_set(
        matchscout,
        array[
            p_match_key,
            'scores',
            p_alliance::text,
            p_question::text
        ],
        to_jsonb(
            case
                when p_counter then
                    least(
                        10000,
                        greatest(
                            0,
                            (
                                matchscout
                                -> p_match_key
                                -> 'scores'
                                -> p_alliance
                                ->> p_question
                            )::integer + p_value
                        )
                    )
                else
                    p_value
            end
        )
    )
    where id = p_group_id

    returning (
        matchscout
        -> p_match_key
        -> 'scores'
        -> p_alliance
        ->> p_question
    )::integer
    into new_value;

    return new_value;

end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_question(p_group_id bigint, p_question_id text, p_changes jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_structure jsonb;
    v_teams jsonb;
    v_question jsonb;
    v_team_id text;
    v_team jsonb;
    v_team_data jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    if not found then
        raise exception 'Group % not found', p_group_id;
    end if;

    v_structure := coalesce(
        v_prescout->'structure',
        '{}'::jsonb
    );

    v_teams := coalesce(
        v_prescout->'teams',
        '{}'::jsonb
    );

    if not (v_structure ? p_question_id) then
        raise exception 'Question % does not exist', p_question_id;
    end if;

    v_question := (v_structure->p_question_id) || p_changes;

    if v_question->>'type' <> 'r' then
        v_question := v_question - 'minmax';
    end if;

    if v_question->>'type' <> 'st' then
        v_question := v_question - 'stars';
    end if;

    if v_question->>'type' <> 'mc'
       and v_question->>'type' <> 'sc' then
        v_question := v_question - 'opt';
    end if;

    v_structure := jsonb_set(
        v_structure,
        array[p_question_id],
        v_question,
        true
    );

    for v_team_id, v_team in
        select t.key, t.value
        from jsonb_each(v_teams) as t(key, value)
    loop
        v_team_data := coalesce(
            v_team->'data',
            '{}'::jsonb
        );

        v_team_data := v_team_data - p_question_id;

        v_team := jsonb_set(
            v_team,
            '{data}',
            v_team_data,
            true
        );

        v_teams := jsonb_set(
            v_teams,
            array[v_team_id],
            v_team,
            true
        );
    end loop;

    update public."group"
    set
        prescout = jsonb_set(
            jsonb_set(
                v_prescout,
                '{structure}',
                v_structure
            ),
            '{teams}',
            v_teams
        )
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_section(p_group_id bigint, p_section_id text, p_title text DEFAULT NULL::text, p_headersize integer DEFAULT NULL::integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_section jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_sections := coalesce(
        v_prescout->'sections',
        '{}'::jsonb
    );

    if not (v_sections ? p_section_id) then
        raise exception 'Section does not exist';
    end if;

    v_section := v_sections->p_section_id;

    if p_title is not null then
        v_section := jsonb_set(
            v_section,
            '{title}',
            to_jsonb(p_title)
        );
    end if;

    if p_headersize is not null then
        v_section := jsonb_set(
            v_section,
            '{headersize}',
            to_jsonb(p_headersize)
        );
    end if;

    v_sections := jsonb_set(
        v_sections,
        array[p_section_id],
        v_section
    );

    update public."group"
    set
        prescout = jsonb_set(
            v_prescout,
            '{sections}',
            v_sections
        ),
        custom = true
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_section(p_group_id bigint, p_section_id text, p_changes jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_section jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_sections := coalesce(
        v_prescout->'sections',
        '{}'::jsonb
    );

    if not (v_sections ? p_section_id) then
        raise exception 'Section does not exist';
    end if;

    v_section := (v_sections->p_section_id) || p_changes;

    v_sections := jsonb_set(
        v_sections,
        array[p_section_id],
        v_section,
        true
    );

    update public."group"
    set
        prescout = jsonb_set(
            v_prescout,
            '{sections}',
            v_sections
        )
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_section_indexes(p_group_id bigint, p_indexes jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_sections jsonb;
    v_section_id text;
    v_index jsonb;
    v_section jsonb;
begin
    select coalesce(prescout, '{}'::jsonb)
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    if not found then
        raise exception 'Group does not exist';
    end if;

    v_sections := coalesce(
        v_prescout->'sections',
        '{}'::jsonb
    );

    for v_section_id, v_index in
        select key, value
        from jsonb_each(p_indexes)
    loop
        if not (v_sections ? v_section_id) then
            raise exception 'Section % does not exist', v_section_id;
        end if;

        v_section := v_sections->v_section_id;

        v_section := jsonb_set(
            v_section,
            '{index}',
            v_index,
            true
        );

        v_sections := jsonb_set(
            v_sections,
            array[v_section_id],
            v_section,
            true
        );
    end loop;

    update public."group"
    set
        prescout = jsonb_set(
            v_prescout,
            '{sections}',
            v_sections
        )
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_summary(p_group_id bigint, p_changes jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_summary jsonb;
begin
    select coalesce(summary, '{}'::jsonb)
    into v_summary
    from public."group"
    where id = p_group_id
    for update;

    if v_summary = '{}'::jsonb then
        raise exception 'Summary does not exist';
    end if;

    v_summary := v_summary || p_changes;

    update public."group"
    set summary = v_summary
    where id = p_group_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_team_question(p_group_id bigint, p_team_id text, p_value jsonb, p_question_id text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_prescout jsonb;
    v_teams jsonb;
    v_team jsonb;
    v_data jsonb;
begin
    select prescout
    into v_prescout
    from public."group"
    where id = p_group_id
    for update;

    v_teams := coalesce(v_prescout->'teams', '{}'::jsonb);

    v_team := v_teams->p_team_id;

    if v_team is null then
        return;
    end if;

    v_data := coalesce(v_team->'data', '{}'::jsonb);

    if p_value is null then
        v_data := v_data - p_question_id;
    else
        v_data := jsonb_set(
            v_data,
            array[p_question_id],
            p_value,
            true
        );
    end if;

    v_team := jsonb_set(
        v_team,
        '{data}',
        v_data,
        true
    );

    v_teams := jsonb_set(
        v_teams,
        array[p_team_id],
        v_team,
        true
    );

    v_prescout := jsonb_set(
        v_prescout,
        '{teams}',
        v_teams,
        true
    );

    update public."group"
    set prescout = v_prescout
    where id = p_group_id;
end;
$function$
;
