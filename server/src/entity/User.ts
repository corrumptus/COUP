import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class User implements UserLoginProps {
    @PrimaryColumn()
    name!: string;

    @Column()
    password!: string;
}

export interface UserLoginProps {
    name: string;
    password: string;
}

export type UserLoginToken = string;