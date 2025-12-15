import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export class UserDomain {
  private _id: string;
  private _email: string;
  private _name: string;
  private _password: string;
  private _role: string;
  private _isActive: boolean;
  private _isVerified: boolean;
  private _phone?: string;
  private _avatar?: string;
  private _bio?: string;
  private _refreshToken?: string;
  private _resetPasswordToken?: string;
  private _resetPasswordExpires?: Date;
  private _verificationToken?: string;
  private _verificationTokenExpires?: Date;
  private _emailVerifiedAt?: Date;
  private _lastLogin?: Date;
  private _lastLogout?: Date;
  private _lastPasswordChange?: Date;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;
  
  // New properties for security features
  private _failedLoginAttempts: number = 0;
  private _lockedUntil: Date | null = null;
  private _lastFailedAttempt: Date | null = null;
  private _resetAttempts: number = 0;
  private _lastResetRequest: Date | null = null;

  constructor(
    id: string,
    email: string,
    name: string,
    password: string,
    role: string = 'user',
    isActive: boolean = true,
    isVerified: boolean = false,
    phone?: string,
    avatar?: string,
    bio?: string,
    refreshToken?: string,
    resetPasswordToken?: string,
    resetPasswordExpires?: Date,
    verificationToken?: string,
    verificationTokenExpires?: Date,
    emailVerifiedAt?: Date,
    lastLogin?: Date,
    lastLogout?: Date,
    lastPasswordChange?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
    failedLoginAttempts: number = 0,
    lockedUntil?: Date,
    resetAttempts: number = 0
  ) {
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

  // === PUBLIC GETTERS ===
  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get name(): string { return this._name; }
  get role(): string { return this._role; }
  get isActive(): boolean { return this._isActive; }
  get isVerified(): boolean { return this._isVerified; }
  get phone(): string | undefined { return this._phone; }

  // === INTERNAL GETTERS ===
  getPassword(): string { return this._password; }
  getAvatar(): string | undefined { return this._avatar; }
  getBio(): string | undefined { return this._bio; }
  getRefreshToken(): string | undefined { return this._refreshToken; }
  getResetPasswordToken(): string | undefined { return this._resetPasswordToken; }
  getResetPasswordExpires(): Date | undefined { return this._resetPasswordExpires; }
  getVerificationToken(): string | undefined { return this._verificationToken; }
  getVerificationTokenExpires(): Date | undefined { return this._verificationTokenExpires; }
  getEmailVerifiedAt(): Date | undefined { return this._emailVerifiedAt; }
  getLastLogin(): Date | undefined { return this._lastLogin; }
  getLastLogout(): Date | undefined { return this._lastLogout; }
  getLastPasswordChange(): Date | undefined { return this._lastPasswordChange; }
  getCreatedAt(): Date | undefined { return this._createdAt; }
  getUpdatedAt(): Date | undefined { return this._updatedAt; }
  getDeletedAt(): Date | undefined { return this._deletedAt; }
  
  // Auth service getters
  getIsActive(): boolean { return this._isActive; }
  getIsVerified(): boolean { return this._isVerified; }
  getEmail(): string { return this._email; }
  getId(): string { return this._id; }
  
  // === SECURITY GETTERS ===
  getFailedLoginAttempts(): number {
    return this._failedLoginAttempts;
  }
  
  getRemainingAttempts(): number {
    return Math.max(0, 5 - this._failedLoginAttempts);
  }
  
  shouldLockAccount(): boolean {
    return this._failedLoginAttempts >= 5;
  }
  
  isAccountLocked(): boolean {
    if (!this._lockedUntil) return false;
    
    if (new Date() > this._lockedUntil) {
      // Lock expired
      this.resetFailedAttempts();
      return false;
    }
    
    return true;
  }
  
  getRemainingLockTime(): number {
    if (!this._lockedUntil) return 0;
    return Math.max(0, this._lockedUntil.getTime() - Date.now());
  }
  
  getResetAttempts(): number {
    return this._resetAttempts;
  }
  
  // === SETTERS ===
  setRefreshToken(token: string): void {
    this._refreshToken = token;
    this._updatedAt = new Date();
  }
  
  setLoginInfo(info?: { ip: string; userAgent: string; timestamp: Date }): void {
    this._lastLogin = new Date();
    this._updatedAt = new Date();
  }
  
  // === SECURITY METHODS ===
  incrementFailedAttempts(): void {
    this._failedLoginAttempts++;
    this._lastFailedAttempt = new Date();
    
    if (this._failedLoginAttempts >= 5) {
      // Lock account for 15 minutes
      this._lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    
    this._updatedAt = new Date();
  }
  
  resetFailedAttempts(): void {
    this._failedLoginAttempts = 0;
    this._lockedUntil = null;
    this._updatedAt = new Date();
  }
  
  lockAccount(): void {
    this._lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    this._updatedAt = new Date();
  }
  
  incrementResetAttempts(): void {
    this._resetAttempts++;
    this._lastResetRequest = new Date();
    this._updatedAt = new Date();
  }
  
  resetResetAttempts(): void {
    this._resetAttempts = 0;
    this._updatedAt = new Date();
  }
  
  // === PASSWORD METHODS ===
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._password);
  }

  async changePassword(newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    this._password = hashedPassword;
    this._lastPasswordChange = new Date();
    this._updatedAt = new Date();
  }

  validatePasswordStrength(password: string): { valid: boolean; message?: string } {
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
  
  // === TOKEN METHODS ===
  generateResetToken(): void {
    this._resetPasswordToken = uuidv4();
    this._resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    this._updatedAt = new Date();
  }

  isResetTokenValid(): boolean {
    if (!this._resetPasswordToken || !this._resetPasswordExpires) {
      return false;
    }
    return this._resetPasswordExpires > new Date();
  }

  clearResetToken(): void {
    this._resetPasswordToken = undefined;
    this._resetPasswordExpires = undefined;
    this._updatedAt = new Date();
  }

  generateVerificationToken(): void {
    this._verificationToken = uuidv4();
    this._verificationTokenExpires = new Date(Date.now() + 86400000); // 24 hours
    this._updatedAt = new Date();
  }

  isVerificationTokenValid(): boolean {
    if (!this._verificationToken || !this._verificationTokenExpires) {
      return false;
    }
    return this._verificationTokenExpires > new Date();
  }

  verifyEmail(): void {
    this._isVerified = true;
    this._verificationToken = undefined;
    this._verificationTokenExpires = undefined;
    this._emailVerifiedAt = new Date();
    this._updatedAt = new Date();
  }

  clearRefreshToken(): void {
    this._refreshToken = undefined;
    this._lastLogout = new Date();
    this._updatedAt = new Date();
  }
  
  // === PROFILE METHODS ===
  updateProfile(profileData: { name?: string; phone?: string; avatar?: string; bio?: string }): void {
    if (profileData.name !== undefined) this._name = profileData.name;
    if (profileData.phone !== undefined) this._phone = profileData.phone;
    if (profileData.avatar !== undefined) this._avatar = profileData.avatar;
    if (profileData.bio !== undefined) this._bio = profileData.bio;
    this._updatedAt = new Date();
  }
  
  updateEmail(newEmail: string): void {
    this._email = newEmail;
    this._isVerified = false; // Require verification for new email
    this.generateVerificationToken();
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }
  
  // === HELPER METHODS ===
  shouldResendVerification(): boolean {
    if (!this._verificationTokenExpires) return true;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this._verificationTokenExpires < oneHourAgo;
  }
  
  shouldSendLoginNotification(): boolean {
    // Simple logic - send notification if last login was more than 1 day ago
    if (!this._lastLogin) return true;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this._lastLogin < oneDayAgo;
  }
  
  has2FAEnabled(): boolean {
    // For future implementation
    return false;
  }
  
  requiresEmailVerification(): boolean {
    return !this._isVerified;
  }
  
  getLastVerificationSent(): Date | null {
    return this._verificationTokenExpires || null;
  }
  
  // === STATIC FACTORY METHODS ===
  static async create(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<UserDomain> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = uuidv4();
    
    return new UserDomain(
      uuidv4(),
      data.email,
      data.name,
      hashedPassword,
      'user',
      true,
      false,
      data.phone,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      verificationToken,
      new Date(Date.now() + 86400000),
      undefined,
      undefined,
      undefined,
      undefined,
      new Date(),
      new Date()
    );
  }
  
  static fromPersistence(data: {
    id: string;
    email: string;
    name: string;
    password: string;
    role?: string;
    isActive: boolean;
    isVerified: boolean;
    phone?: string;
    avatar?: string;
    bio?: string;
    refreshToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    emailVerifiedAt?: Date;
    lastLogin?: Date;
    lastLogout?: Date;
    lastPasswordChange?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    failedLoginAttempts?: number;
    lockedUntil?: Date;
    resetAttempts?: number;
  }): UserDomain {
    return new UserDomain(
      data.id,
      data.email,
      data.name,
      data.password,
      data.role || 'user',
      data.isActive,
      data.isVerified,
      data.phone,
      data.avatar,
      data.bio,
      data.refreshToken,
      data.resetPasswordToken,
      data.resetPasswordExpires,
      data.verificationToken,
      data.verificationTokenExpires,
      data.emailVerifiedAt,
      data.lastLogin,
      data.lastLogout,
      data.lastPasswordChange,
      data.createdAt,
      data.updatedAt,
      data.deletedAt,
      data.failedLoginAttempts || 0,
      data.lockedUntil,
      data.resetAttempts || 0
    );
  }
}