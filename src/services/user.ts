import * as ajv from "ajv";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import User from "../models/user";
import config from "../config";

export interface IJwtPayload {
    id: string;
    sessionHash: string;
}

export interface ISignUpPayload {
    email: string;
    username: string;
    password: string;
}

const signupValidate = ajv({async: true, allErrors: true}).compile({
    $async: true,
    type: "object",
    required: ["email", "username", "password"],
    properties: {
        email: {
            type: "string",
            format: "email",
        },
        username: {
            type: "string",
            pattern: "[a-zA-Z\\d]+",
            minLength: 3,
            maxLength: 25,
        },
        password: {
            type: "string",
            minLength: 10,
            maxLength: 100,
        },
    },
});

export default class UserService {
    public static async signup(data: ISignUpPayload): Promise<User> {
        return (signupValidate(data) as Promise<ISignUpPayload>)
        .then(() => argon2.hash(data.password))
        .then((hash) => {
            return User.create({
                username: data.username,
                email: data.email,
                password: hash,
                sessionHash: this.createSessionHash(),
            });
        });
    }

    public static async get(id: string): Promise<User> {
        return User.findByPk(id);
    }

    public static async getByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        if (usernameOrEmail.indexOf("@") === -1) {
            return User.findOne({ where: { username: usernameOrEmail } });
        } else {
            return User.findOne({ where: { email: usernameOrEmail } });
        }
    }

    /* Authentication */

    public static async verifyPassword(user: User, password: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            argon2.verify(user.password, password)
            .then((isVerified) => isVerified ? resolve(user) : reject("Password was incorrect"));
        });
    }

    public static async signToken(payload: IJwtPayload): Promise<string> {
        return new Promise<string>((resolve, _) => {
            const token = jwt.sign(payload, config.jwt.secret, {
                expiresIn: config.jwt.expiration,
            });
            resolve(token);
        });
    }

    public static async verifyToken(token: string): Promise<IJwtPayload> {
        return new Promise<IJwtPayload>((resolve, reject) => {
            jwt.verify(token, config.jwt.secret, (error, data: IJwtPayload) => {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        });
    }

    private static createSessionHash(): string {
        return crypto.randomBytes(config.jwt.session_hash_length).toString("hex");
    }
}
