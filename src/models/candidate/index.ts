import * as ajv from "ajv";

import db from "../../db";
import { IBase, ILocalizedStrings, ISubmitBase } from "../../utilities/models";
import { idValidate } from "../../utilities/validation";

export interface ICandidateSubmit extends ISubmitBase {
    name: string;
    description: { [key: string]: string };
    occupation: { [key: string]: string };
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

export function getAll(): Promise<IBase[]> {
    return db.manyOrNone<IBase>(/*sql*/`
        SELECT
            id, current_submit_id AS currentSubmitId
        FROM voterapp.candidate
    `);
}

export function get(id: string): Promise<IBase> {
    return new Promise<IBase>((resolve, reject) => {
        if (!idValidate({ id })) { reject("Validation error"); }
        db.one(/*sql*/`
            SELECT
                id, current_submit_id AS currentSubmitId
            FROM voterapp.candidate
            WHERE id = $<id>
        `, { id },
        ).then((value) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function getAllSubmitForCandidate(id: string): Promise<ICandidateSubmit[]> {
    return new Promise<ICandidateSubmit[]>((resolve, reject) => {
        if (!idValidate({ id })) { reject("Validation error"); }
        db.manyOrNone<ICandidateSubmit>(/*sql*/`
            SELECT
                CS.id, CS.submit_id AS submitId, CS."name", CS."description", CS."occupation",
                CS.affiliation_id AS affiliationId, CS.date_of_birth AS dateOfBirth, CS.website_url AS websiteUrl,
                SM.submit_status AS submitStatus, SM.submit_user_id AS submitUserId
            FROM voterapp.candidate_submit AS CS
            JOIN voterapp.submit_metadata AS SM
            ON CS.submit_id = SM.id
            WHERE id = $<id>
        `, { id },
        ).then((value) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function getSubmit(submitId: string): Promise<ICandidateSubmit> {
    return new Promise<ICandidateSubmit>((resolve, reject) => {
        if (!idValidate({ submitId })) { reject("Validation error"); }
        db.one<ICandidateSubmit>(/*sql*/`
            SELECT
                CS.id, CS.submit_id AS submitId, CS."name", CS."description", CS."occupation",
                CS.affiliation_id AS affiliationId, CS.date_of_birth AS dateOfBirth, CS.website_url AS websiteUrl,
                SM.submit_status AS submitStatus, SM.submit_user_id AS submitUserId
            FROM voterapp.candidate_submit AS CS
            JOIN voterapp.submit_metadata AS SM
            ON CS.submit_id = SM.id
            WHERE CS.submit_id = $<submitId>
        `, { submitId },
        ).then((value) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function create(candidate: Partial<ICandidateSubmit>): Promise<IBase> {
    return new Promise<IBase>((resolve, reject) => {
        if (!mutateCandidateValidate(candidate)) { reject("Validation error"); }
        db.one<IBase>(/*sql*/`
            INSERT INTO voterapp.candidate
                ("name", party_id, date_of_birth, website_url, submit_status, submit_user_id)
            VALUES ($<name>, $<partyId>, $<dateOfBirth>, $<websiteUrl>, $<submitStatus>, $<submitUserId>)
            RETURNING
                id, name, party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_datetime
        `, { ...candidate },
        ).then((value) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function update(candidate: ISubmitBase): Promise<ICandidateSubmit> {
    return new Promise<ICandidateSubmit>((resolve, reject) => {
        if (!idValidate(candidate) || !mutateCandidateValidate(candidate)) { reject("Validation error"); }
        db.one<ICandidateSubmit>(/*sql*/`
            UPDATE voterapp.candidate SET "name" = $<name>, party_id = $<partyId>, date_of_birth = $<dateOfBirth>,
                website_url = $<websiteUrl>, submit_status = $<submitStatus>, submit_user_id = $<submitUserId>
            WHERE id = $<id>
            RETURNING
                id, name, party_id, date_of_birth, website_url, submit_status, submit_user_id, submit_datetime
        `, { ...candidate},
        ).then((value) => resolve(value))
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
