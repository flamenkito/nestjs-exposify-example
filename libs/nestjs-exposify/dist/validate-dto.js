"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtoValidationError = void 0;
exports.validateDto = validateDto;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class DtoValidationError extends Error {
    constructor(errors) {
        const messages = errors
            .flatMap((e) => Object.values(e.constraints ?? {}))
            .join(', ');
        super(messages);
        this.errors = errors;
        this.name = 'DtoValidationError';
    }
}
exports.DtoValidationError = DtoValidationError;
async function validateDto(cls, plain) {
    const instance = (0, class_transformer_1.plainToInstance)(cls, plain);
    const errors = await (0, class_validator_1.validate)(instance);
    if (errors.length > 0) {
        throw new DtoValidationError(errors);
    }
    return instance;
}
//# sourceMappingURL=validate-dto.js.map