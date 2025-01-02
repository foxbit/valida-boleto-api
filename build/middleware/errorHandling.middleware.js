"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = __importDefault(require("../utils/httpStatus"));
exports.default = (err, _req, res, _next) => {
    const status = err.status || httpStatus_1.default.INTERNAL_ERROR;
    const message = err.message || "Something went horribly wrong";
    return res.status(status).json({ status, message });
};
