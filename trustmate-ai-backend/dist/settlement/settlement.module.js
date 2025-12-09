"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const settlement_controller_1 = require("./settlement.controller");
const settlement_service_1 = require("./settlement.service");
const settlement_schema_1 = require("./settlement.schema");
const group_schema_1 = require("../group/group.schema");
const settlement_repository_1 = require("../shared/database/repository/settlement.repository");
const group_repository_1 = require("../shared/database/repository/group.repository");
let SettlementModule = class SettlementModule {
};
exports.SettlementModule = SettlementModule;
exports.SettlementModule = SettlementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: settlement_schema_1.Settlement.name, schema: settlement_schema_1.SettlementSchema },
                { name: group_schema_1.Group.name, schema: group_schema_1.GroupSchema },
            ]),
        ],
        controllers: [settlement_controller_1.SettlementController],
        providers: [
            settlement_service_1.SettlementService,
            settlement_repository_1.SettlementRepository,
            group_repository_1.GroupRepository,
        ],
        exports: [settlement_service_1.SettlementService],
    })
], SettlementModule);
//# sourceMappingURL=settlement.module.js.map