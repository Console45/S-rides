import { Document, Model } from "mongoose";
import { ITicket } from "./ticket";

/**
 * Interface for the User Model
 * @interface IUser
 * @extends Document Mongoose Document Class
 */
export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  studentId: string;
  tickets: [{ ticket: ITicket["_id"] }];
  accessTokenVersion: number;
  refreshTokenVersion: number;
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
}

export interface IUserModel extends Model<IUser> {
  /**
   * Find an existing user with credentials
   * @param {string} studentId
   * @param {string} password
   * @returns {IUser} returns an existing user
   */
  findByCredentials(studentId: string, password: string): Promise<IUser>;
  /**
   * Finds an existing user or creates a new one
   * @param {string} email
   * @param {string} password
   * @param name
   * @returns {IUser} returns an existing or new user
   *
   */
  revokeRefreshToken(userId: string): Promise<void>;
  /**
   * Revoke the current resetPasswordToken
   * @param userId user id
   */
  revokeAccessToken(userId: string): Promise<void>;
}
