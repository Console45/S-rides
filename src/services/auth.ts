import { Response } from "express";
import { Container, Service, Inject } from "typedi";
import { eventEmitter, Events } from "../utils";
import { USER_MODEL_TOKEN } from "../models/User";
import { verify } from "jsonwebtoken";
import keys from "../constants/keys";
import { AuthTokens, IUser, IUserModel, UserDetails } from "../@types";
import {
  ApiError,
  ForbiddenRequest,
  NotFoundError,
  UnAuthorizedRequest,
  authLogger,
  httpLogger,
} from "../utils";

@Service()
class AuthServices {
  private readonly _userModel: IUserModel;
  private static _res: Response;
  private _errorMessage: string = "";

  constructor(@Inject(USER_MODEL_TOKEN) userModel: IUserModel) {
    this._userModel = userModel;
    this.initalizeEventsListeners();
  }
  /**
   * Initializes event listeners
   */
  private initalizeEventsListeners(): void {
    this.sendTokenEventListener(Events.REGISTER_USER);
    this.sendTokenEventListener(Events.LOGIN_USER);
    this.sendTokenEventListener(Events.REFRESH_TOKEN);
    this.sendTokenEventListener(Events.LOGOUT_USER);
  }

  /**
   * set the response object
   */
  public set res(response: Response) {
    AuthServices._res = response;
  }

  /**
   * Registers a new user
   * @param body user data
   * @returns user
   */
  public async registerUser(body: UserDetails): Promise<IUser> {
    const existingUserWithEmail: IUser | null = await this._userModel.findOne({
      email: body.email,
    });
    if (existingUserWithEmail) {
      this._errorMessage = `User already exists`;
      authLogger.error(`message:${this._errorMessage},email:${body.email},`);
      throw new ApiError(409, this._errorMessage);
    }
    const existingUserWithID: IUser | null = await this._userModel.findOne({
      studentId: body.studentId,
    });

    if (existingUserWithID) {
      this._errorMessage = `User already exists`;
      authLogger.error(
        `message:${this._errorMessage},studentId:${body.studentId},`
      );
      throw new ApiError(409, this._errorMessage);
    }

    const user: IUser = new this._userModel(body);
    await user.save();
    eventEmitter.emit(Events.LOGIN_USER, {
      refreshToken: user.createRefreshToken(),
      accessToken: user.createAccessToken("15m"),
    });
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
    const user: IUser = await this._userModel.findByCredentials(
      body.studentId,
      body.password
    );
    eventEmitter.emit(Events.LOGIN_USER, {
      refreshToken: user.createRefreshToken(),
      accessToken: user.createAccessToken("15m"),
    });
    authLogger.info(
      `message: login was sucessful,email:${user.email},name:${user.fullname}`
    );
    return user;
  }

  /**
   *  Refreshes access token and refresh token
   * @param cookies refresh token
   */
  public async refreshToken(token: string): Promise<void> {
    if (!token) {
      this._errorMessage = "No token found";
      authLogger.error(`message:${this._errorMessage}`);
      throw new UnAuthorizedRequest(this._errorMessage);
    }
    let payload: any;
    try {
      payload = verify(token, keys.JWT_REFRESH_TOKEN_SECRET);
    } catch (err) {
      this._errorMessage = "Token has expired";
      authLogger.error(`message:${this._errorMessage}`);
      throw new UnAuthorizedRequest(this._errorMessage);
    }
    const user: IUser | null = await this._userModel.findOne({
      _id: payload.userId,
    });
    if (!user) {
      this._errorMessage = "User not found";
      authLogger.error(
        `message:${this._errorMessage},userID:${payload.userId}`
      );
      throw new NotFoundError(this._errorMessage);
    }
    if (user.refreshTokenVersion !== payload.tokenVersion) {
      this._errorMessage = "Token has been revoked";
      authLogger.error(
        `message:${this._errorMessage},userID:${payload.userId}`
      );
      throw new ForbiddenRequest(this._errorMessage);
    }
    eventEmitter.emit(Events.REFRESH_TOKEN, {
      refreshToken: user.createRefreshToken(),
      accessToken: user.createAccessToken("15m"),
    });
  }
  /**
   * Checks access token to see if user is authenticated
   * @param accessToken accessToken
   * @returns authenticated user
   */
  public async checkAuth(accessToken: string): Promise<IUser> {
    const payload: any = verify(accessToken, keys.JWT_ACCESS_TOKEN_SECRET);
    console.log(payload);
    const user: IUser | null = await this._userModel.findOne({
      _id: payload.userId,
    });
    if (!user) {
      this._errorMessage = `Not authenticated`;
      authLogger.error(`message:${this._errorMessage}`);
      throw new Error();
    }
    return user;
  }
  /**
   * Logs out an authenticated user
   */
  public logoutUser(): void {
    eventEmitter.emit(Events.LOGOUT_USER, {
      refreshToken: "",
      accessToken: "",
    });
    authLogger.info(`Logout is successful`);
  }

  /**
   * sends refresh token on even trigger
   * @param event event name
   */
  private sendTokenEventListener(event: string): void {
    eventEmitter.on(event, ({ refreshToken, accessToken }: AuthTokens) => {
      AuthServices._res.cookie("jid", refreshToken, {
        httpOnly: true,
        path: "/auth/refresh_token",
      });
      httpLogger.http("Refresh Token Sent");
      AuthServices._res.cookie("atk", accessToken, {
        httpOnly: true,
      });
      httpLogger.http("Access Token Sent");
    });
  }
}

export const authServiceInstance = Container.get(AuthServices);
