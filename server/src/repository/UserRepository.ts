import User, { UserLoginProps } from "@entitys/User";
import AppDataSource from "../database/dataSource";

export default class UserRepository {
    private static repository = AppDataSource.getRepository(User);

    static async addUser(newUser: UserLoginProps): Promise<User | null> {
        try {
            await UserRepository.repository.insert(newUser);

            return UserRepository.getUser(newUser.name);
        } catch (error) {
            return null;
        }
    }

    static async getUser(userName: string): Promise<User | null> {
        return UserRepository.repository.findOne({
            where: {
                name: userName
            }
        });
    }
}