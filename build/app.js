"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const config_1 = __importDefault(require("./config"));
const app_controller_1 = __importDefault(require("./app.controller"));
const boleto_controller_1 = __importDefault(require("./boleto/boleto.controller"));
const middleware_1 = __importDefault(require("./middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// app setup
app.disable('x-powered-by');
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// swagger docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// controllers
app.use('/', app_controller_1.default);
app.use('/boleto', boleto_controller_1.default);
// middlewares
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
// listening to requests
app.listen(config_1.default.app.port, () => {
    console.log(`\n[server]: Server running at ${config_1.default.app.host}:${config_1.default.app.port} 🤙\n`);
    console.log(`[docs]: API documentation available at ${config_1.default.app.host}:${config_1.default.app.port}/api-docs\n`);
});
