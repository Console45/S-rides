import { Response } from "express";
import { Container, Service, Inject } from "typedi";
import { USER_MODEL_TOKEN } from "../models/User";
import { verify } from "jsonwebtoken";
import keys from "../constants/keys";
import { IUser, IUserModel, UserDetails } from "../@types";
import { ApiError, authLogger } from "../utils";

@Service()
class AuthServices {
  private readonly userModel: IUserModel;

  private errorMessage: string = "";

  constructor(@Inject(USER_MODEL_TOKEN) userModel: IUserModel) {
    this.userModel = userModel;
  }

  /**
   * Registers a new user
   * @param body user data
   * @returns user
   */
  public async registerUser(body: UserDetails): Promise<IUser> {
    const existingUserWithEmail: IUser | null = await this.userModel.findOne({
      email: body.email,
    });
    if (existingUserWithEmail) {
      this.errorMessage = `User already exists`;
      authLogger.error(`message:${this.errorMessage},email:${body.email},`);
      throw new ApiError(409, this.errorMessage);
    }
    const existingUserWithID: IUser | null = await this.userModel.findOne({
      studentId: body.studentId,
    });

    if (existingUserWithID) {
      this.errorMessage = `User already exists`;
      authLogger.error(
        `message:${this.errorMessage},studentId:${body.studentId},`
      );
      throw new ApiError(409, this.errorMessage);
    }

    const user: IUser = new this.userModel(body);
    await user.save();
    authLogger.info(
      `message: registeration was sucessful,email:${user.email},name:${user.fullname}`
    );
    return user;
  }

  /**
   * logs in an existing user
   * @param body user data
   * @returns user
   */
  public async loginUser(body: {
    studentId: string;
    password: string;
  }): Promise<IUser> {
    const user: IUser = await this.userModel.findByCredentials(
      body.studentId,
      body.password
    );
    authLogger.info(
      `message: login was sucessful,email:${user.email},name:${user.fullname}`
    );
    return user;
  }
  /**
   * Checks access token to see if user is authenticated
   * @param accessToken accessToken
   * @returns authenticated user
   */
  public async checkAuth(accessToken: string): Promise<IUser> {
    const payload: any = verify(accessToken, keys.JWT_ACCESS_TOKEN_SECRET);
    const user: IUser | null = await this.userModel.findOne({
      _id: payload.userId,
    });
    if (!user) {
      this.errorMessage = `Not authenticated`;
      authLogger.error(`message:${this.errorMessage}`);
      throw new Error();
    }
    return user;
  }
}

export const authServiceInstance = Container.get(AuthServices);
