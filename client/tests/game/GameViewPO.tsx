import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import GameView from "@pages/GameView";
import { GameState } from "@type/game";
import { io, Socket } from "socket.io-client";

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

  view() {
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

  async closeNextPerson() {
    await userEvent.click(this.nextPerson() as HTMLElement);
  }

  moneyButton() {
    return screen.queryByTestId("gameView-moneyButton");
  }

  playerMoney() {
    return screen.queryByTestId("gameView-playerMoney");
  }

  async openMoneyMenu() {
    await userEvent.click(this.moneyButton() as HTMLElement);
  }

  actionMenu() {
    return screen.queryByTestId("gameView-actionMenu");
  }

  moneyMenu() {
    return screen.queryByTestId("gameView-moneyMenu");
  }

  rendaButton() {
    return screen.queryByTestId("gameView-rendaButton");
  }

  async selectRenda() {
    await userEvent.click(this.rendaButton() as HTMLElement);
  }

  ajudaExternaButton() {
    return screen.queryByTestId("gameView-ajudaExternaButton");
  }

  async selectAjudaExterna() {
    await userEvent.click(this.ajudaExternaButton() as HTMLElement);
  }

  taxarButton() {
    return screen.queryByTestId("gameView-taxarButton");
  }

  async selectTaxar() {
    await userEvent.click(this.taxarButton() as HTMLElement);
  }

  corrupcaoButton() {
    return screen.queryByTestId("gameView-corrupcaoButton");
  }

  async selectCorrupcao() {
    await userEvent.click(this.corrupcaoButton() as HTMLElement);
  }

  cardChooserMenu() {
    return screen.queryByTestId("gameView-cardChooserMenu");
  }

  cardPickingMenu() {
    return screen.queryByTestId("gameView-cardPickingMenu");
  }

  duqueChoosableCard() {
    return screen.queryByTestId("gameView-duqueChoosableCard");
  }

  async selectDuqueChoosableCard() {
    await userEvent.click(this.duqueChoosableCard() as HTMLElement);
  }

  capitaoChoosableCard() {
    return screen.queryByTestId("gameView-capitaoChoosableCard");
  }

  async selectCapitaoChoosableCard() {
    await userEvent.click(this.capitaoChoosableCard() as HTMLElement);
  }

  assassinoChoosableCard() {
    return screen.queryByTestId("gameView-assassinoChoosableCard");
  }

  async selectAssassinoChoosableCard() {
    await userEvent.click(this.assassinoChoosableCard() as HTMLElement);
  }

  condessaChoosableCard() {
    return screen.queryByTestId("gameView-condessaChoosableCard");
  }

  async selectCondessaChoosableCard() {
    await userEvent.click(this.condessaChoosableCard() as HTMLElement);
  }

  embaixadorChoosableCard() {
    return screen.queryByTestId("gameView-embaixadorChoosableCard");
  }

  async selectEmbaixadorChoosableCard() {
    await userEvent.click(this.embaixadorChoosableCard() as HTMLElement);
  }

  inquisidorChoosableCard() {
    return screen.queryByTestId("gameView-inquisidorChoosableCard");
  }

  async selectInquisidorChoosableCard() {
    await userEvent.click(this.inquisidorChoosableCard() as HTMLElement);
  }

  firstPickableCard() {
    return screen.queryByTestId("gameView-firstPickableCard");
  }

  async selectFirstPickableCard() {
    await userEvent.click(this.firstPickableCard() as HTMLElement);
  }

  secondPickableCard() {
    return screen.queryByTestId("gameView-secondPickableCard");
  }

  async selectSecondPickableCard() {
    await userEvent.click(this.secondPickableCard() as HTMLElement);
  }
}