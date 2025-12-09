"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let UpiService = class UpiService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    generatePaymentLink(data) {
        const { amount, receiverUpiId, receiverName, note, transactionId } = data;
        if (!this.isValidUpiId(receiverUpiId)) {
            throw new Error('Invalid UPI ID format');
        }
        const upiLink = this.buildUpiDeepLink({
            pa: receiverUpiId,
            pn: receiverName,
            am: amount.toFixed(2),
            cu: 'INR',
            tn: note || `Settlement payment via TrustMate`,
        });
        const response = {
            upiLink,
            transactionId: transactionId || this.generateTransactionId(),
        };
        return response;
    }
    extractUpiDataFromText(ocrText) {
        const patterns = {
            amount: /(?:₹|rs|inr)[\s]*([\d,]+\.?\d*)/i,
            upiId: /([a-zA-Z0-9.\-_]+@[a-zA-Z]+)/,
            transactionId: /(?:ref|transaction|txn)[\s]*[#:]?[\s]*([A-Z0-9]{8,})/i,
            date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
            time: /(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)/i,
        };
        const amountMatch = ocrText.match(patterns.amount);
        const upiIdMatch = ocrText.match(patterns.upiId);
        const txnMatch = ocrText.match(patterns.transactionId);
        if (!amountMatch || !upiIdMatch) {
            throw new Error('Could not extract UPI payment data from screenshot');
        }
        return {
            amount: parseFloat(amountMatch[1].replace(/,/g, '')),
            upiId: upiIdMatch[1].toLowerCase(),
            transactionId: txnMatch?.[1] || 'N/A',
            timestamp: new Date(),
        };
    }
    verifyPayment(screenshotData, expectedData) {
        const discrepancies = [];
        const amountTolerance = expectedData.amount * 0.01;
        const amountMatch = Math.abs(screenshotData.amount - expectedData.amount) <= amountTolerance;
        if (!amountMatch) {
            discrepancies.push(`Amount mismatch: Expected ₹${expectedData.amount}, Found ₹${screenshotData.amount}`);
        }
        const upiIdMatch = screenshotData.upiId.toLowerCase() === expectedData.upiId.toLowerCase();
        if (!upiIdMatch) {
            discrepancies.push(`UPI ID mismatch: Expected ${expectedData.upiId}, Found ${screenshotData.upiId}`);
        }
        return {
            isValid: amountMatch && upiIdMatch,
            amountMatch,
            upiIdMatch,
            discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
        };
    }
    buildUpiDeepLink(params) {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                urlParams.append(key, value);
            }
        });
        return `upi://pay?${urlParams.toString()}`;
    }
    isValidUpiId(upiId) {
        const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/;
        return upiRegex.test(upiId);
    }
    generateTransactionId() {
        return `TR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    generateQRCode(upiLink) {
        return '';
    }
};
exports.UpiService = UpiService;
exports.UpiService = UpiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UpiService);
//# sourceMappingURL=upi.service.js.map