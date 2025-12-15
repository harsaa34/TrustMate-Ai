export enum FraudCheckError {
  NOT_FOUND = 'FRAUD_CHECK_NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN_ACCESS_TO_FRAUD_CHECK',
  INVALID_ID = 'INVALID_FRAUD_CHECK_ID',
  CREATE_FAILED = 'FAILED_TO_CREATE_FRAUD_CHECK',
  FETCH_FAILED = 'FAILED_TO_FETCH_FRAUD_CHECKS',
  UPDATE_FAILED = 'FAILED_TO_UPDATE_FRAUD_CHECK',
  DELETE_FAILED = 'FAILED_TO_DELETE_FRAUD_CHECK',
  ANALYSIS_FAILED = 'FAILED_TO_ANALYZE_TRANSACTION',
  INVALID_RISK_SCORE = 'INVALID_RISK_SCORE_VALUE',
  DUPLICATE_TRANSACTION = 'DUPLICATE_TRANSACTION_CHECK',
  STATS_FAILED = 'FAILED_TO_FETCH_STATISTICS',
}

export const FraudCheckErrorMessages = {
  [FraudCheckError.NOT_FOUND]: 'Fraud check not found or has been deleted',
  [FraudCheckError.FORBIDDEN]: 'You do not have permission to access this fraud check',
  [FraudCheckError.INVALID_ID]: 'Invalid fraud check ID format',
  [FraudCheckError.CREATE_FAILED]: 'Failed to create fraud check. Please try again',
  [FraudCheckError.FETCH_FAILED]: 'Failed to fetch fraud checks. Please try again',
  [FraudCheckError.UPDATE_FAILED]: 'Failed to update fraud check. Please try again',
  [FraudCheckError.DELETE_FAILED]: 'Failed to delete fraud check. Please try again',
  [FraudCheckError.ANALYSIS_FAILED]: 'Failed to analyze transaction for fraud',
  [FraudCheckError.INVALID_RISK_SCORE]: 'Risk score must be between 0 and 100',
  [FraudCheckError.DUPLICATE_TRANSACTION]: 'A fraud check already exists for this transaction',
  [FraudCheckError.STATS_FAILED]: 'Failed to fetch fraud detection statistics',
};

export class FraudCheckException extends Error {
  constructor(
    public code: FraudCheckError,
    message?: string,
    public details?: any,
  ) {
    super(message || FraudCheckErrorMessages[code]);
    this.name = 'FraudCheckException';
  }
}