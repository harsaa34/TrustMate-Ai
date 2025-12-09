"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApi = exports.UserApiFactory = exports.UserApiFp = exports.UserApiAxiosParamCreator = exports.SettlementControllerGetGroupSettlementsSortOrderEnum = exports.SettlementControllerGetGroupSettlementsSortByEnum = exports.SettlementControllerGetGroupSettlementsStatusEnum = exports.SettlementsApi = exports.SettlementsApiFactory = exports.SettlementsApiFp = exports.SettlementsApiAxiosParamCreator = exports.GroupControllerGetUserGroupsSortOrderEnum = exports.GroupControllerGetUserGroupsSortByEnum = exports.GroupsApi = exports.GroupsApiFactory = exports.GroupsApiFp = exports.GroupsApiAxiosParamCreator = exports.ExpenseControllerGetGroupExpensesSortOrderEnum = exports.ExpenseControllerGetGroupExpensesSortByEnum = exports.ExpenseControllerGetGroupExpensesCategoryEnum = exports.ExpensesApi = exports.ExpensesApiFactory = exports.ExpensesApiFp = exports.ExpensesApiAxiosParamCreator = exports.AuthenticationApi = exports.AuthenticationApiFactory = exports.AuthenticationApiFp = exports.AuthenticationApiAxiosParamCreator = exports.AppApi = exports.AppApiFactory = exports.AppApiFp = exports.AppApiAxiosParamCreator = exports.UpdateSettlementStatusDtoStatusEnum = exports.UpdateGroupDtoCurrencyEnum = exports.UpdateExpenseDtoSplitTypeEnum = exports.UpdateExpenseDtoCategoryEnum = exports.SettlementResponseDtoStatusEnum = exports.GroupResponseDtoMembersInnerRoleEnum = exports.GroupMemberResponseDtoRoleEnum = exports.CreateSettlementDtoPaymentMethodEnum = exports.CreateGroupDtoCurrencyEnum = exports.CreateExpenseDtoSplitTypeEnum = exports.CreateExpenseDtoCategoryEnum = exports.AddMemberDtoRoleEnum = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("./common");
const base_1 = require("./base");
exports.AddMemberDtoRoleEnum = {
    Admin: 'admin',
    Member: 'member'
};
exports.CreateExpenseDtoCategoryEnum = {
    Food: 'food',
    Transport: 'transport',
    Accommodation: 'accommodation',
    Shopping: 'shopping',
    Entertainment: 'entertainment',
    Bills: 'bills',
    Health: 'health',
    Education: 'education',
    Other: 'other'
};
exports.CreateExpenseDtoSplitTypeEnum = {
    Equal: 'equal',
    Percentage: 'percentage',
    Exact: 'exact',
    Shares: 'shares',
    Adjustment: 'adjustment'
};
exports.CreateGroupDtoCurrencyEnum = {
    Inr: 'INR',
    Usd: 'USD',
    Eur: 'EUR',
    Gbp: 'GBP'
};
exports.CreateSettlementDtoPaymentMethodEnum = {
    Upi: 'UPI',
    Cash: 'CASH',
    BankTransfer: 'BANK_TRANSFER',
    CreditCard: 'CREDIT_CARD',
    DebitCard: 'DEBIT_CARD',
    Paytm: 'PAYTM',
    Phonepe: 'PHONEPE',
    GooglePay: 'GOOGLE_PAY'
};
exports.GroupMemberResponseDtoRoleEnum = {
    Admin: 'admin',
    Member: 'member'
};
exports.GroupResponseDtoMembersInnerRoleEnum = {
    Admin: 'admin',
    Member: 'member'
};
exports.SettlementResponseDtoStatusEnum = {
    Pending: 'pending',
    Completed: 'completed',
    Cancelled: 'cancelled'
};
exports.UpdateExpenseDtoCategoryEnum = {
    Food: 'food',
    Transport: 'transport',
    Accommodation: 'accommodation',
    Shopping: 'shopping',
    Entertainment: 'entertainment',
    Bills: 'bills',
    Health: 'health',
    Education: 'education',
    Other: 'other'
};
exports.UpdateExpenseDtoSplitTypeEnum = {
    Equal: 'equal',
    Percentage: 'percentage',
    Exact: 'exact',
    Shares: 'shares',
    Adjustment: 'adjustment'
};
exports.UpdateGroupDtoCurrencyEnum = {
    Inr: 'INR',
    Usd: 'USD',
    Eur: 'EUR',
    Gbp: 'GBP'
};
exports.UpdateSettlementStatusDtoStatusEnum = {
    Pending: 'pending',
    Completed: 'completed',
    Cancelled: 'cancelled'
};
const AppApiAxiosParamCreator = function (configuration) {
    return {
        appControllerGetHello: async (options = {}) => {
            const localVarPath = `/api`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
exports.AppApiAxiosParamCreator = AppApiAxiosParamCreator;
const AppApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.AppApiAxiosParamCreator)(configuration);
    return {
        async appControllerGetHello(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.appControllerGetHello(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AppApi.appControllerGetHello']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
exports.AppApiFp = AppApiFp;
const AppApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.AppApiFp)(configuration);
    return {
        appControllerGetHello(options) {
            return localVarFp.appControllerGetHello(options).then((request) => request(axios, basePath));
        },
    };
};
exports.AppApiFactory = AppApiFactory;
class AppApi extends base_1.BaseAPI {
    appControllerGetHello(options) {
        return (0, exports.AppApiFp)(this.configuration).appControllerGetHello(options).then((request) => request(this.axios, this.basePath));
    }
}
exports.AppApi = AppApi;
const AuthenticationApiAxiosParamCreator = function (configuration) {
    return {
        authControllerChangePassword: async (changePasswordDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerChangePassword', 'changePasswordDto', changePasswordDto);
            const localVarPath = `/api/auth/change-password`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(changePasswordDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerCheckEmailAvailability: async (email, options = {}) => {
            (0, common_1.assertParamExists)('authControllerCheckEmailAvailability', 'email', email);
            const localVarPath = `/api/auth/check-email/{email}`
                .replace(`{${"email"}}`, encodeURIComponent(String(email)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerDeleteAccount: async (options = {}) => {
            const localVarPath = `/api/auth/account`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerForgotPassword: async (forgotPasswordDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerForgotPassword', 'forgotPasswordDto', forgotPasswordDto);
            const localVarPath = `/api/auth/forgot-password`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(forgotPasswordDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerGetProfile: async (options = {}) => {
            const localVarPath = `/api/auth/profile`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerHandleResetPasswordLink: async (token, options = {}) => {
            (0, common_1.assertParamExists)('authControllerHandleResetPasswordLink', 'token', token);
            const localVarPath = `/api/auth/reset-password`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (token !== undefined) {
                localVarQueryParameter['token'] = token;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerLogin: async (loginDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerLogin', 'loginDto', loginDto);
            const localVarPath = `/api/auth/login`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(loginDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerLogout: async (options = {}) => {
            const localVarPath = `/api/auth/logout`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerLogoutFromAllDevices: async (options = {}) => {
            const localVarPath = `/api/auth/logout-all`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerRefreshToken: async (refreshTokenDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerRefreshToken', 'refreshTokenDto', refreshTokenDto);
            const localVarPath = `/api/auth/refresh-token`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(refreshTokenDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerResendVerificationEmail: async (options = {}) => {
            const localVarPath = `/api/auth/resend-verification`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerResetPassword: async (resetPasswordDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerResetPassword', 'resetPasswordDto', resetPasswordDto);
            const localVarPath = `/api/auth/reset-password`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(resetPasswordDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerSignup: async (signUpDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerSignup', 'signUpDto', signUpDto);
            const localVarPath = `/api/auth/signup`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(signUpDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerUpdateProfile: async (updateProfileDto, options = {}) => {
            (0, common_1.assertParamExists)('authControllerUpdateProfile', 'updateProfileDto', updateProfileDto);
            const localVarPath = `/api/auth/profile`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(updateProfileDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerValidateToken: async (options = {}) => {
            const localVarPath = `/api/auth/validate`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        authControllerVerifyEmail: async (token, options = {}) => {
            (0, common_1.assertParamExists)('authControllerVerifyEmail', 'token', token);
            const localVarPath = `/api/auth/verify-email`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (token !== undefined) {
                localVarQueryParameter['token'] = token;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
exports.AuthenticationApiAxiosParamCreator = AuthenticationApiAxiosParamCreator;
const AuthenticationApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.AuthenticationApiAxiosParamCreator)(configuration);
    return {
        async authControllerChangePassword(changePasswordDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerChangePassword(changePasswordDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerChangePassword']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerCheckEmailAvailability(email, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerCheckEmailAvailability(email, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerCheckEmailAvailability']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerDeleteAccount(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerDeleteAccount(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerDeleteAccount']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerForgotPassword(forgotPasswordDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerForgotPassword(forgotPasswordDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerForgotPassword']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerGetProfile(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerGetProfile(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerGetProfile']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerHandleResetPasswordLink(token, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerHandleResetPasswordLink(token, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerHandleResetPasswordLink']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerLogin(loginDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerLogin(loginDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerLogin']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerLogout(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerLogout(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerLogout']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerLogoutFromAllDevices(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerLogoutFromAllDevices(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerLogoutFromAllDevices']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerRefreshToken(refreshTokenDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerRefreshToken(refreshTokenDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerRefreshToken']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerResendVerificationEmail(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerResendVerificationEmail(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerResendVerificationEmail']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerResetPassword(resetPasswordDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerResetPassword(resetPasswordDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerResetPassword']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerSignup(signUpDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerSignup(signUpDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerSignup']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerUpdateProfile(updateProfileDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerUpdateProfile(updateProfileDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerUpdateProfile']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerValidateToken(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerValidateToken(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerValidateToken']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async authControllerVerifyEmail(token, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerVerifyEmail(token, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['AuthenticationApi.authControllerVerifyEmail']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
exports.AuthenticationApiFp = AuthenticationApiFp;
const AuthenticationApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.AuthenticationApiFp)(configuration);
    return {
        authControllerChangePassword(changePasswordDto, options) {
            return localVarFp.authControllerChangePassword(changePasswordDto, options).then((request) => request(axios, basePath));
        },
        authControllerCheckEmailAvailability(email, options) {
            return localVarFp.authControllerCheckEmailAvailability(email, options).then((request) => request(axios, basePath));
        },
        authControllerDeleteAccount(options) {
            return localVarFp.authControllerDeleteAccount(options).then((request) => request(axios, basePath));
        },
        authControllerForgotPassword(forgotPasswordDto, options) {
            return localVarFp.authControllerForgotPassword(forgotPasswordDto, options).then((request) => request(axios, basePath));
        },
        authControllerGetProfile(options) {
            return localVarFp.authControllerGetProfile(options).then((request) => request(axios, basePath));
        },
        authControllerHandleResetPasswordLink(token, options) {
            return localVarFp.authControllerHandleResetPasswordLink(token, options).then((request) => request(axios, basePath));
        },
        authControllerLogin(loginDto, options) {
            return localVarFp.authControllerLogin(loginDto, options).then((request) => request(axios, basePath));
        },
        authControllerLogout(options) {
            return localVarFp.authControllerLogout(options).then((request) => request(axios, basePath));
        },
        authControllerLogoutFromAllDevices(options) {
            return localVarFp.authControllerLogoutFromAllDevices(options).then((request) => request(axios, basePath));
        },
        authControllerRefreshToken(refreshTokenDto, options) {
            return localVarFp.authControllerRefreshToken(refreshTokenDto, options).then((request) => request(axios, basePath));
        },
        authControllerResendVerificationEmail(options) {
            return localVarFp.authControllerResendVerificationEmail(options).then((request) => request(axios, basePath));
        },
        authControllerResetPassword(resetPasswordDto, options) {
            return localVarFp.authControllerResetPassword(resetPasswordDto, options).then((request) => request(axios, basePath));
        },
        authControllerSignup(signUpDto, options) {
            return localVarFp.authControllerSignup(signUpDto, options).then((request) => request(axios, basePath));
        },
        authControllerUpdateProfile(updateProfileDto, options) {
            return localVarFp.authControllerUpdateProfile(updateProfileDto, options).then((request) => request(axios, basePath));
        },
        authControllerValidateToken(options) {
            return localVarFp.authControllerValidateToken(options).then((request) => request(axios, basePath));
        },
        authControllerVerifyEmail(token, options) {
            return localVarFp.authControllerVerifyEmail(token, options).then((request) => request(axios, basePath));
        },
    };
};
exports.AuthenticationApiFactory = AuthenticationApiFactory;
class AuthenticationApi extends base_1.BaseAPI {
    authControllerChangePassword(changePasswordDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerChangePassword(changePasswordDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerCheckEmailAvailability(email, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerCheckEmailAvailability(email, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerDeleteAccount(options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerDeleteAccount(options).then((request) => request(this.axios, this.basePath));
    }
    authControllerForgotPassword(forgotPasswordDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerForgotPassword(forgotPasswordDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerGetProfile(options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerGetProfile(options).then((request) => request(this.axios, this.basePath));
    }
    authControllerHandleResetPasswordLink(token, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerHandleResetPasswordLink(token, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerLogin(loginDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerLogin(loginDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerLogout(options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerLogout(options).then((request) => request(this.axios, this.basePath));
    }
    authControllerLogoutFromAllDevices(options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerLogoutFromAllDevices(options).then((request) => request(this.axios, this.basePath));
    }
    authControllerRefreshToken(refreshTokenDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerRefreshToken(refreshTokenDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerResendVerificationEmail(options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerResendVerificationEmail(options).then((request) => request(this.axios, this.basePath));
    }
    authControllerResetPassword(resetPasswordDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerResetPassword(resetPasswordDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerSignup(signUpDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerSignup(signUpDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerUpdateProfile(updateProfileDto, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerUpdateProfile(updateProfileDto, options).then((request) => request(this.axios, this.basePath));
    }
    authControllerValidateToken(options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerValidateToken(options).then((request) => request(this.axios, this.basePath));
    }
    authControllerVerifyEmail(token, options) {
        return (0, exports.AuthenticationApiFp)(this.configuration).authControllerVerifyEmail(token, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.AuthenticationApi = AuthenticationApi;
const ExpensesApiAxiosParamCreator = function (configuration) {
    return {
        expenseControllerCreateExpense: async (groupId, createExpenseDto, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerCreateExpense', 'groupId', groupId);
            (0, common_1.assertParamExists)('expenseControllerCreateExpense', 'createExpenseDto', createExpenseDto);
            const localVarPath = `/api/groups/{groupId}/expenses`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(createExpenseDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerDeleteExpense: async (groupId, expenseId, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerDeleteExpense', 'groupId', groupId);
            (0, common_1.assertParamExists)('expenseControllerDeleteExpense', 'expenseId', expenseId);
            const localVarPath = `/api/groups/{groupId}/expenses/{expenseId}`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"expenseId"}}`, encodeURIComponent(String(expenseId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerGetBalances: async (groupId, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerGetBalances', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/expenses/balances`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerGetExpenseById: async (groupId, expenseId, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerGetExpenseById', 'groupId', groupId);
            (0, common_1.assertParamExists)('expenseControllerGetExpenseById', 'expenseId', expenseId);
            const localVarPath = `/api/groups/{groupId}/expenses/{expenseId}`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"expenseId"}}`, encodeURIComponent(String(expenseId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerGetExpenseSummary: async (groupId, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerGetExpenseSummary', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/expenses/summary`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerGetGroupExpenses: async (groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerGetGroupExpenses', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/expenses`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            if (category !== undefined) {
                localVarQueryParameter['category'] = category;
            }
            if (fromDate !== undefined) {
                localVarQueryParameter['fromDate'] = (fromDate instanceof Date) ?
                    fromDate.toISOString() :
                    fromDate;
            }
            if (toDate !== undefined) {
                localVarQueryParameter['toDate'] = (toDate instanceof Date) ?
                    toDate.toISOString() :
                    toDate;
            }
            if (paidByUserId !== undefined) {
                localVarQueryParameter['paidByUserId'] = paidByUserId;
            }
            if (verified !== undefined) {
                localVarQueryParameter['verified'] = verified;
            }
            if (search !== undefined) {
                localVarQueryParameter['search'] = search;
            }
            if (sortBy !== undefined) {
                localVarQueryParameter['sortBy'] = sortBy;
            }
            if (sortOrder !== undefined) {
                localVarQueryParameter['sortOrder'] = sortOrder;
            }
            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }
            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerGetSpendingInsights: async (groupId, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerGetSpendingInsights', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/expenses/insights`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerUpdateExpense: async (groupId, expenseId, updateExpenseDto, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerUpdateExpense', 'groupId', groupId);
            (0, common_1.assertParamExists)('expenseControllerUpdateExpense', 'expenseId', expenseId);
            (0, common_1.assertParamExists)('expenseControllerUpdateExpense', 'updateExpenseDto', updateExpenseDto);
            const localVarPath = `/api/groups/{groupId}/expenses/{expenseId}`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"expenseId"}}`, encodeURIComponent(String(expenseId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(updateExpenseDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerUploadReceipt: async (options = {}) => {
            const localVarPath = `/api/groups/{groupId}/expenses/upload-receipt`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        expenseControllerVerifyReceipt: async (groupId, expenseId, verifyReceiptDto, options = {}) => {
            (0, common_1.assertParamExists)('expenseControllerVerifyReceipt', 'groupId', groupId);
            (0, common_1.assertParamExists)('expenseControllerVerifyReceipt', 'expenseId', expenseId);
            (0, common_1.assertParamExists)('expenseControllerVerifyReceipt', 'verifyReceiptDto', verifyReceiptDto);
            const localVarPath = `/api/groups/{groupId}/expenses/{expenseId}/verify`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"expenseId"}}`, encodeURIComponent(String(expenseId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(verifyReceiptDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
exports.ExpensesApiAxiosParamCreator = ExpensesApiAxiosParamCreator;
const ExpensesApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.ExpensesApiAxiosParamCreator)(configuration);
    return {
        async expenseControllerCreateExpense(groupId, createExpenseDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerCreateExpense(groupId, createExpenseDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerCreateExpense']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerDeleteExpense(groupId, expenseId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerDeleteExpense(groupId, expenseId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerDeleteExpense']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerGetBalances(groupId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerGetBalances(groupId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerGetBalances']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerGetExpenseById(groupId, expenseId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerGetExpenseById(groupId, expenseId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerGetExpenseById']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerGetExpenseSummary(groupId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerGetExpenseSummary(groupId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerGetExpenseSummary']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerGetGroupExpenses(groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerGetGroupExpenses(groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerGetGroupExpenses']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerGetSpendingInsights(groupId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerGetSpendingInsights(groupId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerGetSpendingInsights']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerUpdateExpense(groupId, expenseId, updateExpenseDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerUpdateExpense(groupId, expenseId, updateExpenseDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerUpdateExpense']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerUploadReceipt(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerUploadReceipt(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerUploadReceipt']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async expenseControllerVerifyReceipt(groupId, expenseId, verifyReceiptDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.expenseControllerVerifyReceipt(groupId, expenseId, verifyReceiptDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['ExpensesApi.expenseControllerVerifyReceipt']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
exports.ExpensesApiFp = ExpensesApiFp;
const ExpensesApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.ExpensesApiFp)(configuration);
    return {
        expenseControllerCreateExpense(groupId, createExpenseDto, options) {
            return localVarFp.expenseControllerCreateExpense(groupId, createExpenseDto, options).then((request) => request(axios, basePath));
        },
        expenseControllerDeleteExpense(groupId, expenseId, options) {
            return localVarFp.expenseControllerDeleteExpense(groupId, expenseId, options).then((request) => request(axios, basePath));
        },
        expenseControllerGetBalances(groupId, options) {
            return localVarFp.expenseControllerGetBalances(groupId, options).then((request) => request(axios, basePath));
        },
        expenseControllerGetExpenseById(groupId, expenseId, options) {
            return localVarFp.expenseControllerGetExpenseById(groupId, expenseId, options).then((request) => request(axios, basePath));
        },
        expenseControllerGetExpenseSummary(groupId, options) {
            return localVarFp.expenseControllerGetExpenseSummary(groupId, options).then((request) => request(axios, basePath));
        },
        expenseControllerGetGroupExpenses(groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options) {
            return localVarFp.expenseControllerGetGroupExpenses(groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options).then((request) => request(axios, basePath));
        },
        expenseControllerGetSpendingInsights(groupId, options) {
            return localVarFp.expenseControllerGetSpendingInsights(groupId, options).then((request) => request(axios, basePath));
        },
        expenseControllerUpdateExpense(groupId, expenseId, updateExpenseDto, options) {
            return localVarFp.expenseControllerUpdateExpense(groupId, expenseId, updateExpenseDto, options).then((request) => request(axios, basePath));
        },
        expenseControllerUploadReceipt(options) {
            return localVarFp.expenseControllerUploadReceipt(options).then((request) => request(axios, basePath));
        },
        expenseControllerVerifyReceipt(groupId, expenseId, verifyReceiptDto, options) {
            return localVarFp.expenseControllerVerifyReceipt(groupId, expenseId, verifyReceiptDto, options).then((request) => request(axios, basePath));
        },
    };
};
exports.ExpensesApiFactory = ExpensesApiFactory;
class ExpensesApi extends base_1.BaseAPI {
    expenseControllerCreateExpense(groupId, createExpenseDto, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerCreateExpense(groupId, createExpenseDto, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerDeleteExpense(groupId, expenseId, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerDeleteExpense(groupId, expenseId, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerGetBalances(groupId, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerGetBalances(groupId, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerGetExpenseById(groupId, expenseId, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerGetExpenseById(groupId, expenseId, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerGetExpenseSummary(groupId, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerGetExpenseSummary(groupId, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerGetGroupExpenses(groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerGetGroupExpenses(groupId, category, fromDate, toDate, paidByUserId, verified, search, sortBy, sortOrder, page, limit, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerGetSpendingInsights(groupId, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerGetSpendingInsights(groupId, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerUpdateExpense(groupId, expenseId, updateExpenseDto, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerUpdateExpense(groupId, expenseId, updateExpenseDto, options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerUploadReceipt(options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerUploadReceipt(options).then((request) => request(this.axios, this.basePath));
    }
    expenseControllerVerifyReceipt(groupId, expenseId, verifyReceiptDto, options) {
        return (0, exports.ExpensesApiFp)(this.configuration).expenseControllerVerifyReceipt(groupId, expenseId, verifyReceiptDto, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.ExpensesApi = ExpensesApi;
exports.ExpenseControllerGetGroupExpensesCategoryEnum = {
    Food: 'food',
    Transport: 'transport',
    Accommodation: 'accommodation',
    Shopping: 'shopping',
    Entertainment: 'entertainment',
    Bills: 'bills',
    Health: 'health',
    Education: 'education',
    Other: 'other'
};
exports.ExpenseControllerGetGroupExpensesSortByEnum = {
    Date: 'date',
    Amount: 'amount',
    CreatedAt: 'createdAt'
};
exports.ExpenseControllerGetGroupExpensesSortOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
};
const GroupsApiAxiosParamCreator = function (configuration) {
    return {
        groupControllerAddMember: async (id, addMemberDto, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerAddMember', 'id', id);
            (0, common_1.assertParamExists)('groupControllerAddMember', 'addMemberDto', addMemberDto);
            const localVarPath = `/api/groups/{id}/members`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(addMemberDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerCreateGroup: async (createGroupDto, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerCreateGroup', 'createGroupDto', createGroupDto);
            const localVarPath = `/api/groups`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(createGroupDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerDeleteGroup: async (id, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerDeleteGroup', 'id', id);
            const localVarPath = `/api/groups/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerGetGroupById: async (id, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerGetGroupById', 'id', id);
            const localVarPath = `/api/groups/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerGetGroupMembers: async (id, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerGetGroupMembers', 'id', id);
            const localVarPath = `/api/groups/{id}/members`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerGetGroupStatistics: async (id, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerGetGroupStatistics', 'id', id);
            const localVarPath = `/api/groups/{id}/stats`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerGetUserGroups: async (sortBy, sortOrder, page, limit, options = {}) => {
            const localVarPath = `/api/groups`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            if (sortBy !== undefined) {
                localVarQueryParameter['sortBy'] = sortBy;
            }
            if (sortOrder !== undefined) {
                localVarQueryParameter['sortOrder'] = sortOrder;
            }
            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }
            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerRemoveMember: async (id, memberId, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerRemoveMember', 'id', id);
            (0, common_1.assertParamExists)('groupControllerRemoveMember', 'memberId', memberId);
            const localVarPath = `/api/groups/{id}/members/{memberId}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
                .replace(`{${"memberId"}}`, encodeURIComponent(String(memberId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        groupControllerUpdateGroup: async (id, updateGroupDto, options = {}) => {
            (0, common_1.assertParamExists)('groupControllerUpdateGroup', 'id', id);
            (0, common_1.assertParamExists)('groupControllerUpdateGroup', 'updateGroupDto', updateGroupDto);
            const localVarPath = `/api/groups/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(updateGroupDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
exports.GroupsApiAxiosParamCreator = GroupsApiAxiosParamCreator;
const GroupsApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.GroupsApiAxiosParamCreator)(configuration);
    return {
        async groupControllerAddMember(id, addMemberDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerAddMember(id, addMemberDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerAddMember']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerCreateGroup(createGroupDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerCreateGroup(createGroupDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerCreateGroup']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerDeleteGroup(id, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerDeleteGroup(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerDeleteGroup']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerGetGroupById(id, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerGetGroupById(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerGetGroupById']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerGetGroupMembers(id, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerGetGroupMembers(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerGetGroupMembers']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerGetGroupStatistics(id, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerGetGroupStatistics(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerGetGroupStatistics']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerGetUserGroups(sortBy, sortOrder, page, limit, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerGetUserGroups(sortBy, sortOrder, page, limit, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerGetUserGroups']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerRemoveMember(id, memberId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerRemoveMember(id, memberId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerRemoveMember']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async groupControllerUpdateGroup(id, updateGroupDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.groupControllerUpdateGroup(id, updateGroupDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['GroupsApi.groupControllerUpdateGroup']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
exports.GroupsApiFp = GroupsApiFp;
const GroupsApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.GroupsApiFp)(configuration);
    return {
        groupControllerAddMember(id, addMemberDto, options) {
            return localVarFp.groupControllerAddMember(id, addMemberDto, options).then((request) => request(axios, basePath));
        },
        groupControllerCreateGroup(createGroupDto, options) {
            return localVarFp.groupControllerCreateGroup(createGroupDto, options).then((request) => request(axios, basePath));
        },
        groupControllerDeleteGroup(id, options) {
            return localVarFp.groupControllerDeleteGroup(id, options).then((request) => request(axios, basePath));
        },
        groupControllerGetGroupById(id, options) {
            return localVarFp.groupControllerGetGroupById(id, options).then((request) => request(axios, basePath));
        },
        groupControllerGetGroupMembers(id, options) {
            return localVarFp.groupControllerGetGroupMembers(id, options).then((request) => request(axios, basePath));
        },
        groupControllerGetGroupStatistics(id, options) {
            return localVarFp.groupControllerGetGroupStatistics(id, options).then((request) => request(axios, basePath));
        },
        groupControllerGetUserGroups(sortBy, sortOrder, page, limit, options) {
            return localVarFp.groupControllerGetUserGroups(sortBy, sortOrder, page, limit, options).then((request) => request(axios, basePath));
        },
        groupControllerRemoveMember(id, memberId, options) {
            return localVarFp.groupControllerRemoveMember(id, memberId, options).then((request) => request(axios, basePath));
        },
        groupControllerUpdateGroup(id, updateGroupDto, options) {
            return localVarFp.groupControllerUpdateGroup(id, updateGroupDto, options).then((request) => request(axios, basePath));
        },
    };
};
exports.GroupsApiFactory = GroupsApiFactory;
class GroupsApi extends base_1.BaseAPI {
    groupControllerAddMember(id, addMemberDto, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerAddMember(id, addMemberDto, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerCreateGroup(createGroupDto, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerCreateGroup(createGroupDto, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerDeleteGroup(id, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerDeleteGroup(id, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerGetGroupById(id, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerGetGroupById(id, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerGetGroupMembers(id, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerGetGroupMembers(id, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerGetGroupStatistics(id, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerGetGroupStatistics(id, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerGetUserGroups(sortBy, sortOrder, page, limit, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerGetUserGroups(sortBy, sortOrder, page, limit, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerRemoveMember(id, memberId, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerRemoveMember(id, memberId, options).then((request) => request(this.axios, this.basePath));
    }
    groupControllerUpdateGroup(id, updateGroupDto, options) {
        return (0, exports.GroupsApiFp)(this.configuration).groupControllerUpdateGroup(id, updateGroupDto, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.GroupsApi = GroupsApi;
exports.GroupControllerGetUserGroupsSortByEnum = {
    Name: 'name',
    CreatedAt: 'createdAt',
    UpdatedAt: 'updatedAt'
};
exports.GroupControllerGetUserGroupsSortOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
};
const SettlementsApiAxiosParamCreator = function (configuration) {
    return {
        settlementControllerCreateOptimizedSettlements: async (groupId, createOptimizedSettlementsDto, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerCreateOptimizedSettlements', 'groupId', groupId);
            (0, common_1.assertParamExists)('settlementControllerCreateOptimizedSettlements', 'createOptimizedSettlementsDto', createOptimizedSettlementsDto);
            const localVarPath = `/api/groups/{groupId}/settlements/optimize/auto-create`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(createOptimizedSettlementsDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerCreateSettlement: async (groupId, createSettlementDto, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerCreateSettlement', 'groupId', groupId);
            (0, common_1.assertParamExists)('settlementControllerCreateSettlement', 'createSettlementDto', createSettlementDto);
            const localVarPath = `/api/groups/{groupId}/settlements`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(createSettlementDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerDeleteSettlement: async (groupId, settlementId, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerDeleteSettlement', 'groupId', groupId);
            (0, common_1.assertParamExists)('settlementControllerDeleteSettlement', 'settlementId', settlementId);
            const localVarPath = `/api/groups/{groupId}/settlements/{settlementId}`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"settlementId"}}`, encodeURIComponent(String(settlementId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerGetBalances: async (groupId, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerGetBalances', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/settlements/balances`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerGetGroupSettlements: async (groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerGetGroupSettlements', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/settlements`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            if (status !== undefined) {
                localVarQueryParameter['status'] = status;
            }
            if (fromDate !== undefined) {
                localVarQueryParameter['fromDate'] = (fromDate instanceof Date) ?
                    fromDate.toISOString() :
                    fromDate;
            }
            if (toDate !== undefined) {
                localVarQueryParameter['toDate'] = (toDate instanceof Date) ?
                    toDate.toISOString() :
                    toDate;
            }
            if (userId !== undefined) {
                localVarQueryParameter['userId'] = userId;
            }
            if (isAutoGenerated !== undefined) {
                localVarQueryParameter['isAutoGenerated'] = isAutoGenerated;
            }
            if (sortBy !== undefined) {
                localVarQueryParameter['sortBy'] = sortBy;
            }
            if (sortOrder !== undefined) {
                localVarQueryParameter['sortOrder'] = sortOrder;
            }
            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }
            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerGetOptimizedSettlements: async (groupId, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerGetOptimizedSettlements', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/settlements/optimize`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerGetSettlementById: async (groupId, settlementId, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerGetSettlementById', 'groupId', groupId);
            (0, common_1.assertParamExists)('settlementControllerGetSettlementById', 'settlementId', settlementId);
            const localVarPath = `/api/groups/{groupId}/settlements/{settlementId}`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"settlementId"}}`, encodeURIComponent(String(settlementId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerGetStatistics: async (groupId, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerGetStatistics', 'groupId', groupId);
            const localVarPath = `/api/groups/{groupId}/settlements/statistics`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        settlementControllerUpdateSettlementStatus: async (groupId, settlementId, updateSettlementStatusDto, options = {}) => {
            (0, common_1.assertParamExists)('settlementControllerUpdateSettlementStatus', 'groupId', groupId);
            (0, common_1.assertParamExists)('settlementControllerUpdateSettlementStatus', 'settlementId', settlementId);
            (0, common_1.assertParamExists)('settlementControllerUpdateSettlementStatus', 'updateSettlementStatusDto', updateSettlementStatusDto);
            const localVarPath = `/api/groups/{groupId}/settlements/{settlementId}/status`
                .replace(`{${"groupId"}}`, encodeURIComponent(String(groupId)))
                .replace(`{${"settlementId"}}`, encodeURIComponent(String(settlementId)));
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(updateSettlementStatusDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
exports.SettlementsApiAxiosParamCreator = SettlementsApiAxiosParamCreator;
const SettlementsApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.SettlementsApiAxiosParamCreator)(configuration);
    return {
        async settlementControllerCreateOptimizedSettlements(groupId, createOptimizedSettlementsDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerCreateOptimizedSettlements(groupId, createOptimizedSettlementsDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerCreateOptimizedSettlements']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerCreateSettlement(groupId, createSettlementDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerCreateSettlement(groupId, createSettlementDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerCreateSettlement']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerDeleteSettlement(groupId, settlementId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerDeleteSettlement(groupId, settlementId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerDeleteSettlement']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerGetBalances(groupId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerGetBalances(groupId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerGetBalances']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerGetGroupSettlements(groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerGetGroupSettlements(groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerGetGroupSettlements']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerGetOptimizedSettlements(groupId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerGetOptimizedSettlements(groupId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerGetOptimizedSettlements']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerGetSettlementById(groupId, settlementId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerGetSettlementById(groupId, settlementId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerGetSettlementById']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerGetStatistics(groupId, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerGetStatistics(groupId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerGetStatistics']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async settlementControllerUpdateSettlementStatus(groupId, settlementId, updateSettlementStatusDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.settlementControllerUpdateSettlementStatus(groupId, settlementId, updateSettlementStatusDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['SettlementsApi.settlementControllerUpdateSettlementStatus']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
exports.SettlementsApiFp = SettlementsApiFp;
const SettlementsApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.SettlementsApiFp)(configuration);
    return {
        settlementControllerCreateOptimizedSettlements(groupId, createOptimizedSettlementsDto, options) {
            return localVarFp.settlementControllerCreateOptimizedSettlements(groupId, createOptimizedSettlementsDto, options).then((request) => request(axios, basePath));
        },
        settlementControllerCreateSettlement(groupId, createSettlementDto, options) {
            return localVarFp.settlementControllerCreateSettlement(groupId, createSettlementDto, options).then((request) => request(axios, basePath));
        },
        settlementControllerDeleteSettlement(groupId, settlementId, options) {
            return localVarFp.settlementControllerDeleteSettlement(groupId, settlementId, options).then((request) => request(axios, basePath));
        },
        settlementControllerGetBalances(groupId, options) {
            return localVarFp.settlementControllerGetBalances(groupId, options).then((request) => request(axios, basePath));
        },
        settlementControllerGetGroupSettlements(groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options) {
            return localVarFp.settlementControllerGetGroupSettlements(groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options).then((request) => request(axios, basePath));
        },
        settlementControllerGetOptimizedSettlements(groupId, options) {
            return localVarFp.settlementControllerGetOptimizedSettlements(groupId, options).then((request) => request(axios, basePath));
        },
        settlementControllerGetSettlementById(groupId, settlementId, options) {
            return localVarFp.settlementControllerGetSettlementById(groupId, settlementId, options).then((request) => request(axios, basePath));
        },
        settlementControllerGetStatistics(groupId, options) {
            return localVarFp.settlementControllerGetStatistics(groupId, options).then((request) => request(axios, basePath));
        },
        settlementControllerUpdateSettlementStatus(groupId, settlementId, updateSettlementStatusDto, options) {
            return localVarFp.settlementControllerUpdateSettlementStatus(groupId, settlementId, updateSettlementStatusDto, options).then((request) => request(axios, basePath));
        },
    };
};
exports.SettlementsApiFactory = SettlementsApiFactory;
class SettlementsApi extends base_1.BaseAPI {
    settlementControllerCreateOptimizedSettlements(groupId, createOptimizedSettlementsDto, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerCreateOptimizedSettlements(groupId, createOptimizedSettlementsDto, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerCreateSettlement(groupId, createSettlementDto, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerCreateSettlement(groupId, createSettlementDto, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerDeleteSettlement(groupId, settlementId, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerDeleteSettlement(groupId, settlementId, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerGetBalances(groupId, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerGetBalances(groupId, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerGetGroupSettlements(groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerGetGroupSettlements(groupId, status, fromDate, toDate, userId, isAutoGenerated, sortBy, sortOrder, page, limit, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerGetOptimizedSettlements(groupId, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerGetOptimizedSettlements(groupId, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerGetSettlementById(groupId, settlementId, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerGetSettlementById(groupId, settlementId, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerGetStatistics(groupId, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerGetStatistics(groupId, options).then((request) => request(this.axios, this.basePath));
    }
    settlementControllerUpdateSettlementStatus(groupId, settlementId, updateSettlementStatusDto, options) {
        return (0, exports.SettlementsApiFp)(this.configuration).settlementControllerUpdateSettlementStatus(groupId, settlementId, updateSettlementStatusDto, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.SettlementsApi = SettlementsApi;
exports.SettlementControllerGetGroupSettlementsStatusEnum = {
    Pending: 'pending',
    Completed: 'completed',
    Cancelled: 'cancelled'
};
exports.SettlementControllerGetGroupSettlementsSortByEnum = {
    Date: 'date',
    Amount: 'amount',
    CreatedAt: 'createdAt',
    UpdatedAt: 'updatedAt'
};
exports.SettlementControllerGetGroupSettlementsSortOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
};
const UserApiAxiosParamCreator = function (configuration) {
    return {
        userControllerChangePassword: async (options = {}) => {
            const localVarPath = `/api/users/change-password`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        userControllerDeactivateOwnAccount: async (options = {}) => {
            const localVarPath = `/api/users/deactivate`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        userControllerDeleteAccount: async (options = {}) => {
            const localVarPath = `/api/users/profile`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        userControllerGetProfile: async (options = {}) => {
            const localVarPath = `/api/users/profile`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        userControllerLogin: async (loginDto, options = {}) => {
            (0, common_1.assertParamExists)('userControllerLogin', 'loginDto', loginDto);
            const localVarPath = `/api/users/login`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(loginDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        userControllerRegister: async (createUserDto, options = {}) => {
            (0, common_1.assertParamExists)('userControllerRegister', 'createUserDto', createUserDto);
            const localVarPath = `/api/users/register`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            localVarRequestOptions.data = (0, common_1.serializeDataIfNeeded)(createUserDto, localVarRequestOptions, configuration);
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        userControllerUpdateProfile: async (options = {}) => {
            const localVarPath = `/api/users/profile`;
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options };
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            await (0, common_1.setBearerAuthToObject)(localVarHeaderParameter, configuration);
            (0, common_1.setSearchParams)(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            return {
                url: (0, common_1.toPathString)(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
exports.UserApiAxiosParamCreator = UserApiAxiosParamCreator;
const UserApiFp = function (configuration) {
    const localVarAxiosParamCreator = (0, exports.UserApiAxiosParamCreator)(configuration);
    return {
        async userControllerChangePassword(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerChangePassword(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerChangePassword']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async userControllerDeactivateOwnAccount(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerDeactivateOwnAccount(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerDeactivateOwnAccount']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async userControllerDeleteAccount(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerDeleteAccount(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerDeleteAccount']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async userControllerGetProfile(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerGetProfile(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerGetProfile']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async userControllerLogin(loginDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerLogin(loginDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerLogin']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async userControllerRegister(createUserDto, options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerRegister(createUserDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerRegister']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        async userControllerUpdateProfile(options) {
            const localVarAxiosArgs = await localVarAxiosParamCreator.userControllerUpdateProfile(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = base_1.operationServerMap['UserApi.userControllerUpdateProfile']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => (0, common_1.createRequestFunction)(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    };
};
exports.UserApiFp = UserApiFp;
const UserApiFactory = function (configuration, basePath, axios) {
    const localVarFp = (0, exports.UserApiFp)(configuration);
    return {
        userControllerChangePassword(options) {
            return localVarFp.userControllerChangePassword(options).then((request) => request(axios, basePath));
        },
        userControllerDeactivateOwnAccount(options) {
            return localVarFp.userControllerDeactivateOwnAccount(options).then((request) => request(axios, basePath));
        },
        userControllerDeleteAccount(options) {
            return localVarFp.userControllerDeleteAccount(options).then((request) => request(axios, basePath));
        },
        userControllerGetProfile(options) {
            return localVarFp.userControllerGetProfile(options).then((request) => request(axios, basePath));
        },
        userControllerLogin(loginDto, options) {
            return localVarFp.userControllerLogin(loginDto, options).then((request) => request(axios, basePath));
        },
        userControllerRegister(createUserDto, options) {
            return localVarFp.userControllerRegister(createUserDto, options).then((request) => request(axios, basePath));
        },
        userControllerUpdateProfile(options) {
            return localVarFp.userControllerUpdateProfile(options).then((request) => request(axios, basePath));
        },
    };
};
exports.UserApiFactory = UserApiFactory;
class UserApi extends base_1.BaseAPI {
    userControllerChangePassword(options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerChangePassword(options).then((request) => request(this.axios, this.basePath));
    }
    userControllerDeactivateOwnAccount(options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerDeactivateOwnAccount(options).then((request) => request(this.axios, this.basePath));
    }
    userControllerDeleteAccount(options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerDeleteAccount(options).then((request) => request(this.axios, this.basePath));
    }
    userControllerGetProfile(options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerGetProfile(options).then((request) => request(this.axios, this.basePath));
    }
    userControllerLogin(loginDto, options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerLogin(loginDto, options).then((request) => request(this.axios, this.basePath));
    }
    userControllerRegister(createUserDto, options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerRegister(createUserDto, options).then((request) => request(this.axios, this.basePath));
    }
    userControllerUpdateProfile(options) {
        return (0, exports.UserApiFp)(this.configuration).userControllerUpdateProfile(options).then((request) => request(this.axios, this.basePath));
    }
}
exports.UserApi = UserApi;
//# sourceMappingURL=api.js.map