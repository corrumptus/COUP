const socketEmitMock = jest.fn();
const socketOnMock = jest.fn();

jest.mock("socket.io-client", () => ({
    ...jest.requireActual("socket.io-client"),
    io: () => ({
        emit: socketEmitMock,
        on: socketOnMock,
        removeAllListeners: jest.fn()
    })
}));

function getSocketOnEventHandler(type: string) {
    const callback = socketOnMock.mock.calls.find(call => call[0] === type)[1];

    return jest.fn(callback);
}