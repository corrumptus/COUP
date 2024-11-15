import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { io, Socket } from "socket.io-client";
import GameView from "@pages/GameView";
import { GameState } from "@type/game";

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

  async leave() {
    await userEvent.click(this.leaveButton() as HTMLElement);
  }

  mobileMenuIcon() {
    return screen.queryByTestId("gameView-mobileMenuIcon");
  }

  playerReligionButton() {
    return screen.queryByTestId("gameView-playerReligionButton");
  }

  async changePlayerReligion() {
    await userEvent.click(this.playerReligionButton() as HTMLElement);
  }

  playerCard(name: string) {
    return screen.queryByTestId(`gameView-${name}Player`);
  }

  religionButton(name: string) {
    return screen.queryByTestId(`gameView-${name}ReligionButton`);
  }

  async changeReligion(name: string) {
    await userEvent.click(this.religionButton(name) as HTMLElement);
  }

  money(name: string) {
    return screen.queryByTestId(`gameView-${name}Money`);
  }

  extorquirButton(name: string) {
    return screen.queryByTestId(`gameView-${name}ExtorquirButton`);
  }

  async extorquir(name: string) {
    await userEvent.click(this.extorquirButton(name) as HTMLElement);
  }

  firstAttackableCard(name: string) {
    return screen.queryByTestId(`gameView-${name}FirstAttackableCard`);
  }

  firstAttackableCardType(name: string) {
    return screen.queryByTestId(`gameView-${name}FirstAttackableCard`)
      ?.querySelector("img")
      ?.title || null;
  }

  async attackFistCard(name: string) {
    await userEvent.click(this.firstAttackableCard(name) as HTMLElement);
  }

  secondAttackableCard(name: string) {
    return screen.queryByTestId(`gameView-${name}SecondAttackableCard`);
  }

  secondAttackableCardType(name: string) {
    return screen.queryByTestId(`gameView-${name}SecondAttackableCard`)
      ?.querySelector("img")
      ?.title || null;
  }

  async attackSecondCard(name: string) {
    await userEvent.click(this.secondAttackableCard(name) as HTMLElement);
  }

  moneyButton() {
    return screen.queryByTestId("gameView-moneyButton");
  }

  async openMoneyMenu() {
    await userEvent.click(this.moneyButton() as HTMLElement);
  }

  playerMoney() {
    return screen.queryByTestId("gameView-playerMoney");
  }

  firstInfluenceCard() {
    return screen.queryByTestId("gameView-playerFirstInfluenceCard");
  }

  firstInfluenceCardType() {
    return screen.queryByTestId("gameView-playerFirstInfluenceCard")
      ?.querySelector("img")
      ?.title || null;
  }

  secondInfluenceCard() {
    return screen.queryByTestId("gameView-playerSecondInfluenceCard");
  }

  secondInfluenceCardType() {
    return screen.queryByTestId("gameView-playerSecondInfluenceCard")
      ?.querySelector("img")
      ?.title || null;
  }

  changePlayerCardsButton() {
    return screen.queryByTestId("gameView-playerChangeButton");
  }

  async changePlayerCards() {
    await userEvent.click(this.changePlayerCardsButton() as HTMLElement);
  }

  gameInfos() {
    return screen.queryByTestId("gameView-cardGameInfos");
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

  attackMenu() {
    return screen.queryByTestId("gameView-attackMenu");
  }

  assassinarButton() {
    return screen.queryByTestId("gameView-assassinarButton");
  }

  async assassinar() {
    await userEvent.click(this.assassinarButton() as HTMLElement);
  }

  investigarButton() {
    return screen.queryByTestId("gameView-investigarButton");
  }

  async investigar() {
    await userEvent.click(this.investigarButton() as HTMLElement);
  }

  golpeEstadoButton() {
    return screen.queryByTestId("gameView-golpeEstadoButton");
  }

  async golpeEstado() {
    await userEvent.click(this.golpeEstadoButton() as HTMLElement);
  }

  cardChooserMenu() {
    return screen.queryByTestId("gameView-cardChooserMenu");
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

  cardPickingMenu() {
    return screen.queryByTestId("gameView-cardPickingMenu");
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

  defenseMenu() {
    return screen.queryByTestId("gameView-defenseMenu");
  }

  blockButton() {
    return screen.queryByTestId("gameView-bloquearButton");
  }

  async block() {
    await userEvent.click(this.blockButton() as HTMLElement);
  }

  contestButton() {
    return screen.queryByTestId("gameView-contestarButton");
  }

  async contest() {
    await userEvent.click(this.contestButton() as HTMLElement);
  }

  acceptButton() {
    return screen.queryByTestId("gameView-continuarButton");
  }

  async accept() {
    await userEvent.click(this.acceptButton() as HTMLElement);
  }

  blockDefenseMenu() {
    return screen.queryByTestId("gameView-BlockDefenseMenu");
  }

  nextPerson() {
    return screen.queryByTestId("gameView-nextPerson");
  }

  configDiffs() {
    return screen.queryByTestId("gameView-configDiffs");
  }

  allConfigDiffTextContent() {
    return screen.queryAllByTestId("gameView-configDiff")
      .map(cd => cd.textContent);
  }

  async closeNextPerson() {
    await userEvent.click(this.nextPerson() as HTMLElement);
  }

  alltoasters() {
    return screen.queryAllByTestId("toaster");
  }

  toasterContents() {
    return screen.queryAllByTestId("gameView-gameUpdateToasterContent")
      .map(tc => tc.textContent);
  }

  async closeToaster(index: number) {
    await userEvent.click(this.alltoasters()[index]);
  }

  toasterBlockButtons() {
    return screen.queryAllByTestId("gameView-gameUpdateToasterBlockButton");
  }

  async blockByToaster(index: number) {
    await userEvent.click(this.toasterBlockButtons()[index]);
  }

  toasterContestButtons() {
    return screen.queryAllByTestId("gameView-gameUpdateToasterContestButton");
  }

  async contestByToaster(index: number) {
    await userEvent.click(this.toasterContestButtons()[index]);
  }
}