"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptException = exports.ReceiptErrorMessages = exports.ReceiptError = void 0;
var ReceiptError;
(function (ReceiptError) {
    ReceiptError["NOT_FOUND"] = "RECEIPT_NOT_FOUND";
    ReceiptError["FORBIDDEN"] = "FORBIDDEN_ACCESS_TO_RECEIPT";
    ReceiptError["INVALID_ID"] = "INVALID_RECEIPT_ID";
    ReceiptError["CREATE_FAILED"] = "FAILED_TO_CREATE_RECEIPT";
    ReceiptError["FETCH_FAILED"] = "FAILED_TO_FETCH_RECEIPTS";
    ReceiptError["UPDATE_FAILED"] = "FAILED_TO_UPDATE_RECEIPT";
    ReceiptError["DELETE_FAILED"] = "FAILED_TO_DELETE_RECEIPT";
    ReceiptError["UPLOAD_FAILED"] = "FAILED_TO_UPLOAD_RECEIPT_IMAGE";
    ReceiptError["PROCESS_FAILED"] = "FAILED_TO_PROCESS_RECEIPT";
    ReceiptError["ANALYSIS_FAILED"] = "FAILED_TO_ANALYZE_RECEIPT";
    ReceiptError["INVALID_FILE_TYPE"] = "INVALID_FILE_TYPE";
    ReceiptError["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
    ReceiptError["OCR_FAILED"] = "OCR_PROCESSING_FAILED";
    ReceiptError["STATS_FAILED"] = "FAILED_TO_FETCH_STATISTICS";
})(ReceiptError || (exports.ReceiptError = ReceiptError = {}));
exports.ReceiptErrorMessages = {
    [ReceiptError.NOT_FOUND]: 'Receipt not found or has been deleted',
    [ReceiptError.FORBIDDEN]: 'You do not have permission to access this receipt',
    [ReceiptError.INVALID_ID]: 'Invalid receipt ID format',
    [ReceiptError.CREATE_FAILED]: 'Failed to create receipt. Please try again',
    [ReceiptError.FETCH_FAILED]: 'Failed to fetch receipts. Please try again',
    [ReceiptError.UPDATE_FAILED]: 'Failed to update receipt. Please try again',
    [ReceiptError.DELETE_FAILED]: 'Failed to delete receipt. Please try again',
    [ReceiptError.UPLOAD_FAILED]: 'Failed to upload receipt image',
    [ReceiptError.PROCESS_FAILED]: 'Failed to process receipt image',
    [ReceiptError.ANALYSIS_FAILED]: 'Failed to analyze receipt',
    [ReceiptError.INVALID_FILE_TYPE]: 'Only image and PDF files are allowed',
    [ReceiptError.FILE_TOO_LARGE]: 'File size must be less than 10MB',
    [ReceiptError.OCR_FAILED]: 'Failed to extract text from receipt',
    [ReceiptError.STATS_FAILED]: 'Failed to fetch receipt statistics',
};
class ReceiptException extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message || exports.ReceiptErrorMessages[code]);
        this.code = code;
        this.details = details;
        this.name = 'ReceiptException';
    }
}
exports.ReceiptException = ReceiptException;
//# sourceMappingURL=receipt.error.js.map