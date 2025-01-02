"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateTime_1 = __importDefault(require("../utils/DateTime"));
const exceptions_1 = require("../utils/exceptions");
const httpStatus_1 = __importDefault(require("../utils/httpStatus"));
class BoletoService {
    index() {
        return { status: httpStatus_1.default.OK, data: { message: 'OK' } };
    }
    parse(code) {
        if (!code)
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, "Missing code");
        if (Number.isNaN(Number(code)))
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, "Code must contain numeric characters only");
        if (code.length === 47) {
            return this.handleBoletoBancario(code);
        }
        else if (code.length === 48) {
            return this.handleBoletoConcessionaria(code);
        }
        throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, "Invalid code format: code is either too short or too long");
    }
    handleBoletoBancario(code) {
        // para linha digitável: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
        const codeBlocks = {
            block_1: code.substring(0, 10),
            block_2: code.substring(10, 21),
            block_3: code.substring(21, 32),
            verifier_digit: code[32],
            block_5: code.substring(33, 47) // UUUUVVVVVVVVVV
        };
        this.validateBankCode({
            block_1: codeBlocks.block_1,
            block_2: codeBlocks.block_2,
            block_3: codeBlocks.block_3
        });
        const expirationFactor = Number(codeBlocks.block_5.substring(0, 4));
        return {
            status: httpStatus_1.default.OK,
            data: {
                barCode: this.convertToBankBarCode(code),
                amount: this.getBankFormattedAmountFromBlock(codeBlocks.block_5),
                expirationDate: DateTime_1.default.getDateFromExpirationFactor(expirationFactor),
            },
        };
    }
    handleBoletoConcessionaria(code) {
        // para linha digitável: AAAAAAAAAAA(X) BBBBBBBBBBB(Y) CCCCCCCCCCC(Z) DDDDDDDDDDD(W)
        const codeBlocks = {
            block_1: code.substring(0, 12),
            block_2: code.substring(12, 24),
            block_3: code.substring(24, 36),
            block_4: code.substring(36, 48) // DDDDDDDDDDD(W)
        };
        const barCode = this.convertToConcessionariaBarCode(codeBlocks);
        this.validateConcessionariaCode(codeBlocks, barCode);
        return {
            status: httpStatus_1.default.OK,
            data: {
                barCode,
                amount: this.getConcessionariaAmount(barCode),
                expirationDate: this.getConcessionariaExpirationDate(barCode),
            },
        };
    }
    convertToBankBarCode(code) {
        // AAA $ BBBBB ( DV ) CCCCCC DDDD ( DV ) DDDDDDDDDD ( DV ) EEEEEEEEEEEEEEE (linha digitável | 47 characters)
        // ==
        // AAA $ EEEEEEEEEEEEEEE BBBBB CCCCCC DDDDDDDDDDDDDD (código de barras | 44 characters)
        const codeBlocks = {
            A: code.substring(0, 3),
            $: code[3],
            B: code.substring(4, 9),
            C: code.substring(10, 16),
            D: code.substring(16, 20) + code.substring(21, 31),
            E: code.substring(code.length - 15, code.length),
        };
        const { A, $, B, C, D, E } = codeBlocks;
        return A + $ + E + B + C + D;
    }
    getBankFormattedAmountFromBlock(block_5) {
        const amount = block_5.substring(block_5.length - 10, block_5.length);
        if (Number.isNaN(Number(amount))) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, "Invalid amount");
        }
        return (Number(amount) / 100).toFixed(2).toString();
    }
    ;
    // anexo IV
    validateBankCode(codeBlocks) {
        let multiplier = 2;
        Object.values(codeBlocks).forEach(block => {
            multiplier = this.validateBankVerifierDigit(block, multiplier);
        });
    }
    validateBankVerifierDigit(block, multiplier = 2) {
        const verifierDigit = Number(block[block.length - 1]);
        let verifierFactor = 0;
        for (let i = 0; i < block.length - 1; i++) {
            const digit = block[i];
            const result = Number(digit) * multiplier;
            if (result > 9) {
                verifierFactor += this.convertDoubleToSingleDigit(result);
            }
            else {
                verifierFactor += result;
            }
            multiplier = multiplier === 2 ? 1 : 2;
        }
        let calculatedVerifier;
        if (verifierFactor < 10) {
            calculatedVerifier = 10 - verifierFactor;
        }
        else {
            const firstDigit = String(verifierFactor)[0];
            const nextDigit = String(Number(firstDigit) + 1);
            const nextDezena = Number(nextDigit + 0);
            calculatedVerifier = nextDezena - verifierFactor;
            if (calculatedVerifier === 10)
                calculatedVerifier = 0;
        }
        if (verifierDigit !== calculatedVerifier) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, `Wrong verifier digit. Expected ${calculatedVerifier}, but got ${verifierDigit}.`);
        }
        return multiplier;
    }
    convertDoubleToSingleDigit(digit) {
        const result = String(digit)
            .split("")
            .map(str => Number(str))
            .reduce((prev, current) => prev + current);
        if (result > 9)
            return this.convertDoubleToSingleDigit(result);
        return result;
    }
    convertToConcessionariaBarCode(codeBlocks) {
        // concatenates code blocks while removing verifier digits
        return Object.values(codeBlocks).reduce((prev, current, index) => {
            if (index === 1)
                return prev.substring(0, 11) + current.substring(0, 11);
            return prev + current.substring(0, 11);
        });
    }
    validateConcessionariaCode(codeBlocks, barCode) {
        // checar código de moeda - modulo10 ou modulo11
        const currencyCode = Number(barCode[2]);
        // módulo 10
        if ([6, 7].includes(currencyCode)) {
            this.validateFourthVerificationDigitModulo10(barCode);
            Object.values(codeBlocks).reverse().forEach((block) => {
                this.validateConcessionariaVerifierDigitModulo10(block);
            });
            return;
        }
        // módulo 11
        if ([8, 9].includes(currencyCode)) {
            this.validateFourthVerificationDigitModulo11(barCode);
            Object.values(codeBlocks).forEach((block) => {
                this.validateConcessionariaVerifierDigitModulo11(block);
            });
            return;
        }
        throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, `Invalid value identifier: got ${currencyCode}, but expected 6, 7, 8 or 9.`);
    }
    validateFourthVerificationDigitModulo10(barCode) {
        const blocks = {
            block_1: barCode.substring(0, 3),
            verification_digit: barCode[3],
            block_2: barCode.substring(4, barCode.length)
        };
        // builds the code without the verifier digit and reverses it in preparation for applying the multiplier
        const reversedCodeWithoutVerifier = (blocks.block_1 + blocks.block_2).split("").reverse().join("");
        let multiplier = 2;
        let verifierFactor = 0;
        for (let i = 0; i < reversedCodeWithoutVerifier.length; i++) {
            const digit = reversedCodeWithoutVerifier[i];
            const result = Number(digit) * multiplier;
            if (result > 9) {
                verifierFactor += this.convertDoubleToSingleDigit(result);
            }
            else {
                verifierFactor += result;
            }
            multiplier = multiplier === 2 ? 1 : 2;
        }
        const remainder = verifierFactor % 10;
        const DAC = 10 - remainder;
        if (DAC !== Number(blocks.verification_digit)) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, `Wrong DAC for resulting barcode. Expected ${DAC}, but got ${blocks.verification_digit}.`);
        }
    }
    validateFourthVerificationDigitModulo11(barCode) {
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9];
        let multiplierIndex = 0;
        const blocks = {
            block_1: barCode.substring(0, 3),
            verification_digit: barCode[3],
            block_2: barCode.substring(4, barCode.length)
        };
        // builds the code without the verifier digit and reverses it in preparation for applying the multiplier
        const codeWithoutVerifier = (blocks.block_1 + blocks.block_2).split("").reverse().join("");
        let verifierFactor = 0;
        for (let i = 0; i < codeWithoutVerifier.length; i++) {
            const digit = codeWithoutVerifier[i];
            verifierFactor += Number(digit) * multipliers[multiplierIndex];
            multiplierIndex = multiplierIndex === multipliers.length - 1 ? 0 : multiplierIndex + 1;
        }
        const remainder = verifierFactor % 11;
        let DAC;
        if (remainder === 0 || remainder === 1) {
            DAC = 0;
        }
        else if (remainder === 10) {
            DAC = 1;
        }
        else {
            DAC = 11 - remainder;
        }
        if (DAC !== Number(blocks.verification_digit)) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, `Wrong DAC for resulting barcode. Expected ${DAC}, but got ${blocks.verification_digit}.`);
        }
    }
    validateConcessionariaVerifierDigitModulo10(block) {
        let verifierFactor = 0;
        const verifierDigit = block[block.length - 1];
        const reversedCodeWithoutVerifier = block.substring(0, 11).split("").reverse().join("");
        let multiplier = 2;
        for (let i = 0; i < reversedCodeWithoutVerifier.length; i++) {
            const digit = reversedCodeWithoutVerifier[i];
            let result = Number(digit) * multiplier;
            if (result > 9) {
                verifierFactor += this.convertDoubleToSingleDigit(result);
            }
            else {
                verifierFactor += result;
            }
            multiplier = multiplier === 2 ? 1 : 2;
        }
        const remainder = verifierFactor % 10;
        let DAC;
        if (remainder === 0)
            DAC = 0;
        else
            DAC = 10 - remainder;
        if (DAC !== Number(verifierDigit)) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, `Wrong DAC for resulting barcode. Expected ${DAC}, but got ${verifierDigit}.`);
        }
    }
    validateConcessionariaVerifierDigitModulo11(block) {
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4];
        let multiplierIndex = 0;
        let verifierFactor = 0;
        const verifierDigit = block[block.length - 1];
        const codeWithoutVerifier = block.substring(0, 11).split("").reverse().join("");
        for (let i = 0; i < codeWithoutVerifier.length; i++) {
            const digit = codeWithoutVerifier[i];
            // increments
            verifierFactor += Number(digit) * multipliers[multiplierIndex];
            ;
            // moves multiplier to the next digit
            multiplierIndex = multiplierIndex === multipliers.length - 1 ? 0 : multiplierIndex + 1;
        }
        const remainder = verifierFactor % 11;
        let DAC;
        if (remainder === 0 || remainder === 1) {
            DAC = 0;
        }
        else if (remainder === 10) {
            DAC = 1;
        }
        else {
            DAC = 11 - remainder;
        }
        if (DAC !== Number(verifierDigit)) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, `Wrong DAC for resulting barcode. Expected ${DAC}, but got ${verifierDigit}.`);
        }
    }
    getConcessionariaAmount(barCode) {
        const amount = barCode.substring(4, 15);
        if (Number.isNaN(Number(amount))) {
            throw new exceptions_1.HttpException(httpStatus_1.default.BAD_REQUEST, "Invalid amount");
        }
        return (Number(amount) / 100).toFixed(2).toString();
    }
    getConcessionariaExpirationDate(barCode) {
        const date = barCode.substring(19, 27);
        // check whether date makes sense. if not, return null.
        if (Number(date) > 20500101 || Number(date) < 19500101)
            return null;
        return date;
    }
}
exports.default = BoletoService;
