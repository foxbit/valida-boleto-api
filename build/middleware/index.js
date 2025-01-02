"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandling_middleware_1 = __importDefault(require("./errorHandling.middleware"));
const unknownEndpoint_middleware_1 = __importDefault(require("./unknownEndpoint.middleware"));
exports.default = {
    errorHandler: errorHandling_middleware_1.default,
    unknownEndpoint: unknownEndpoint_middleware_1.default
};
