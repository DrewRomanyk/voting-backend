import * as ajv from "ajv";

import db from "../../db";
import { IId } from "../../utilities/models";
import { idValidate } from "../../utilities/validation";

export interface ICandidate extends IId {
    name: string;
    affiliationId: string;
    dateOfBirth: string;
    websiteUrl?: string;
    submitStatus: number;
    submitUserId: string;
}

const mutateCandidateValidate = ajv().compile({
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

export function findAll(): Promise<ICandidate[]> {
    return db.any(/*sql*/`
        SELECT
            CS.id, CS.name, CS.affiliation_id, CS.date_of_birth, CS.website_url
        FROM voterapp.candidate AS C
        JOIN voterapp.candidate_submit AS CS
        ON C.id = CS.id AND C.current_submit_id = CS.submit_id
    `);
}

export function findById(id: string): Promise<ICandidate> {
    return new Promise<ICandidate>((resolve, reject) => {
        if (!idValidate({ id })) { reject("Validation error"); }
        db.one(/*sql*/`
            SELECT
                CS.id, CS.name, CS.affiliation_id, CS.date_of_birth, CS.website_url
            FROM voterapp.candidate AS C
            JOIN voterapp.candidate_submit AS CS
            ON C.id = CS.id AND C.current_submit_id = CS.submit_id
            WHERE C.id = $<id>
        `, { id },
        ).then((value: ICandidate) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function create(candidate: Partial<ICandidate>): Promise<ICandidate> {
    return new Promise<ICandidate>((resolve, reject) => {
        if (!mutateCandidateValidate(candidate)) { reject("Validation error"); }
        db.one(/*sql*/`
            INSERT INTO voterapp.candidate
                ("name", party_id, date_of_birth, website_url, submit_status, submit_user_id)
            VALUES ($<name>, $<partyId>, $<dateOfBirth>, $<websiteUrl>, $<submitStatus>, $<submitUserId>)
            RETURNING
                id, name, party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_datetime
        `, { ...candidate },
        ).then((value: ICandidate) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function update(candidate: ICandidate): Promise<ICandidate> {
    return new Promise<ICandidate>((resolve, reject) => {
        if (!idValidate(candidate) || !mutateCandidateValidate(candidate)) { reject("Validation error"); }
        db.one(/*sql*/`
            UPDATE voterapp.candidate SET "name" = $<name>, party_id = $<partyId>, date_of_birth = $<dateOfBirth>,
                website_url = $<websiteUrl>, submit_status = $<submitStatus>, submit_user_id = $<submitUserId>
            WHERE id = $<id>
            RETURNING
                id, name, party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_datetime
        `, { ...candidate},
        ).then((value: ICandidate) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function remove(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!idValidate({ id })) { reject("Validation error"); }
        db.one(/*sql*/`
            DELETE FROM voterapp.candidate
            WHERE id = $<id>
            RETURNING id
        `, { id },
        ).then((value: string) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}
