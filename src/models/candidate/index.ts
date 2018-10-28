import * as ajv from "ajv";

import db from "../../db";

// TODO: validation & typing

export interface IJwtPayload {
    id: string;
    sessionHash: string;
}

export interface ICandidate {
    id?: string;
    name: string;
    affiliation_id: string;
    date_of_birth: string;
    website_url?: string;
}

export function findAll() {
    return db.any(/*sql*/`
        SELECT
            CS.id, CS.name, CS.affiliation_id, CS.date_of_birth, CS.website_url
        FROM voterapp.candidate AS C
        JOIN voterapp.candidate_submit AS CS
        ON C.id = CS.id AND C.current_submit_id = CS.submit_id
    `);
}

const idValidate = ajv().compile({
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
});

export function findById(id: string) {
    if (idValidate({ id })) {
        return db.one(/*sql*/`
            SELECT
                CS.id, CS.name, CS.affiliation_id, CS.date_of_birth, CS.website_url
            FROM voterapp.candidate AS C
            JOIN voterapp.candidate_submit AS CS
            ON C.id = CS.id AND C.current_submit_id = CS.submit_id
            WHERE C.id = $<id>
        `, { id });
    } else {
        throw new Error("Validation error");
    }
}

export interface ICreateCandidate {
    name: string;
    affiliationId: string;
    dateOfBirth: string;
    websiteUrl?: string;
    submitStatus: number;
    submitUserId: string;
}

const createCandidateValidate = ajv().compile({
    type: "object",
    required: ["name", "partyId", "dateOfBirth", "websiteUrl", "submitStatus", "submitUserId"],
    properties: {
        name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
        },
        partyId: {
            type: "string",
            format: "uuid",
        },
        dateOfBirth: {
            type: "string",
            format: "date",
        },
        websiteUrl: {
            type: ["string", "null"],
            format: "url",
        },
        submitStatus: {
            type: "integer",
        },
        submitUserId: {
            type: "string",
            format: "uuid",
        },
    },
});

export function create(candidate: ICreateCandidate) {
    if (createCandidateValidate(candidate)) {
        return db.one(/*sql*/`
            INSERT INTO voterapp.candidate
                ("name", party_id, date_of_birth, website_url, submit_status, submit_user_id)
            VALUES ($<name>, $<partyId>, $<dateOfBirth>, $<websiteUrl>, $<submitStatus>, $<submitUserId>)
            RETURNING
                id, name, party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_datetime
        `, { ...candidate });
    } else {
        throw new Error("Validation error");
    }
}

export interface IUpdateCandidate extends ICreateCandidate {
    id: string;
}

const updateCandidateValidate = ajv().compile({
    type: "object",
    required: ["id", "name", "partyId", "dateOfBirth", "websiteUrl", "submitStatus", "submitUserId"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
        name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
        },
        partyId: {
            type: "string",
            format: "uuid",
        },
        dateOfBirth: {
            type: "string",
            format: "date",
        },
        websiteUrl: {
            type: ["string", "null"],
            format: "date",
        },
        submitStatus: {
            type: "integer",
        },
        submitUserId: {
            type: "string",
            format: "uuid",
        },
    },
});

export function update(candidate: IUpdateCandidate) {
    if (updateCandidateValidate(candidate)) {
        return db.one(/*sql*/`
            UPDATE voterapp.candidate SET "name" = $<name>, party_id = $<partyId>, date_of_birth = $<dateOfBirth>,
                website_url = $<websiteUrl>, submit_status = $<submitStatus>, submit_user_id = $<submitUserId>
            WHERE id = $<id>
            RETURNING
                id, name, party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_datetime
        `, { ...candidate});
    } else {
        throw new Error("Validation error");
    }
}

export function remove(id: string) {
    if (idValidate({ id })) {
        return db.one(/*sql*/`
            DELETE FROM voterapp.candidate
            WHERE id = $<id>
            RETURNING id
        `, { id });
    } else {
        throw new Error("Validation error");
    }
}
