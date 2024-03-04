import { UserProps, UserLogin, UserToken } from "../entity/User";

export default class UserValidator {
    static isProps(obj: any): obj is UserProps {
        if (!UserValidator.isObject(obj))
            throw new Error("The parameter must be a Object");

        if (!("id" in obj) || !("name" in obj) || !("password" in obj))
            throw new Error("The object must have the following properties: id, name, password");

        if (!UserValidator.isNumber(obj.id))
            throw new Error("ID must be a number");

        if (!UserValidator.isString(obj.name))
            throw new Error("Name cannot be a blank string");

        if (obj.name.trim() === "")
            throw new Error("Name cannot be a blank string");

        if (!UserValidator.isString(obj.password))
            throw new Error("Password cannot be a blank string");

        if (obj.password.trim() === "")
            throw new Error("Password cannot be a blank string");

        return true;
    }

    static isLogin(obj: any): obj is UserLogin {
        if (!UserValidator.isObject(obj))
            throw new Error("The parameter must be a Object");

        if (!("name" in obj) || !("password" in obj))
            throw new Error("The object must have the following properties: name, password");

        if (!UserValidator.isString(obj.name))
            throw new Error("Name cannot be a blank string");

        if (obj.name.trim() === "")
            throw new Error("Name cannot be a blank string");

        if (!UserValidator.isString(obj.password))
            throw new Error("Password cannot be a blank string");

        if (obj.password.trim() === "")
            throw new Error("Password cannot be a blank string");

        return true;
    }

    static isToken(obj: any): obj is UserToken {
        if (!UserValidator.isObject(obj))
            throw new Error("The parameter must be a Object");

        if (!("token" in obj))
            throw new Error("The object must have the following properties: token");

        if (!UserValidator.isString(obj.token))
            throw new Error("Token cannot be a blank string");

        if (obj.token.trim() === "")
            throw new Error("Token cannot be a blank string");

        return true;
    }

    private static isObject(variable: any): variable is object {
        return (
            variable !== null &&
            typeof variable === "object" &&
            !Array.isArray(variable)
        );
    }

    private static isString(variable: any): variable is string {
        return (
            variable !== null &&
            typeof variable === "string"
        );
    }

    private static isNumber(variable: any): variable is number {
        return (
            variable !== null &&
            typeof variable === "number" &&
            !isNaN(variable)
        );
    }
}