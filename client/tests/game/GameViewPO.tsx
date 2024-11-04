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
    return screen.findByTestId("gameView");
  }
}