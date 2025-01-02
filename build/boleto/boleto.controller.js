"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boleto_service_1 = __importDefault(require("./boleto.service"));
const router = express_1.default.Router();
const boletoService = new boleto_service_1.default();
router.get('/', (req, res, next) => {
    try {
        const { status, data } = boletoService.index();
        return res.status(status).json(data);
    }
    catch (error) {
        return next(error);
    }
});
router.get('/:codigo', (req, res, next) => {
    try {
        const { status, data } = boletoService.parse(req.params.codigo);
        return res.status(status).json(data);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
