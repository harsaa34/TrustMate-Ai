import { ConfigService } from '@nestjs/config';
export interface UpiLinkData {
    amount: number;
    receiverUpiId: string;
    receiverName: string;
    note?: string;
    transactionId?: string;
}
export interface UpiLinkResponse {
    upiLink: string;
    qrCode?: string;
    transactionId: string;
}
export declare class UpiService {
    private configService;
    constructor(configService: ConfigService);
    generatePaymentLink(data: UpiLinkData): UpiLinkResponse;
    extractUpiDataFromText(ocrText: string): {
        amount: number;
        upiId: string;
        transactionId: string;
        timestamp: Date;
    };
    verifyPayment(screenshotData: {
        amount: number;
        upiId: string;
    }, expectedData: {
        amount: number;
        upiId: string;
    }): {
        isValid: boolean;
        amountMatch: boolean;
        upiIdMatch: boolean;
        discrepancies?: string[];
    };
    private buildUpiDeepLink;
    private isValidUpiId;
    private generateTransactionId;
    private generateQRCode;
}
