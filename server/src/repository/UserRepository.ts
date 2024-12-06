import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { UserLogin, UserProps } from "@entitys/User";
import pool from "@utils/connection";

export default class UserRepository {
    static async getUser(name: string): Promise<UserProps | null> {
        try {
            const [ user ] = await pool.query(`
                SELECT *
                FROM USER
                WHERE ID = ?
            `, [name]);

            const userResult = (user as RowDataPacket[])[0];

            return userResult as UserProps;
        } catch (e) {
            return null;
        }
    }

    static async addUser(user: UserLogin): Promise<UserProps | null> {
        try {
            const [ { insertId } ]: [ ResultSetHeader, FieldPacket[] ] = await pool.query(`
                INSERT INTO
                USER (NAME, PASSWORD)
                VALUES (?, ?)
            `, [user.name, user.password]);

            if (insertId === undefined || insertId === null)
                return null;

            return UserRepository.getUser(user.name);
        } catch (e) {
            return null;
        }
    }
}