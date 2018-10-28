/* Extension for UUID generation */
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* Creating schema */
DROP SCHEMA IF EXISTS voterapp CASCADE;
CREATE SCHEMA voterapp;
SET timezone = 'UTC';

CREATE TABLE voterapp.submit_metadata (
    id uuid DEFAULT gen_random_uuid(),

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id)
);

/* CATEGORY */
CREATE TABLE voterapp.category (
    id uuid DEFAULT gen_random_uuid(),

    current_submit_id uuid NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.category_submit (
    id uuid NOT NULL,
    submit_id uuid NOT NULL,

    "name" jsonb NOT NULL,

    PRIMARY KEY (id, submit_id)
);

/* TOPIC */
CREATE TABLE voterapp.topic (
    id uuid DEFAULT gen_random_uuid(),

    current_submit_id uuid NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.topic_submit (
    id uuid NOT NULL,
    submit_id uuid NOT NULL,

    category_id uuid NOT NULL,
    "name" jsonb NOT NULL,

    PRIMARY KEY (id, submit_id)
);

/* ISSUE */
CREATE TABLE voterapp.issue (
    id uuid DEFAULT gen_random_uuid(),

    current_submit_id uuid NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.issue_submit (
    id uuid NOT NULL,
    submit_id uuid NOT NULL,

    topic_id uuid NOT NULL,
    "name" jsonb NOT NULL,

    PRIMARY KEY (id, submit_id)
);

/* CANDIDATE */
CREATE TABLE voterapp.candidate (
    id uuid DEFAULT gen_random_uuid(),

    current_submit_id uuid NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.candidate_submit (
    id uuid NOT NULL,
    submit_id uuid NOT NULL,

    "name" TEXT NOT NULL,
    party_id uuid NOT NULL,
    date_of_birth DATE NOT NULL,
    website_url text,

    PRIMARY KEY (id, submit_id)
);

/* PARTY */
CREATE TABLE voterapp.party (
    id uuid DEFAULT gen_random_uuid(),

    current_submit_id uuid NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.party_submit (
    id uuid NOT NULL,
    submit_id uuid NOT NULL,

    "name" jsonb NOT NULL,

    PRIMARY KEY (id, submit_id) 
);

/* POSITION */
CREATE TABLE voterapp.position (
    candidate_id uuid NOT NULL,
    issue_id uuid NOT NULL,

    current_submit_id uuid NOT NULL,

    PRIMARY KEY (candidate_id, issue_id)
);

CREATE TABLE voterapp.position_submit (
    candidate_id uuid NOT NULL,
    issue_id uuid NOT NULL,
    submit_id uuid NOT NULL,

    current_position BOOLEAN NOT NULL,
    source_url TEXT NOT NULL,
    source_quote TEXT NOT NULL,
    source_date DATE NOT NULL,

    PRIMARY KEY (candidate_id, issue_id, submit_id)
);

/* OTHER */
CREATE TABLE voterapp.user (
    id uuid DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    role_id uuid NOT NULL,
    session_hash TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.role (
    id uuid DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL UNIQUE,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.preferences (
    "user_id" uuid NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'America/New_York',
    "address" TEXT,
    email_update BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY ("user_id")
);

ALTER TABLE voterapp.submit_metadata ADD CONSTRAINT submit_metadata_user_fk FOREIGN KEY (submit_user_id)
    REFERENCES voterapp.user (id);

ALTER TABLE voterapp.category_submit ADD CONSTRAINT category_submit_category_fk FOREIGN KEY (id)
    REFERENCES voterapp.category (id);
ALTER TABLE voterapp.category_submit ADD CONSTRAINT category_submit_submit_fk FOREIGN KEY (submit_id)
    REFERENCES voterapp.submit_metadata (id);
ALTER TABLE voterapp.category ADD CONSTRAINT category_category_fk FOREIGN KEY (current_submit_id)
    REFERENCES voterapp.submit_metadata (id);

ALTER TABLE voterapp.topic_submit ADD CONSTRAINT topic_submit_topic_fk FOREIGN KEY (id)
    REFERENCES voterapp.topic (id);
ALTER TABLE voterapp.topic_submit ADD CONSTRAINT topic_submit_submit_fk FOREIGN KEY (submit_id)
    REFERENCES voterapp.submit_metadata (id);
ALTER TABLE voterapp.topic_submit ADD CONSTRAINT topic_submit_category_fk FOREIGN KEY (category_id)
    REFERENCES voterapp.category (id);
ALTER TABLE voterapp.topic ADD CONSTRAINT topic_topic_fk FOREIGN KEY (current_submit_id)
    REFERENCES voterapp.submit_metadata (id);

ALTER TABLE voterapp.issue_submit ADD CONSTRAINT issue_submit_issue_fk FOREIGN KEY (id)
    REFERENCES voterapp.issue (id);
ALTER TABLE voterapp.issue_submit ADD CONSTRAINT issue_submit_submit_fk FOREIGN KEY (submit_id)
    REFERENCES voterapp.submit_metadata (id);
ALTER TABLE voterapp.issue_submit ADD CONSTRAINT issue_submit_topic_fk FOREIGN KEY (topic_id)
    REFERENCES voterapp.topic (id);
ALTER TABLE voterapp.issue ADD CONSTRAINT issue_issue_fk FOREIGN KEY (current_submit_id)
    REFERENCES voterapp.submit_metadata (id);

ALTER TABLE voterapp.candidate_submit ADD CONSTRAINT candidate_submit_candidate_fk FOREIGN KEY (id)
    REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.candidate_submit ADD CONSTRAINT candidate_submit_fk FOREIGN KEY (submit_id)
    REFERENCES voterapp.submit_metadata (id);
ALTER TABLE voterapp.candidate_submit ADD CONSTRAINT candidate_party_fk FOREIGN KEY (party_id)
    REFERENCES voterapp.party (id);
ALTER TABLE voterapp.candidate ADD CONSTRAINT candidate_candidate_fk FOREIGN KEY (current_submit_id)
    REFERENCES voterapp.submit_metadata (id);

ALTER TABLE voterapp.party_submit ADD CONSTRAINT party_submit_party_fk FOREIGN KEY (id)
    REFERENCES voterapp.party (id);
ALTER TABLE voterapp.party_submit ADD CONSTRAINT party_submit_submit_fk FOREIGN KEY (submit_id)
    REFERENCES voterapp.submit_metadata (id);
ALTER TABLE voterapp.party ADD CONSTRAINT party_party_fk FOREIGN KEY (current_submit_id)
    REFERENCES voterapp.submit_metadata (id);

ALTER TABLE voterapp.position_submit ADD CONSTRAINT position_submit_candidate_fk FOREIGN KEY (candidate_id)
    REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.position_submit ADD CONSTRAINT position_submit_issue_fk FOREIGN KEY (issue_id)
    REFERENCES voterapp.issue (id);
ALTER TABLE voterapp.position_submit ADD CONSTRAINT position_submit_submit_fk FOREIGN KEY (submit_id)
    REFERENCES voterapp.submit_metadata (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_candidate_fk FOREIGN KEY (candidate_id)
    REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_issue_fk FOREIGN KEY (issue_id)
    REFERENCES voterapp.issue (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_postition_fk FOREIGN KEY (current_submit_id)
    REFERENCES voterapp.submit_metadata (id);

ALTER TABLE voterapp.user ADD CONSTRAINT user_role_fk FOREIGN KEY (role_id)
    REFERENCES voterapp.role (id);

ALTER TABLE voterapp.preferences ADD CONSTRAINT preferences_user_fk FOREIGN KEY ("user_id")
    REFERENCES voterapp.user (id);
