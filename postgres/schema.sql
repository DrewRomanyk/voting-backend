/* Extension for UUID generation */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* Creating schema */
DROP SCHEMA IF EXISTS voterapp CASCADE;
CREATE SCHEMA voterapp;

CREATE TABLE voterapp.category (
    id uuid DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE voterapp.topic (
    id uuid DEFAULT uuid_generate_v4(),
    category_id uuid NOT NULL,
    "name" TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE voterapp.issue (
    id uuid DEFAULT uuid_generate_v4(),
    topic_id uuid NOT NULL,
    "name" TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE voterapp.candidate (
    id uuid DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    party_id uuid NOT NULL,
    date_of_birth date NOT NULL,
    website_url text,
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
    PRIMARY KEY (candidate_id, issue_id)
);

CREATE TABLE voterapp.party (
    id uuid DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    PRIMARY KEY (id) 
);

ALTER TABLE voterapp.candidate ADD CONSTRAINT candidate_party_fk FOREIGN KEY (party_id) REFERENCES voterapp.party (id);
ALTER TABLE voterapp.topic_summary ADD CONSTRAINT topic_summary_candidate_fk FOREIGN KEY (candidate_id) REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.topic_summary ADD CONSTRAINT topic_summary_topic_fk FOREIGN KEY (topic_id) REFERENCES voterapp.topic (id);
ALTER TABLE voterapp.issue ADD CONSTRAINT issue_topic_fk FOREIGN KEY (topic_id) REFERENCES voterapp.topic (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_candidate_fk FOREIGN KEY (candidate_id) REFERENCES voterapp.candidate (id);
ALTER TABLE voterapp.position ADD CONSTRAINT position_issue_fk FOREIGN KEY (issue_id) REFERENCES voterapp.issue (id);
ALTER TABLE voterapp.topic ADD CONSTRAINT topic_category_fk FOREIGN KEY (category_id) REFERENCES voterapp.category (id);

/* Initializing data */
INSERT INTO voterapp.category ("name") VALUES ('Social');
INSERT INTO voterapp.category ("name") VALUES ('Foreign');
INSERT INTO voterapp.category ("name") VALUES ('Immigration');
INSERT INTO voterapp.category ("name") VALUES ('Economy');
INSERT INTO voterapp.category ("name") VALUES ('Environment');
INSERT INTO voterapp.category ("name") VALUES ('Healthcare');
INSERT INTO voterapp.category ("name") VALUES ('Education');
INSERT INTO voterapp.category ("name") VALUES ('Gun');
INSERT INTO voterapp.category ("name") VALUES ('Electoral');
INSERT INTO voterapp.category ("name") VALUES ('Justice');
INSERT INTO voterapp.category ("name") VALUES ('Science');