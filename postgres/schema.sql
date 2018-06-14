/* Extension for UUID generation */
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* Creating schema */
DROP SCHEMA IF EXISTS voterapp CASCADE;
CREATE SCHEMA voterapp;
SET timezone = 'UTC';

CREATE TABLE voterapp.category (
    id uuid DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    
    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submit_timezone TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.topic (
    id uuid DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL,
    "name" TEXT NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submit_timezone TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.issue (
    id uuid DEFAULT gen_random_uuid(),
    topic_id uuid NOT NULL,
    "name" TEXT NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submit_timezone TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.candidate (
    id uuid DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    party_id uuid NOT NULL,
    date_of_birth DATE NOT NULL,
    website_url text,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submit_timezone TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.topic_summary (
    candidate_id uuid NOT NULL,
    topic_id uuid NOT NULL,
    "name" TEXT NOT NULL,
    score DECIMAL NOT NULL,

    PRIMARY KEY (candidate_id, topic_id)
);

CREATE TABLE voterapp.position (
    candidate_id uuid NOT NULL,
    issue_id uuid NOT NULL,
    current_position BOOLEAN NOT NULL,
    confidence DECIMAL NOT NULL,
    source_url TEXT NOT NULL,
    source_quote TEXT NOT NULL,
    source_date DATE NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submit_timezone TEXT NOT NULL,

    PRIMARY KEY (candidate_id, issue_id)
);

CREATE TABLE voterapp.party (
    id uuid DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    submit_timezone TEXT NOT NULL,

    PRIMARY KEY (id) 
);

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

ALTER TABLE voterapp.category ADD CONSTRAINT category_submit_user_fk FOREIGN KEY (submit_user_id) REFERENCES voterapp.user (id);
ALTER TABLE voterapp.topic ADD CONSTRAINT topic_category_fk FOREIGN KEY (category_id) REFERENCES voterapp.category (id);
ALTER TABLE voterapp.topic ADD CONSTRAINT topic_submit_user_fk FOREIGN KEY (submit_user_id) REFERENCES voterapp.user (id);
ALTER TABLE voterapp.issue ADD CONSTRAINT issue_topic_fk FOREIGN KEY (topic_id) REFERENCES voterapp.topic (id);
ALTER TABLE voterapp.issue ADD CONSTRAINT issue_submit_user_fk FOREIGN KEY (submit_user_id) REFERENCES voterapp.user (id);
ALTER TABLE voterapp.candidate ADD CONSTRAINT candidate_party_fk FOREIGN KEY (party_id) REFERENCES voterapp.party (id);
ALTER TABLE voterapp.candidate ADD CONSTRAINT candidate_submit_user_fk FOREIGN KEY (submit_user_id) REFERENCES voterapp.user (id);
ALTER TABLE voterapp.topic_summary ADD CONSTRAINT topic_summary_candidate_fk FOREIGN KEY (candidate_id) REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.topic_summary ADD CONSTRAINT topic_summary_topic_fk FOREIGN KEY (topic_id) REFERENCES voterapp.topic (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_candidate_fk FOREIGN KEY (candidate_id) REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_issue_fk FOREIGN KEY (issue_id) REFERENCES voterapp.issue (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_submit_user_fk FOREIGN KEY (submit_user_id) REFERENCES voterapp.user (id);
ALTER TABLE voterapp.party ADD CONSTRAINT party_submit_user_fk FOREIGN KEY (submit_user_id) REFERENCES voterapp.user (id);
ALTER TABLE voterapp.user ADD CONSTRAINT user_role_fk FOREIGN KEY (role_id) REFERENCES voterapp.role (id);
ALTER TABLE voterapp.preferences ADD CONSTRAINT preferences_user_fk FOREIGN KEY ("user_id") REFERENCES voterapp.user (id);

/* Initializing data */
INSERT INTO voterapp.role ("name") VALUES ('User');
INSERT INTO voterapp.role ("name") VALUES ('Admin');
INSERT INTO voterapp.user (email, username, "password", session_hash, role_id) VALUES ('drewiswaycool@gmail.com', 'drewiswaycool', 'PASSWORD_HASH_HERE', 'SESSION_HASH_HERE', (SELECT id FROM voterapp.role WHERE "name" = 'Admin'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Social', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Foreign', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Immigration', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Economy', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Environment', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Healthcare', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Guns', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Electoral', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Justice', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
INSERT INTO voterapp.category ("name", submit_status, submit_user_id, submit_timezone) VALUES ('Science', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'), 'America/New_York');
