// tslint:disable max-line-length
import * as fs from "fs";
import * as path from "path";
import config from "../src/config";

let initDataContent: string = "";

const roles = ["Admin", "User"];
const categories = ["Social", "Immigration", "Economy", "Environment", "Healthcare", "Guns", "Electoral", "Justice",
    "Science"];
const affiliations = ["Independent", "Democratic", "Republican"];

roles.forEach((role) => {
    initDataContent = initDataContent.concat(/*sql*/`INSERT INTO voterapp.role ("name") VALUES ('${role}');\n`);
});

initDataContent = initDataContent.concat(/*sql*/`INSERT INTO voterapp.user (email, username, "password", session_hash, role_id)
    VALUES ('${config.db.practice_user_email}', '${config.db.practice_username}', '${config.db.practice_user_hash}',
        'SESSION_HASH_HERE', (SELECT id FROM voterapp.role WHERE "name" = '${roles[0]}'));\n`,
);

initDataContent = initDataContent.concat(/*sql*/`INSERT INTO voterapp.user (email, username, "password", session_hash, role_id)
    VALUES ('${config.db.practice_user_email + "1"}', '${config.db.practice_username + "1"}', '${config.db.practice_user_hash}',
        'SESSION_HASH_HERE', (SELECT id FROM voterapp.role WHERE "name" = '${roles[0]}'));\n`,
);

initDataContent = initDataContent.concat(/*sql*/`INSERT INTO voterapp.submit_metadata (submit_status, submit_user_id)
    VALUES (0, (SELECT id FROM voterapp.user WHERE username = '${config.db.practice_username}'));\n`,
);

initDataContent = initDataContent.concat(/*sql*/`INSERT INTO voterapp.submit_metadata (submit_status, submit_user_id)
    VALUES (0, (SELECT id FROM voterapp.user WHERE username = '${config.db.practice_username + "1"}'));\n`,
);

const mainUserSubmitMetadata = /*sql*/`SELECT id FROM voterapp.submit_metadata WHERE submit_user_id = (SELECT id FROM voterapp.user WHERE username = '${config.db.practice_username}')`;
const otherUserSubmitMetadata = /*sql*/`SELECT id FROM voterapp.submit_metadata WHERE submit_user_id = (SELECT id FROM voterapp.user WHERE username = '${config.db.practice_username + "1"}')`;

categories.forEach((category) => {
    initDataContent = initDataContent.concat(/*sql*/`
WITH CATEGORY_ID AS (
    INSERT INTO voterapp.category (current_submit_id)
        VALUES ((${mainUserSubmitMetadata}))
        RETURNING id
)
INSERT INTO voterapp.category_submit (id, submit_id, name)
    VALUES ((SELECT id FROM CATEGORY_ID),
            (${mainUserSubmitMetadata}),
            '{"en-us": "${category}"}');
`);
});

affiliations.forEach((affiliation) => {
    initDataContent = initDataContent.concat(/*sql*/`
WITH AFFILIATION_ID AS (
    INSERT INTO voterapp.affiliation (current_submit_id)
        VALUES ((${mainUserSubmitMetadata}))
        RETURNING id
)
INSERT INTO voterapp.affiliation_submit (id, submit_id, name)
    VALUES ((SELECT id FROM AFFILIATION_ID),
            (${mainUserSubmitMetadata}),
            '{"en-us": "${affiliation}"}');
`);
});

// Topic
initDataContent = initDataContent.concat(/*sql*/`
WITH TOPIC_ID AS (
    INSERT INTO voterapp.topic (current_submit_id)
        VALUES ((${mainUserSubmitMetadata}))
        RETURNING id
)
INSERT INTO voterapp.topic_submit (id, submit_id, category_id, name)
    VALUES ((SELECT id FROM TOPIC_ID),
            (${mainUserSubmitMetadata}),
            (SELECT id FROM voterapp.category_submit WHERE "name"->>'en-us' = 'Environment'),
            '{"en-us": "Climate change"}');
`);

// Issue
initDataContent = initDataContent.concat(/*sql*/`
WITH ISSUE_ID AS (
    INSERT INTO voterapp.issue (current_submit_id)
        VALUES ((${mainUserSubmitMetadata}))
        RETURNING id
)
INSERT INTO voterapp.issue_submit (id, submit_id, topic_id, name)
    VALUES ((SELECT id FROM ISSUE_ID),
            (${mainUserSubmitMetadata}),
            (SELECT id FROM voterapp.topic_submit WHERE "name"->>'en-us' = 'Climate change'),
            '{"en-us": "Increase governmental regulations to prevent climate change"}');
`);

initDataContent = initDataContent.concat(/*sql*/`
WITH SUBMIT_ID AS ((${mainUserSubmitMetadata})),
    CAND_ID AS (
        INSERT INTO voterapp.candidate (current_submit_id)
            VALUES ((SELECT id FROM SUBMIT_ID))
            RETURNING id
    )
    INSERT INTO voterapp.candidate_submit (id, submit_id, "name", "description", "occupation", affiliation_id, date_of_birth, website_url)
        VALUES ((SELECT id FROM CAND_ID),
                (${mainUserSubmitMetadata}),
                'Beto O''Rourke',
                '{"en-us": "Robert Francis \\"Beto\\" O''Rourke is an American politician and businessman serving as the U.S. Representative for Texas''s 16th congressional district since 2013. He is the nominee of the Democratic Party in the 2018 Texas U.S. Senate race, running against Republican incumbent Ted Cruz."}',
                '{"en-us": "Member of the U.S. House of Representatives from Texas''s 16th district"}',
                (SELECT id FROM voterapp.affiliation_submit WHERE "name"->>'en-us' = 'Democratic'),
                '1972-09-26',
                'https://betofortexas.com/');
INSERT INTO voterapp.position_submit
    (candidate_id, issue_id, submit_id, current_position, source_url, source_quote, source_date)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Beto O''Rourke'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (${mainUserSubmitMetadata}),
            TRUE,
            'https://betofortexas.com/issue/energy/',
            'Empowering the EPA to exercise oversight of those harming the environment, particularly drilling, fracking, and pipeline construction.',
            '2017-03-31');
INSERT INTO voterapp.position (candidate_id, issue_id, current_submit_id)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Beto O''Rourke'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (${mainUserSubmitMetadata}));

WITH SUBMIT_ID AS ((${otherUserSubmitMetadata})),
    CAND_ID AS (
        INSERT INTO voterapp.candidate (current_submit_id)
            VALUES ((SELECT id FROM SUBMIT_ID))
            RETURNING id
    )
    INSERT INTO voterapp.candidate_submit (id, submit_id, "name", "description", "occupation", affiliation_id, date_of_birth, website_url)
        VALUES ((SELECT id FROM CAND_ID),
                (${otherUserSubmitMetadata}),
                'Ted Cruz',
                '{"en-us": "Rafael Edward Cruz is an American politician and attorney serving as the junior United States Senator from Texas since 2013. He was a candidate for the Republican nomination for President of the United States in the 2016 election."}',
                '{"en-us": "United States Senator from Texas"}',
                (SELECT id FROM voterapp.affiliation_submit WHERE "name"->>'en-us' = 'Republican'),
                '1970-12-22',
                'https://www.tedcruz.org/');
INSERT INTO voterapp.position_submit
    (candidate_id, issue_id, submit_id, current_position, source_url, source_quote, source_date)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Ted Cruz'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (${otherUserSubmitMetadata}),
            FALSE,
            'https://www.bloomberg.com/news/articles/2015-08-03/republicans-climate-change-plan-',
            '...dismissing the new rules to slash carbon emissions as "radical" or "irresponsible" or "a buzz saw on the nation''s economy."',
            '2015-08-03');
INSERT INTO voterapp.position (candidate_id, issue_id, current_submit_id)
    VALUES ((SELECT id FROM voterapp.candidate_submit WHERE "name" = 'Ted Cruz'),
            (SELECT id FROM voterapp.issue_submit
                WHERE "name"->>'en-us' = 'Increase governmental regulations to prevent climate change'),
            (${otherUserSubmitMetadata}));
`);

const schema = fs.readFileSync(path.normalize(`${__dirname }/schema.template.sql`), { encoding: "utf8" });
const result = `${schema}\n/* Initializing data */\n\n${initDataContent}`;
fs.writeFileSync(path.normalize(`${__dirname }/schema.sql`), result, { encoding: "utf8" });
