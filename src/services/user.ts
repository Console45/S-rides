import { Container, Inject, Service } from "typedi";
import { USER_MODEL_TOKEN } from "../models/User";
import { compare } from "bcrypt";
import { BadRequest, userLogger, NotFoundError } from "../utils";
import { IUser, IUserModel } from "../@types";

@Service()
class UserService {
  private readonly userModel: IUserModel;
  private errorMessage: string = "";
  constructor(@Inject(USER_MODEL_TOKEN) userModel: IUserModel) {
    this.userModel = userModel;
  }
  /**
   * Edit user password
   * @param userId user id
   * @param passwords object of the users current password and the new password
   * @returns a user
   */
  public async editPassword(
    userId: string,
    passwords: { current_password: string; new_password: string }
  ): Promise<IUser> {
    const user: IUser | null = await this.userModel.findById(userId);
    if (!user) {
      this.errorMessage = "User not found";
      userLogger.error(`message:${this.errorMessage},userId:${userId},`);
      throw new NotFoundError(this.errorMessage);
    }
    const isMatch = await compare(passwords.current_password, user.password);
    if (!isMatch) {
      this.errorMessage = "Current password is incorrect";
      userLogger.error(`message:${this.errorMessage},userId:${userId},`);
      throw new BadRequest(this.errorMessage);
    }
    user.password = passwords.new_password;
    await user.save();
    userLogger.info(`password edited successfully`);
    return user;
  }
}

export const userServiceInstance = Container.get(UserService);
