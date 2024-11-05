import { render, screen } from "@testing-library/react";
import GameView from "@pages/GameView";
import { GameState } from "@type/game";
import { io, Socket } from "socket.io-client";
import "./socketMock";

export default class GameViewPO {
  private socket: Socket;

  constructor(gameState: GameState, width: number = 800) {
    this.socket = io();

    Object.defineProperty(window, "screen", {
      value: {
        width: width
      }
    });

    render(
      <GameView
        gameState={gameState}
        socket={this.socket}
        changeGameState={jest.fn()}
      />
    );
  }

  html() {
    return screen.queryByTestId("gameView");
  }

  leaveButton() {
    return screen.queryByTestId("leave");
  }

  mobileMenuIcon() {
    return screen.queryByTestId("gameView-mobileMenuIcon");
  }

  nextPerson() {
    return screen.queryByTestId("gameView-nextPerson");
  }

  configDiffs() {
    return screen.queryByTestId("gameView-configDiffs");
  }

  allConfigDiffTextContent() {
    return screen.queryAllByTestId("gameView-configDiff");
  }
}