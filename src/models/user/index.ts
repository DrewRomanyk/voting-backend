import * as ajv from "ajv";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import config from "../../config";
import db from "../../db";

export interface IUser {
    id: string;
    email: string;
    username: string;
    role_id: string;
    password: string;
    session_hash: string;
}

export interface IJwtPayload {
    id: string;
    sessionHash: string;
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

export function findById(id: string): Promise<IUser> {
    if (idValidate({ id })) {
        return db.one(`
            SELECT
                id, email, username, role_id, session_hash, "password"
            FROM voterapp.user WHERE id = $<id>
        `, { id });
    } else {
        throw new Error("Validation Error");
    }
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

export function findByUsername(username: string): Promise<IUser> {
    if (usernameValidate({ username })) {
        return db.one(`
            SELECT
                id, email, username, role_id, session_hash, "password"
            FROM voterapp.user WHERE username = $<username>
        `, { username });
    } else {
        throw new Error("Validation error!");
    }
}

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

export function signup(email: string, username: string, password: string): Promise<IUser> {
    if (signupValidate({ email, username, password })) {
        return db.one(`
            INSERT INTO voterapp.user
                (email, username, "password", session_hash)
            VALUES ($<email>, $<username>, $<password>, $<sessionHash>)
            RETURNING id, email, username, role_id, session_hash, "password"`,
            { email, username, password, sessionHash: createSessionHash() },
        );
    } else {
        throw new Error("Validation Error");
    }
}

export function getJwt(userId: string, sessionHash: string): string {
    const payload: IJwtPayload = {
        id: userId,
        sessionHash,
    };
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: "24h",
    });
}

export function verifyPassword(userPassword: string, password: string): Promise<boolean> {
    return argon2.verify(userPassword, password);
}

export function createSessionHash(): string {
    return crypto
        .randomBytes(config.jwt.session_hash_length)
        .toString("hex");
}
