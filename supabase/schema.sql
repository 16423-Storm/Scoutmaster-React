-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.usergroup (
  id uuid NOT NULL DEFAULT auth.uid(),
  group_id integer NOT NULL,
  CONSTRAINT usergroup_pkey PRIMARY KEY (id)
);
CREATE TABLE public.group (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  made timestamp with time zone DEFAULT now(),
  members jsonb DEFAULT '[]'::jsonb,
  invited jsonb DEFAULT '[]'::jsonb,
  compkey text DEFAULT ''::text,
  custom boolean DEFAULT false,
  currentTeam text DEFAULT '"0"'::text,
  prescout jsonb DEFAULT '{"teams": {}, "sections": {"0": {"index": 0, "title": "Section 1", "questions": [], "headersize": 1}}, "structure": {}}'::jsonb,
  matchscout jsonb DEFAULT '{}'::jsonb,
  summary jsonb DEFAULT '{"picks": [], "accept": [], "reject": [], "currentPos": 0}'::jsonb,
  settings jsonb DEFAULT '{"stc": false}'::jsonb,
  CONSTRAINT group_pkey PRIMARY KEY (id)
);
