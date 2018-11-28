import * as ajv from "ajv";
import ajvErrors = require("ajv-errors");

export default ajvErrors(ajv({$data: true, async: true, allErrors: true, jsonPointers: true}));
