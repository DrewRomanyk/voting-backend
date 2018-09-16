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
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.topic (
    id uuid DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL,
    "name" TEXT NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id)
);

CREATE TABLE voterapp.issue (
    id uuid DEFAULT gen_random_uuid(),
    topic_id uuid NOT NULL,
    "name" TEXT NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

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
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

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
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (candidate_id, issue_id)
);

CREATE TABLE voterapp.party (
    id uuid DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    submit_status INT NOT NULL,
    submit_user_id uuid NOT NULL,
    submit_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

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

INSERT INTO voterapp.user (email, username, "password", session_hash, role_id) 
                    VALUES ('drewiswaycool@gmail.com', 'drewiswaycool', 'PASSWORD_HASH_HERE', 'SESSION_HASH_HERE', (SELECT id FROM voterapp.role WHERE "name" = 'Admin'));

INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Social', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Foreign', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Immigration', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Economy', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Environment', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Healthcare', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Guns', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Electoral', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Justice', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.category ("name", submit_status, submit_user_id) VALUES ('Science', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));

INSERT INTO voterapp.topic (category_id, "name", submit_status, submit_user_id) 
                    VALUES ((SELECT id FROM voterapp.category WHERE "name" = 'Environment'), 'Climate Change', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));

INSERT INTO voterapp.issue (topic_id, "name", submit_status, submit_user_id)
                    VALUES ((SELECT id FROM voterapp.topic WHERE "name" = 'Climate Change'), 'Increase governmental regulations to prevent climate change', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));

INSERT INTO voterapp.party ("name", submit_status, submit_user_id) VALUES ('Independent', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.party ("name", submit_status, submit_user_id) VALUES ('Democratic', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.party ("name", submit_status, submit_user_id) VALUES ('Republican', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));

INSERT INTO voterapp.candidate ("name", party_id, date_of_birth, website_url, submit_status, submit_user_id)
                        VALUES ('Beto O''Rourke', (SELECT id FROM voterapp.party WHERE "name" = 'Democratic'),'1972-09-26', 'https://betofortexas.com/', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
INSERT INTO voterapp.candidate ("name", party_id, date_of_birth, website_url, submit_status, submit_user_id)
                        VALUES ('Ted Cruz', (SELECT id FROM voterapp.party WHERE "name" = 'Republican'),'1970-12-22', 'https://www.tedcruz.org/', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));

INSERT INTO voterapp.position (candidate_id, issue_id, current_position, confidence, source_url, source_quote, source_date, submit_status, submit_user_id) 
                        VALUES ((SELECT id FROM voterapp.candidate WHERE "name" = 'Beto O''Rourke'), (SELECT id FROM voterapp.issue WHERE "name" = 'Increase governmental regulations to prevent climate change'), TRUE, 1.0, 'https://betofortexas.com/issue/energy/', 'Empowering the EPA to exercise oversight of those harming the environment, particularly drilling, fracking, and pipeline construction.', '2017-03-31', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));

INSERT INTO voterapp.position (candidate_id, issue_id, current_position, confidence, source_url, source_quote, source_date, submit_status, submit_user_id) 
                        VALUES ((SELECT id FROM voterapp.candidate WHERE "name" = 'Ted Cruz'), (SELECT id FROM voterapp.issue WHERE "name" = 'Increase governmental regulations to prevent climate change'), FALSE, 1.0, 'https://www.bloomberg.com/news/articles/2015-08-03/republicans-climate-change-plan-', '...dismissing the new rules to slash carbon emissions as "radical" or "irresponsible" or "a buzz saw on the nation''s economy."', '2015-08-03', 0, (SELECT id FROM voterapp.user WHERE username = 'drewiswaycool'));
