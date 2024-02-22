import { ResultSetHeader, RowDataPacket } from "mysql2";
import User, { UserProps } from "../entity/User";
import pool from "../utils/connection";

export default class UserRepository {
    static async getUser(name: string): Promise<User | null> {
        try {
            const [ user ] = await pool.query(`
                SELECT *
                FROM USER
                WHERE ID = ?
            `, [name]);

            const userResult = (user as RowDataPacket[])[0];

            return new User(userResult as UserProps);
        } catch (e) {
            return null;
        }
    }

    static async addUser(user: UserProps): Promise<User | null> {
        try {
            const [ result ] = await pool.query(`
                INSERT INTO
                USER (NAME, PASSWORD)
                VALUES (?, ?)
            `, [user.name, user.password]);

            if (UserRepository.isUndefinedOrNull((result as ResultSetHeader).insertId))
                return null;

            return UserRepository.getUser(user.name);
        } catch (e) {
            return null;
        }
    }

    static isUndefinedOrNull(n: number): boolean {
        return n === undefined && n === null;
    }
}