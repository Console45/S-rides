import mongoose, { Document, Model } from "mongoose";

/**
 * an enum of user roles
 * @enum {Role} Role
 */
export enum Role {
  Admin = "Admin",
  User = "User",
  Manager = "Manager",
}

export interface Phone {
  id?: mongoose.Types.ObjectId;
  number: string;
  primary: boolean;
}

export interface AuthCode {
  code?: string;
  exp?: number;
}

/**
 * Interface for the User Model
 * @interface IUser
 * @extends Document Mongoose Document Class
 */
export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  country: string;
  phones: Phone[];
  authCode: AuthCode;
  role: Role;
  verified: boolean;
  emailVerified: boolean;
  accessTokenVersion: number;
  refreshTokenVersion: number;
  resetPasswordTokenVersion: number;
  /**
   * Creates a new access token
   * @returns {string} access token
   */
  createAccessToken: (expires?: string | undefined) => string;
  /**
   * Create a new refresh token
   * @returns {string} refresh token
   */
  createRefreshToken: () => string;
  /**
   * Create a new reset password token
   * @returns {string}  reset password token
   */
  createResetPasswordToken: () => string;
  /**
   * Adds or edit a user phone number
   * @returns
   */
  addOrEditPhone: (phone: Phone) => Promise<Phone>;
}

export interface IUserModel extends Model<IUser> {
  /**
   * Find an existing user with credentials
   * @param {string} email
   * @param {string} password
   * @returns {IUser} returns an existing user
   */
  findByCredentials(email: string, password: string): Promise<IUser>;
  /**
   * Finds an existing user or creates a new one
   * @param {string} email
   * @param {string} password
   * @param name
   * @returns {IUser} returns an existing or new user
   *
   */
  findOrCreate(email: string, password: string, name?: string): Promise<IUser>;
  /**
   * Revoke the current refreshToken
   * @param userId user id
   */
  revokeRefreshToken(userId: string): Promise<void>;
  /**
   * Revoke the current resetPasswordToken
   * @param userId user id
   */
  revokeResetPasswordToken(userId: string): Promise<void>;
  /**
   * Revokes accessTokens
   * @param userId user id
   */
  revokeAccessToken(userId: string): Promise<void>;
}
