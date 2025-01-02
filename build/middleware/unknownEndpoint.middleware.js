"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = __importDefault(require("../utils/httpStatus"));
exports.default = (_req, res, _next) => {
    return res.status(httpStatus_1.default.NOT_FOUND).json({ status: httpStatus_1.default.NOT_FOUND, message: "Unknown endpoint" });
};
