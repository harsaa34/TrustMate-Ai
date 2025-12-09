"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustScoreException = exports.TrustScoreErrorMessages = exports.TrustScoreError = void 0;
var TrustScoreError;
(function (TrustScoreError) {
    TrustScoreError["NOT_FOUND"] = "TRUST_SCORE_NOT_FOUND";
    TrustScoreError["FORBIDDEN"] = "FORBIDDEN_ACCESS_TO_TRUST_SCORE";
    TrustScoreError["INVALID_ID"] = "INVALID_TRUST_SCORE_ID";
    TrustScoreError["CREATE_FAILED"] = "FAILED_TO_CREATE_TRUST_SCORE";
    TrustScoreError["FETCH_FAILED"] = "FAILED_TO_FETCH_TRUST_SCORES";
    TrustScoreError["UPDATE_FAILED"] = "FAILED_TO_UPDATE_TRUST_SCORE";
    TrustScoreError["DELETE_FAILED"] = "FAILED_TO_DELETE_TRUST_SCORE";
    TrustScoreError["INVALID_SCORE"] = "INVALID_TRUST_SCORE_VALUE";
    TrustScoreError["EXPIRED"] = "TRUST_SCORE_EXPIRED";
    TrustScoreError["DUPLICATE"] = "DUPLICATE_TRUST_SCORE";
})(TrustScoreError || (exports.TrustScoreError = TrustScoreError = {}));
exports.TrustScoreErrorMessages = {
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
class TrustScoreException extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message || exports.TrustScoreErrorMessages[code]);
        this.code = code;
        this.details = details;
        this.name = 'TrustScoreException';
    }
}
exports.TrustScoreException = TrustScoreException;
//# sourceMappingURL=trustscore.error.js.map