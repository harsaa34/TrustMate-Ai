export declare enum TrustScoreError {
    NOT_FOUND = "TRUST_SCORE_NOT_FOUND",
    FORBIDDEN = "FORBIDDEN_ACCESS_TO_TRUST_SCORE",
    INVALID_ID = "INVALID_TRUST_SCORE_ID",
    CREATE_FAILED = "FAILED_TO_CREATE_TRUST_SCORE",
    FETCH_FAILED = "FAILED_TO_FETCH_TRUST_SCORES",
    UPDATE_FAILED = "FAILED_TO_UPDATE_TRUST_SCORE",
    DELETE_FAILED = "FAILED_TO_DELETE_TRUST_SCORE",
    INVALID_SCORE = "INVALID_TRUST_SCORE_VALUE",
    EXPIRED = "TRUST_SCORE_EXPIRED",
    DUPLICATE = "DUPLICATE_TRUST_SCORE"
}
export declare const TrustScoreErrorMessages: {
    TRUST_SCORE_NOT_FOUND: string;
    FORBIDDEN_ACCESS_TO_TRUST_SCORE: string;
    INVALID_TRUST_SCORE_ID: string;
    FAILED_TO_CREATE_TRUST_SCORE: string;
    FAILED_TO_FETCH_TRUST_SCORES: string;
    FAILED_TO_UPDATE_TRUST_SCORE: string;
    FAILED_TO_DELETE_TRUST_SCORE: string;
    INVALID_TRUST_SCORE_VALUE: string;
    TRUST_SCORE_EXPIRED: string;
    DUPLICATE_TRUST_SCORE: string;
};
export declare class TrustScoreException extends Error {
    code: TrustScoreError;
    details?: any | undefined;
    constructor(code: TrustScoreError, message?: string, details?: any | undefined);
}
