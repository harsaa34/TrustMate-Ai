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
exports.TrustScoreSchema = exports.TrustScore = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const trustscore_dto_1 = require("./trustscore.dto");
let TrustScore = class TrustScore {
    score;
    maxScore;
    minScore;
    confidence;
    factors;
    entityType;
    entityId;
    algorithmVersion;
    calculatedAt;
    expiresAt;
    metadata;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
};
exports.TrustScore = TrustScore;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, min: 0, max: 100 }),
    __metadata("design:type", Number)
], TrustScore.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, default: 100 }),
    __metadata("design:type", Number)
], TrustScore.prototype, "maxScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, default: 0 }),
    __metadata("design:type", Number)
], TrustScore.prototype, "minScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 1, default: 1 }),
    __metadata("design:type", Number)
], TrustScore.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], TrustScore.prototype, "factors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: Object.values(trustscore_dto_1.EntityType), required: true }),
    __metadata("design:type", String)
], TrustScore.prototype, "entityType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], TrustScore.prototype, "entityId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TrustScore.prototype, "algorithmVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], TrustScore.prototype, "calculatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], TrustScore.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed, default: {} }),
    __metadata("design:type", Object)
], TrustScore.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true, index: true }),
    __metadata("design:type", Boolean)
], TrustScore.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrustScore.prototype, "createdBy", void 0);
exports.TrustScore = TrustScore = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                const { _id, ...rest } = ret;
                return { id: _id.toString(), ...rest };
            },
        },
    })
], TrustScore);
exports.TrustScoreSchema = mongoose_1.SchemaFactory.createForClass(TrustScore);
exports.TrustScoreSchema.index({ entityType: 1, entityId: 1 });
exports.TrustScoreSchema.index({ createdBy: 1, isActive: 1 });
exports.TrustScoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.TrustScoreSchema.index({ score: 1 });
exports.TrustScoreSchema.index({ calculatedAt: -1 });
//# sourceMappingURL=trustscore.schema.js.map