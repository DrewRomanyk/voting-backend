// tslint:disable max-line-length
import * as fs from "fs";
import * as path from "path";
import config from "../src/config";

let initDataContent: string = "";

const roles = ["Admin", "User"];
const categories = ["Social", "Immigration", "Economy", "Environment", "Healthcare", "Guns", "Electoral", "Justice",
    "Science"];
const parties = ["Independent", "Democratic", "Republican"];

roles.forEach((role) => {
    initDataContent = initDataContent.concat(`INSERT INTO voterapp.role ("name") VALUES ('${role}');\n`);
});

initDataContent = initDataContent.concat(`INSERT INTO voterapp.user (email, username, "password", session_hash, role_id)
    VALUES ('${config.db.practice_user_email}', '${config.db.practice_username}', '${config.db.practice_user_hash}',
        'SESSION_HASH_HERE', (SELECT id FROM voterapp.role WHERE "name" = '${roles[0]}'));\n`,
);

initDataContent = initDataContent.concat(`INSERT INTO voterapp.submit_metadata (submit_status, submit_user_id)
    VALUES (0, (SELECT id FROM voterapp.user WHERE username = '${config.db.practice_username}'));\n`,
);

categories.forEach((category) => {
    initDataContent = initDataContent.concat(`
WITH CATEGORY_ID AS (
    INSERT INTO voterapp.category (current_submit_id)
        VALUES ((SELECT id FROM voterapp.submit_metadata))
        RETURNING id
)
INSERT INTO voterapp.category_submit (id, submit_id, name)
    VALUES ((SELECT id FROM CATEGORY_ID),
            (SELECT id FROM voterapp.submit_metadata),
            '{"en-us": "${category}"}');
`);
});

parties.forEach((party) => {
    initDataContent = initDataContent.concat(`
WITH PARTY_ID AS (
    INSERT INTO voterapp.party (current_submit_id)
        VALUES ((SELECT id FROM voterapp.submit_metadata))
        RETURNING id
)
INSERT INTO voterapp.party_submit (id, submit_id, name)
    VALUES ((SELECT id FROM PARTY_ID),
            (SELECT id FROM voterapp.submit_metadata),
            '{"en-us": "${party}"}');
`);
});

// Topic
initDataContent = initDataContent.concat(`
WITH TOPIC_ID AS (
    INSERT INTO voterapp.topic (current_submit_id)
        VALUES ((SELECT id FROM voterapp.submit_metadata))
        RETURNING id
)
INSERT INTO voterapp.topic_submit (id, submit_id, category_id, name)
    VALUES ((SELECT id FROM TOPIC_ID),
            (SELECT id FROM voterapp.submit_metadata),
            (SELECT id FROM voterapp.category_submit WHERE "name"->>'en-us' = 'Environment'),
            '{"en-us": "Climate change"}');
`);

// Issue
initDataContent = initDataContent.concat(`
WITH ISSUE_ID AS (
    INSERT INTO voterapp.issue (current_submit_id)
        VALUES ((SELECT id FROM voterapp.submit_metadata))
        RETURNING id
)
INSERT INTO voterapp.issue_submit (id, submit_id, topic_id, name)
    VALUES ((SELECT id FROM ISSUE_ID),
            (SELECT id FROM voterapp.submit_metadata),
            (SELECT id FROM voterapp.topic_submit WHERE "name"->>'en-us' = 'Climate change'),
            '{"en-us": "Increase governmental regulations to prevent climate change"}');
`);

initDataContent = initDataContent.concat(`
WITH SUBMIT_ID AS ((SELECT id FROM voterapp.submit_metadata)),
    CAND_ID AS (
        INSERT INTO voterapp.candidate (current_submit_id)
            VALUES ((SELECT id FROM SUBMIT_ID))
            RETURNING id
    )
    INSERT INTO voterapp.candidate_submit (id, submit_id, "name", party_id, date_of_birth, website_url)
        VALUES ((SELECT id FROM CAND_ID),
                (SELECT id FROM voterapp.submit_metadata),
                'Beto O''Rourke',
                (SELECT id FROM voterapp.party_submit WHERE "name"->>'en-us' = 'Democratic'),
                '1972-09-26',
                'https://betofortexas.com/');
INSERT INTO voterapp.position_submit
    (candidate_id, issue_id, submit_id, current_position, source_url, source_quote, source_date)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Beto O''Rourke'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (SELECT id FROM voterapp.submit_metadata),
            TRUE,
            'https://betofortexas.com/issue/energy/',
            'Empowering the EPA to exercise oversight of those harming the environment, particularly drilling, fracking, and pipeline construction.',
            '2017-03-31');
INSERT INTO voterapp.position (candidate_id, issue_id, current_submit_id)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Beto O''Rourke'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (SELECT id FROM voterapp.submit_metadata));

WITH SUBMIT_ID AS ((SELECT id FROM voterapp.submit_metadata)),
    CAND_ID AS (
        INSERT INTO voterapp.candidate (current_submit_id)
            VALUES ((SELECT id FROM SUBMIT_ID))
            RETURNING id
    )
    INSERT INTO voterapp.candidate_submit (id, submit_id, "name", party_id, date_of_birth, website_url)
        VALUES ((SELECT id FROM CAND_ID),
                (SELECT id FROM voterapp.submit_metadata),
                'Ted Cruz',
                (SELECT id FROM voterapp.party_submit WHERE "name"->>'en-us' = 'Republican'),
                '1970-12-22',
                'https://www.tedcruz.org/');
INSERT INTO voterapp.position_submit
    (candidate_id, issue_id, submit_id, current_position, source_url, source_quote, source_date)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Ted Cruz'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (SELECT id FROM voterapp.submit_metadata),
            FALSE,
            'https://www.bloomberg.com/news/articles/2015-08-03/republicans-climate-change-plan-',
            '...dismissing the new rules to slash carbon emissions as "radical" or "irresponsible" or "a buzz saw on the nation''s economy."',
            '2015-08-03');
INSERT INTO voterapp.position (candidate_id, issue_id, current_submit_id)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Ted Cruz'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (SELECT id FROM voterapp.submit_metadata));
`);

const schema = fs.readFileSync(path.normalize(`${__dirname }/schema.template.sql`), { encoding: "utf8" });
const result = `${schema}\n/* Initializing data */\n\n${initDataContent}`;
fs.writeFileSync(path.normalize(`${__dirname }/schema.sql`), result, { encoding: "utf8" });
