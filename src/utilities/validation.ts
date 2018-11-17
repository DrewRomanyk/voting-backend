import * as ajv from "ajv";

export const idValidate = ajv().compile({
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
});
