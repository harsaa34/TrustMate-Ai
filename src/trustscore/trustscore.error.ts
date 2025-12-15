export enum TrustScoreError {
  NOT_FOUND = 'TRUST_SCORE_NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN_ACCESS_TO_TRUST_SCORE',
  INVALID_ID = 'INVALID_TRUST_SCORE_ID',
  CREATE_FAILED = 'FAILED_TO_CREATE_TRUST_SCORE',
  FETCH_FAILED = 'FAILED_TO_FETCH_TRUST_SCORES',
  UPDATE_FAILED = 'FAILED_TO_UPDATE_TRUST_SCORE',
  DELETE_FAILED = 'FAILED_TO_DELETE_TRUST_SCORE',
  INVALID_SCORE = 'INVALID_TRUST_SCORE_VALUE',
  EXPIRED = 'TRUST_SCORE_EXPIRED',
  DUPLICATE = 'DUPLICATE_TRUST_SCORE',
}

export const TrustScoreErrorMessages = {
  [TrustScoreError.NOT_FOUND]: 'Trust score not found or has been deleted',
  [TrustScoreError.FORBIDDEN]: 'You do not have permission to access this trust score',
  [TrustScoreError.INVALID_ID]: 'Invalid trust score ID format',
  [TrustScoreError.CREATE_FAILED]: 'Failed to create trust score. Please try again',
  [TrustScoreError.FETCH_FAILED]: 'Failed to fetch trust scores. Please try again',
  [TrustScoreError.UPDATE_FAILED]: 'Failed to update trust score. Please try again',
  [TrustScoreError.DELETE_FAILED]: 'Failed to delete trust score. Please try again',
  [TrustScoreError.INVALID_SCORE]: 'Trust score must be between 0 and 100',
  [TrustScoreError.EXPIRED]: 'Trust score has expired and is no longer valid',
  [TrustScoreError.DUPLICATE]: 'A trust score already exists for this entity',
};

export class TrustScoreException extends Error {
  constructor(
    public code: TrustScoreError,
    message?: string,
    public details?: any,
  ) {
    super(message || TrustScoreErrorMessages[code]);
    this.name = 'TrustScoreException';
  }
}