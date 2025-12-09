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
exports.ReceiptSchema = exports.Receipt = exports.ReceiptStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReceiptStatus;
(function (ReceiptStatus) {
    ReceiptStatus["PENDING"] = "PENDING";
    ReceiptStatus["PROCESSING"] = "PROCESSING";
    ReceiptStatus["PROCESSED"] = "PROCESSED";
    ReceiptStatus["ERROR"] = "ERROR";
    ReceiptStatus["ARCHIVED"] = "ARCHIVED";
})(ReceiptStatus || (exports.ReceiptStatus = ReceiptStatus = {}));
let Receipt = class Receipt {
    merchantName;
    amount;
    currency;
    transactionDate;
    imageUrl;
    fileName;
    fileSize;
    mimeType;
    ocrData;
    analysisResult;
    status;
    confidenceScore;
    processedAt;
    paymentMethod;
    notes;
    tags;
    isActive;
    createdBy;
    metadata;
    createdAt;
    updatedAt;
};
exports.Receipt = Receipt;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], Receipt.prototype, "merchantName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], Receipt.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'INR' }),
    __metadata("design:type", String)
], Receipt.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, index: true }),
    __metadata("design:type", Date)
], Receipt.prototype, "transactionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Receipt.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Receipt.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Receipt.prototype, "fileSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Receipt.prototype, "mimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], Receipt.prototype, "ocrData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], Receipt.prototype, "analysisResult", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReceiptStatus, default: ReceiptStatus.PENDING }),
    __metadata("design:type", String)
], Receipt.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Receipt.prototype, "confidenceScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Receipt.prototype, "processedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Receipt.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Receipt.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Receipt.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true, index: true }),
    __metadata("design:type", Boolean)
], Receipt.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Receipt.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed, default: {} }),
    __metadata("design:type", Object)
], Receipt.prototype, "metadata", void 0);
exports.Receipt = Receipt = __decorate([
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
], Receipt);
exports.ReceiptSchema = mongoose_1.SchemaFactory.createForClass(Receipt);
exports.ReceiptSchema.index({ merchantName: 1, createdBy: 1 });
exports.ReceiptSchema.index({ status: 1, createdBy: 1 });
exports.ReceiptSchema.index({ transactionDate: -1 });
exports.ReceiptSchema.index({ amount: 1 });
exports.ReceiptSchema.index({ createdBy: 1, isActive: 1, createdAt: -1 });
exports.ReceiptSchema.index({ tags: 1 });
exports.ReceiptSchema.index({ 'analysisResult.category': 1 });
exports.ReceiptSchema.index({ createdAt: -1, status: 1 });
//# sourceMappingURL=receipt.schema.js.map