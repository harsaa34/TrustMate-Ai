export enum ReceiptError {
  NOT_FOUND = 'RECEIPT_NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN_ACCESS_TO_RECEIPT',
  INVALID_ID = 'INVALID_RECEIPT_ID',
  CREATE_FAILED = 'FAILED_TO_CREATE_RECEIPT',
  FETCH_FAILED = 'FAILED_TO_FETCH_RECEIPTS',
  UPDATE_FAILED = 'FAILED_TO_UPDATE_RECEIPT',
  DELETE_FAILED = 'FAILED_TO_DELETE_RECEIPT',
  UPLOAD_FAILED = 'FAILED_TO_UPLOAD_RECEIPT_IMAGE',
  PROCESS_FAILED = 'FAILED_TO_PROCESS_RECEIPT',
  ANALYSIS_FAILED = 'FAILED_TO_ANALYZE_RECEIPT',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  OCR_FAILED = 'OCR_PROCESSING_FAILED',
  STATS_FAILED = 'FAILED_TO_FETCH_STATISTICS',
}

export const ReceiptErrorMessages = {
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

export class ReceiptException extends Error {
  constructor(
    public code: ReceiptError,
    message?: string,
    public details?: any,
  ) {
    super(message || ReceiptErrorMessages[code]);
    this.name = 'ReceiptException';
  }
}