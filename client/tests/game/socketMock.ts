jest.mock("socket.io-client", () => ({
    ...jest.requireActual("socket.io-client"),
    io: () => ({
        emit: jest.fn(),
        on: jest.fn(),
        removeAllListeners: jest.fn()
    })
}));