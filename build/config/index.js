"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    app: {
        port: Number(process.env.PORT) || 8080,
        host: process.env.APP_HOST || "http://localhost",
    },
};
