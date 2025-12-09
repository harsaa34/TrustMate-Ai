"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomain = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
class UserDomain {
    _id;
    _email;
    _name;
    _password;
    _role;
    _isActive;
    _isVerified;
    _phone;
    _avatar;
    _bio;
    _refreshToken;
    _resetPasswordToken;
    _resetPasswordExpires;
    _verificationToken;
    _verificationTokenExpires;
    _emailVerifiedAt;
    _lastLogin;
    _lastLogout;
    _lastPasswordChange;
    _createdAt;
    _updatedAt;
    _deletedAt;
    _failedLoginAttempts = 0;
    _lockedUntil = null;
    _lastFailedAttempt = null;
    _resetAttempts = 0;
    _lastResetRequest = null;
    constructor(id, email, name, password, role = 'user', isActive = true, isVerified = false, phone, avatar, bio, refreshToken, resetPasswordToken, resetPasswordExpires, verificationToken, verificationTokenExpires, emailVerifiedAt, lastLogin, lastLogout, lastPasswordChange, createdAt, updatedAt, deletedAt, failedLoginAttempts = 0, lockedUntil, resetAttempts = 0) {
        this._id = id;
        this._email = email;
        this._name = name;
        this._password = password;
        this._role = role;
        this._isActive = isActive;
        this._isVerified = isVerified;
        this._phone = phone;
        this._avatar = avatar;
        this._bio = bio;
        this._refreshToken = refreshToken;
        this._resetPasswordToken = resetPasswordToken;
        this._resetPasswordExpires = resetPasswordExpires;
        this._verificationToken = verificationToken;
        this._verificationTokenExpires = verificationTokenExpires;
        this._emailVerifiedAt = emailVerifiedAt;
        this._lastLogin = lastLogin;
        this._lastLogout = lastLogout;
        this._lastPasswordChange = lastPasswordChange;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._failedLoginAttempts = failedLoginAttempts;
        this._lockedUntil = lockedUntil || null;
        this._resetAttempts = resetAttempts;
    }
    get id() { return this._id; }
    get email() { return this._email; }
    get name() { return this._name; }
    get role() { return this._role; }
    get isActive() { return this._isActive; }
    get isVerified() { return this._isVerified; }
    get phone() { return this._phone; }
    getPassword() { return this._password; }
    getAvatar() { return this._avatar; }
    getBio() { return this._bio; }
    getRefreshToken() { return this._refreshToken; }
    getResetPasswordToken() { return this._resetPasswordToken; }
    getResetPasswordExpires() { return this._resetPasswordExpires; }
    getVerificationToken() { return this._verificationToken; }
    getVerificationTokenExpires() { return this._verificationTokenExpires; }
    getEmailVerifiedAt() { return this._emailVerifiedAt; }
    getLastLogin() { return this._lastLogin; }
    getLastLogout() { return this._lastLogout; }
    getLastPasswordChange() { return this._lastPasswordChange; }
    getCreatedAt() { return this._createdAt; }
    getUpdatedAt() { return this._updatedAt; }
    getDeletedAt() { return this._deletedAt; }
    getIsActive() { return this._isActive; }
    getIsVerified() { return this._isVerified; }
    getEmail() { return this._email; }
    getId() { return this._id; }
    getFailedLoginAttempts() {
        return this._failedLoginAttempts;
    }
    getRemainingAttempts() {
        return Math.max(0, 5 - this._failedLoginAttempts);
    }
    shouldLockAccount() {
        return this._failedLoginAttempts >= 5;
    }
    isAccountLocked() {
        if (!this._lockedUntil)
            return false;
        if (new Date() > this._lockedUntil) {
            this.resetFailedAttempts();
            return false;
        }
        return true;
    }
    getRemainingLockTime() {
        if (!this._lockedUntil)
            return 0;
        return Math.max(0, this._lockedUntil.getTime() - Date.now());
    }
    getResetAttempts() {
        return this._resetAttempts;
    }
    setRefreshToken(token) {
        this._refreshToken = token;
        this._updatedAt = new Date();
    }
    setLoginInfo(info) {
        this._lastLogin = new Date();
        this._updatedAt = new Date();
    }
    incrementFailedAttempts() {
        this._failedLoginAttempts++;
        this._lastFailedAttempt = new Date();
        if (this._failedLoginAttempts >= 5) {
            this._lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        this._updatedAt = new Date();
    }
    resetFailedAttempts() {
        this._failedLoginAttempts = 0;
        this._lockedUntil = null;
        this._updatedAt = new Date();
    }
    lockAccount() {
        this._lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        this._updatedAt = new Date();
    }
    incrementResetAttempts() {
        this._resetAttempts++;
        this._lastResetRequest = new Date();
        this._updatedAt = new Date();
    }
    resetResetAttempts() {
        this._resetAttempts = 0;
        this._updatedAt = new Date();
    }
    async validatePassword(password) {
        return bcrypt.compare(password, this._password);
    }
    async changePassword(newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        this._password = hashedPassword;
        this._lastPasswordChange = new Date();
        this._updatedAt = new Date();
    }
    validatePasswordStrength(password) {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
        }
        if (!/(?=.*\d)/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        if (!/(?=.*[!@#$%^&*])/.test(password)) {
            return { valid: false, message: 'Password must contain at least one special character' };
        }
        return { valid: true };
    }
    generateResetToken() {
        this._resetPasswordToken = (0, uuid_1.v4)();
        this._resetPasswordExpires = new Date(Date.now() + 3600000);
        this._updatedAt = new Date();
    }
    isResetTokenValid() {
        if (!this._resetPasswordToken || !this._resetPasswordExpires) {
            return false;
        }
        return this._resetPasswordExpires > new Date();
    }
    clearResetToken() {
        this._resetPasswordToken = undefined;
        this._resetPasswordExpires = undefined;
        this._updatedAt = new Date();
    }
    generateVerificationToken() {
        this._verificationToken = (0, uuid_1.v4)();
        this._verificationTokenExpires = new Date(Date.now() + 86400000);
        this._updatedAt = new Date();
    }
    isVerificationTokenValid() {
        if (!this._verificationToken || !this._verificationTokenExpires) {
            return false;
        }
        return this._verificationTokenExpires > new Date();
    }
    verifyEmail() {
        this._isVerified = true;
        this._verificationToken = undefined;
        this._verificationTokenExpires = undefined;
        this._emailVerifiedAt = new Date();
        this._updatedAt = new Date();
    }
    clearRefreshToken() {
        this._refreshToken = undefined;
        this._lastLogout = new Date();
        this._updatedAt = new Date();
    }
    updateProfile(profileData) {
        if (profileData.name !== undefined)
            this._name = profileData.name;
        if (profileData.phone !== undefined)
            this._phone = profileData.phone;
        if (profileData.avatar !== undefined)
            this._avatar = profileData.avatar;
        if (profileData.bio !== undefined)
            this._bio = profileData.bio;
        this._updatedAt = new Date();
    }
    updateEmail(newEmail) {
        this._email = newEmail;
        this._isVerified = false;
        this.generateVerificationToken();
        this._updatedAt = new Date();
    }
    deactivate() {
        this._isActive = false;
        this._deletedAt = new Date();
        this._updatedAt = new Date();
    }
    shouldResendVerification() {
        if (!this._verificationTokenExpires)
            return true;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return this._verificationTokenExpires < oneHourAgo;
    }
    shouldSendLoginNotification() {
        if (!this._lastLogin)
            return true;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this._lastLogin < oneDayAgo;
    }
    has2FAEnabled() {
        return false;
    }
    requiresEmailVerification() {
        return !this._isVerified;
    }
    getLastVerificationSent() {
        return this._verificationTokenExpires || null;
    }
    static async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const verificationToken = (0, uuid_1.v4)();
        return new UserDomain((0, uuid_1.v4)(), data.email, data.name, hashedPassword, 'user', true, false, data.phone, undefined, undefined, undefined, undefined, undefined, verificationToken, new Date(Date.now() + 86400000), undefined, undefined, undefined, undefined, new Date(), new Date());
    }
    static fromPersistence(data) {
        return new UserDomain(data.id, data.email, data.name, data.password, data.role || 'user', data.isActive, data.isVerified, data.phone, data.avatar, data.bio, data.refreshToken, data.resetPasswordToken, data.resetPasswordExpires, data.verificationToken, data.verificationTokenExpires, data.emailVerifiedAt, data.lastLogin, data.lastLogout, data.lastPasswordChange, data.createdAt, data.updatedAt, data.deletedAt, data.failedLoginAttempts || 0, data.lockedUntil, data.resetAttempts || 0);
    }
}
exports.UserDomain = UserDomain;
//# sourceMappingURL=user.domain.js.map