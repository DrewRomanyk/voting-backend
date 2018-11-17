import * as ajv from "ajv";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import config from "../../config";
import db from "../../db";
import { IId } from "../../utilities/models";
import { idValidate } from "../../utilities/validation";

export interface IUser extends IId {
    email: string;
    username: string;
    role_id: string;
    password: string;
    session_hash: string;
}

export interface IJwtPayload extends IId {
    sessionHash: string;
}

const usernameValidate = ajv().compile({
    type: "object",
    required: ["username"],
    properties: {
        username: {
            type: "string",
            minLength: 1,
            maxLength: 25,
        },
    },
});

const signupValidate = ajv().compile({
    type: "object",
    required: ["email", "username", "password"],
    properties: {
        email: {
            type: "string",
            format: "email",
        },
        username: {
            type: "string",
            minLength: 1,
            maxLength: 25,
        },
        password: {
            type: "string",
            minLength: 10,
            maxLength: 100,
        },
    },
});

export function findById(id: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
        if (!idValidate({ id })) { reject("Validation error"); }
        db.one(/*sql*/`
            SELECT
                id, email, username, role_id, session_hash, "password"
            FROM voterapp.user WHERE id = $<id>
        `, { id },
        ).then((value: IUser) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function findByUsername(username: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
        if (!usernameValidate({ username })) { reject("Validation error"); }
        db.one(/*sql*/`
            SELECT
                id, email, username, role_id, session_hash, "password"
            FROM voterapp.user WHERE username = $<username>
        `, { username },
        ).then((value: IUser) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function signup(email: string, username: string, password: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
        if (!signupValidate({ email, username, password })) { reject("Validation error"); }
        db.one(/*sql*/`
            INSERT INTO voterapp.user
                (email, username, "password", session_hash)
            VALUES ($<email>, $<username>, $<password>, $<sessionHash>)
            RETURNING id, email, username, role_id, session_hash, "password"`,
            { email, username, password, sessionHash: createSessionHash() },
        ).then((value: IUser) => resolve(value))
        .catch((error: Error) => reject(error));
    });
}

export function getJwt(userId: string, sessionHash: string): string {
    const payload: IJwtPayload = {
        id: userId,
        sessionHash,
    };
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiration,
    });
}

export function verifyPassword(user: IUser, password: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
        argon2.verify(user.password, password)
        .then((isVerified) => isVerified ? resolve(user) : reject("Password was incorrect"));
    });
}

export function createSessionHash(): string {
    return crypto.randomBytes(config.jwt.session_hash_length).toString("hex");
}
