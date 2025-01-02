"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const httpStatus_1 = __importDefault(require("./utils/httpStatus"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    return res.status(httpStatus_1.default.OK).json({
        title: "Teste Prático BackEnd",
        message: "API para consultar linhas digitáveis de boleto de título bancário e pagamento de concessionárias."
    });
});
exports.default = router;
