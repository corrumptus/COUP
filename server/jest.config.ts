import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@api/(.*)$": "<rootDir>/src/api/$1",
        "^@socket/(.*)$": "<rootDir>/src/socket/$1",
        "^@services/(.*)$": "<rootDir>/src/service/$1",
        "^@actionHandlers/(.*)$": "<rootDir>/src/actionHandler/$1",
        "^@repositorys/(.*)$": "<rootDir>/src/repository/$1",
        "^@entitys/(.*)$": "<rootDir>/src/entity/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@resources/(.*)$": "<rootDir>/resources/$1",
        "^@tests/(.*)$": "<rootDir>/test/$1"
    },
    clearMocks: true
};

export default config;