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
exports.FraudCheckSchema = exports.FraudCheck = exports.RiskLevel = exports.FraudStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var FraudStatus;
(function (FraudStatus) {
    FraudStatus["PENDING"] = "PENDING";
    FraudStatus["APPROVED"] = "APPROVED";
    FraudStatus["REJECTED"] = "REJECTED";
    FraudStatus["FLAGGED"] = "FLAGGED";
    FraudStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(FraudStatus || (exports.FraudStatus = FraudStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
let FraudCheck = class FraudCheck {
    transactionId;
    amount;
    currency;
    merchantId;
    customerId;
    deviceId;
    ipAddress;
    location;
    riskScore;
    riskLevel;
    flags;
    status;
    analysisResult;
    reviewNotes;
    reviewedBy;
    reviewedAt;
    isActive;
    createdBy;
    metadata;
    createdAt;
    updatedAt;
};
exports.FraudCheck = FraudCheck;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], FraudCheck.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], FraudCheck.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, default: 'INR' }),
    __metadata("design:type", String)
], FraudCheck.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], FraudCheck.prototype, "merchantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], FraudCheck.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], FraudCheck.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FraudCheck.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], FraudCheck.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], FraudCheck.prototype, "riskScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: RiskLevel, required: true }),
    __metadata("design:type", String)
], FraudCheck.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], FraudCheck.prototype, "flags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: FraudStatus, default: FraudStatus.PENDING }),
    __metadata("design:type", String)
], FraudCheck.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], FraudCheck.prototype, "analysisResult", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FraudCheck.prototype, "reviewNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FraudCheck.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], FraudCheck.prototype, "reviewedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true, index: true }),
    __metadata("design:type", Boolean)
], FraudCheck.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FraudCheck.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed, default: {} }),
    __metadata("design:type", Object)
], FraudCheck.prototype, "metadata", void 0);
exports.FraudCheck = FraudCheck = __decorate([
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
], FraudCheck);
exports.FraudCheckSchema = mongoose_1.SchemaFactory.createForClass(FraudCheck);
exports.FraudCheckSchema.index({ transactionId: 1, createdBy: 1 });
exports.FraudCheckSchema.index({ merchantId: 1, status: 1 });
exports.FraudCheckSchema.index({ customerId: 1, createdAt: -1 });
exports.FraudCheckSchema.index({ riskLevel: 1, status: 1 });
exports.FraudCheckSchema.index({ createdAt: -1 });
exports.FraudCheckSchema.index({ riskScore: -1 });
exports.FraudCheckSchema.index({ status: 1, isActive: 1 });
exports.FraudCheckSchema.index({ createdBy: 1, isActive: 1, createdAt: -1 });
//# sourceMappingURL=fraudcheck.schema.js.map