import User from "@entitys/User";
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./coup.db",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: []
});

AppDataSource.initialize()
    .then(() => {
        console.log("DataBase initialized");
    })
    .catch((error) => {
        console.error(error);

        process.exit(1);
    });

export default AppDataSource;