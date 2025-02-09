import type { ActionInfos } from "@services/GameMessageService";
import ActionHandler, { ActionRequest, RequestInfos, TurnState, ValidActionRequest } from "@actionHandlers/ActionHandler";
import Action from "@entitys/Action";
import type CardType from "@entitys/CardType";
import Player, { CardSlot, isCardSlot } from "@entitys/player";
import Turn from "@entitys/Turn";
import Config from "@utils/Config";

export default class ContestarHandler implements ActionHandler {
    private isInvestigating: boolean = false;
    private winContesting: boolean = false;
    private isGlobalContesting: boolean = false;

    validate({
        turn,
        player,
        selfCard,
        globalThirdPerson
    }: ActionRequest): void {
        const action = turn.getLastAction();
        const isBloquear = turn.getBlocker() !== undefined;

        if (action === undefined)
            throw new Error("Contestar não pode ser a primeira ação");

        if (!isBloquear && !this.isContestableAction(action))
            throw new Error(`A ação ${action} não pode ser contestada`);

        if (globalThirdPerson !== undefined) {
            this.validateGlobalThirdPerson(globalThirdPerson, selfCard);

            this.isGlobalContesting = true;

            return;
        }

        if (isBloquear)
            this.validateBloquear(turn, player, selfCard);
        else
            this.validateNonBloquear(player, action, selfCard);
    }

    private isContestableAction(action: Action): boolean {
        return [
            Action.TAXAR,
            Action.CORRUPCAO,
            Action.EXTORQUIR,
            Action.ASSASSINAR,
            Action.INVESTIGAR,
            Action.TROCAR,
        ].includes(action);
    }

    private validateGlobalThirdPerson(player: Player, selfCard: number | undefined) {
        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    private validateBloquear(turn: Turn, player: Player, selfCard: number | undefined): void {
        const action = turn.getFirstAction() as Action;

        if (this.contestarBloquearNeedSelfCard(action))
            this.validateSelfCard(player, selfCard);
    }

    private contestarBloquearNeedSelfCard(action: Action): boolean {
        return action === Action.AJUDA_EXTERNA;
    }

    private validateNonBloquear(player: Player, action: Action, selfCard: number | undefined): void {
        if (this.contestarNonBloquearNeedSelfCard(action))
            this.validateSelfCard(player, selfCard);
    }

    private contestarNonBloquearNeedSelfCard(action: Action): boolean {
        return ![Action.ASSASSINAR, Action.INVESTIGAR].includes(action);
    }

    private validateSelfCard(player: Player, selfCard: number | undefined): void {
        if (selfCard === undefined)
            throw new Error("Uma das cartas do jogador deve ser escolhida");

        if (!isCardSlot(selfCard))
            throw new Error("O index da carta do jogador deve ser 0 ou 1");

        if (player.getCard(selfCard).getIsKilled())
            throw new Error("A sua carta escolhida já está morta");
    }

    save({
        turn,
        configs,
        asylumAPI,
        player,
        target,
        selfCard,
        globalThirdPerson,
        playerDied
    }: ValidActionRequest): void {
        const action = turn.getBlocker() !== undefined ?
            Action.BLOQUEAR
            :
            turn.getLastAction();

        switch (action) {
            case Action.TAXAR:
                this.saveTaxar(
                    turn,
                    configs,
                    player,
                    selfCard as CardSlot,
                    target as Player,
                    playerDied
                );
                break;
            case Action.CORRUPCAO:
                this.saveCorrupcao(
                    turn,
                    configs,
                    asylumAPI.add,
                    player,
                    selfCard as CardSlot,
                    target as Player,
                    playerDied
                );
                break;
            case Action.EXTORQUIR:
                this.saveExtorquir(
                    turn,
                    configs,
                    player,
                    selfCard as CardSlot,
                    target as Player,
                    globalThirdPerson as Player,
                    playerDied
                );
                break;
            case Action.ASSASSINAR:
                this.saveAssassinar(
                    turn,
                    configs,
                    player,
                    target as Player,
                    globalThirdPerson as Player,
                    selfCard as CardSlot,
                    playerDied
                );
                break;
            case Action.INVESTIGAR:
                this.saveInvestigar(
                    turn,
                    configs,
                    player,
                    target as Player,
                    globalThirdPerson as Player,
                    selfCard as CardSlot,
                    playerDied
                );
                break;
            case Action.TROCAR:
                this.saveTrocar(
                    turn,
                    configs,
                    player,
                    selfCard as CardSlot,
                    target as Player,
                    playerDied
                );
                break;
            case Action.BLOQUEAR:
                this.saveBloquear(
                    turn,
                    configs,
                    player,
                    selfCard as CardSlot,
                    target as Player,
                    globalThirdPerson as Player,
                    playerDied
                );
                break;
        }
    }

    private saveTaxar(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const taxarCard = turn.getFirstCard() as CardSlot;

        const taxarCardType = target.getCard(taxarCard).getType();

        if (configs.tiposCartas[taxarCardType].taxar) {
            const playerIsDead = player.killCard(selfCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            target.rollbackMoney();

            const targetIsDead = target.killCard(taxarCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addContester(player);
    }

    private saveCorrupcao(
        turn: Turn,
        configs: Config,
        addAsylumCoins: (amount: number) => void,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const corrupcaoCard = turn.getFirstCard() as CardSlot;

        const corrupcaoCardType = target.getCard(corrupcaoCard).getType();

        if (configs.religiao.cartasParaCorrupcao[corrupcaoCardType]) {
            const playerIsDead = player.killCard(selfCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const targetIsDead = target.killCard(corrupcaoCard);

            if (targetIsDead)
                playerDied(target.name);

            const asiloMoney = target.rollbackMoney();

            addAsylumCoins(asiloMoney);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addContester(player);
    }

    private saveExtorquir(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        thirdPerson: Player,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalExtorquir(turn, configs, player, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalExtorquir(turn, configs, player, selfCard, target, playerDied);
    }

    private saveGlobalExtorquir(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const extorquirCard = turn.getFirstCard() as CardSlot;

        const extorquirCardType = player.getCard(extorquirCard).getType();

        if (configs.tiposCartas[extorquirCardType].extorquir) {
            const extorquirMaxAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

            const actualAmount = Math.min(player.getMoney(), extorquirMaxAmount);

            target.removeMoney(actualAmount);
            player.addMoney(actualAmount);

            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const playerIsDead = player.killCard(extorquirCard);

            if (playerIsDead)
                playerDied(player.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addContester(thirdPerson);
    }

    private saveNormalExtorquir(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const extorquirCard = turn.getFirstCard() as CardSlot;

        const extorquirCardType = target.getCard(extorquirCard).getType();

        if (configs.tiposCartas[extorquirCardType].extorquir) {
            const extorquirMaxAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

            const actualAmount = Math.min(player.getMoney(), extorquirMaxAmount);

            player.removeMoney(actualAmount);
            target.addMoney(actualAmount);

            const playerIsDead = player.killCard(selfCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const targetIsDead = target.killCard(extorquirCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addContester(player);
    }

    private saveAssassinar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalAssassinar(turn, configs, player, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalAssassinar(turn, configs, player, target, playerDied);
    }

    private saveGlobalAssassinar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const assassinarCard = turn.getFirstCard() as CardSlot;

        const assassinarCardType = player.getCard(assassinarCard).getType();

        if (configs.tiposCartas[assassinarCardType].assassinar) {
            const cardKilledByKiller = turn.getLastCard() as CardSlot;

            const targetIsDead = target.killCard(cardKilledByKiller);

            if (targetIsDead)
                playerDied(target.name);

            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const playerIsDead = player.killCard(assassinarCard);

            if (playerIsDead)
                playerDied(player.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addContester(thirdPerson);
    }

    private saveNormalAssassinar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const assassinarCard = turn.getFirstCard() as CardSlot;

        const assassinarCardType = target.getCard(assassinarCard).getType();

        if (configs.tiposCartas[assassinarCardType].assassinar) {
            const cardKilledByKiller = turn.getLastCard() as CardSlot;

            const cardKilledByContestar = (cardKilledByKiller+1)%2 as CardSlot;

            player.killCard(cardKilledByKiller);
            player.killCard(cardKilledByContestar);

            playerDied(player.name);
        } else {
            const targetIsDead = target.killCard(assassinarCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addContester(player);
    }

    private saveInvestigar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalInvestigar(turn, configs, player, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalInvestigar(turn, configs, player, target, playerDied);
    }

    private saveGlobalInvestigar(
        turn: Turn,
        configs: Config,
        player: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const investigarCard = turn.getFirstCard() as CardSlot;

        const investigarCardType = player.getCard(investigarCard).getType();

        if (configs.tiposCartas[investigarCardType].investigar) {
            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);

            this.isInvestigating = true;
        } else {
            const playerIsDead = player.killCard(investigarCard);

            if (playerIsDead)
                playerDied(player.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addContester(thirdPerson);
    }

    private saveNormalInvestigar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const investigarCard = turn.getFirstCard() as CardSlot;

        const investigarCardType = target.getCard(investigarCard).getType();

        const investigatedCard = turn.getLastCard() as CardSlot;

        if (configs.tiposCartas[investigarCardType].investigar) {
            const cardKilledByContestar = (investigatedCard+1)%2 as CardSlot;

            const playerIsDead = player.killCard(cardKilledByContestar);

            if (playerIsDead)
                playerDied(player.name);

            this.isInvestigating = true;

            turn.setCurrentPlayer(target);
        } else {
            const targetIsDead = target.killCard(investigarCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addContester(player);
    }

    private saveTrocar(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const trocarCard = turn.getFirstCard() as CardSlot;

        const trocarCardType = (target.getPreviousCards() as [CardType, CardType])[0];

        if (configs.tiposCartas[trocarCardType].trocar) {
            const playerIsDead = player.killCard(selfCard);

            if (playerIsDead)
                playerDied(player.name);

            this.winContesting = true;
        } else {
            target.rollbackCards();

            const targetIsDead = target.killCard(trocarCard);

            if (targetIsDead)
                playerDied(target.name);
        }

        turn.addCard(selfCard);
        turn.addContester(player);
    }

    private saveBloquear(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        thirdPerson: Player,
        playerDied: (name: string) => void
    ): void {
        const action = turn.getFirstAction();

        switch (action) {
            case Action.AJUDA_EXTERNA:
                this.saveBloquearAjudaExterna(
                    turn,
                    configs,
                    player,
                    selfCard,
                    target,
                    thirdPerson,
                    playerDied
                );
                break;
            case Action.TAXAR:
                this.saveBloquearTaxar(
                    turn,
                    configs,
                    player,
                    target,
                    thirdPerson,
                    selfCard,
                    playerDied
                );
                break;
            case Action.EXTORQUIR:
                this.saveBloquearExtorquir(
                    turn,
                    configs,
                    player,
                    target,
                    thirdPerson,
                    selfCard,
                    playerDied
                );
                break;
            case Action.ASSASSINAR:
                this.saveBloquearAssassinar(
                    turn,
                    configs,
                    player,
                    target,
                    thirdPerson,
                    selfCard,
                    playerDied
                );
                break;
            case Action.INVESTIGAR:
                this.saveBloquearInvestigar(
                    turn,
                    configs,
                    player,
                    target,
                    thirdPerson,
                    selfCard,
                    playerDied
                );
                break;
            case Action.TROCAR:
                this.saveBloquearTrocar(
                    turn,
                    configs,
                    player,
                    target,
                    thirdPerson,
                    selfCard,
                    playerDied
                );
                break;
        }
    }

    private saveBloquearAjudaExterna(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        thirdPerson: Player,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalBloquearAjudaExterna(turn, configs, player, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalBloquearAjudaExterna(turn, configs, player, selfCard, target, playerDied);
    }

    private saveGlobalBloquearAjudaExterna(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].taxar) {
            player.rollbackMoney();

            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(thirdPerson);
    }

    private saveNormalBloquearAjudaExterna(
        turn: Turn,
        configs: Config,
        player: Player,
        selfCard: CardSlot,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].taxar) {
            player.rollbackMoney();

            const playerIsDead = player.killCard(selfCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(player);
    }

    private saveBloquearTaxar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalBloquearTaxar(turn, configs, player, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalBloquearTaxar(turn, configs, player, target, playerDied);
    }

    private saveGlobalBloquearTaxar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearTaxar) {
            player.rollbackMoney();

            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(thirdPerson);
    }

    private saveNormalBloquearTaxar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const taxarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearTaxar) {
            player.rollbackMoney();

            const playerIsDead = player.killCard(taxarCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addBlockContester(player);
    }

    private saveBloquearExtorquir(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalBloquearExtorquir(turn, configs, player, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalBloquearExtorquir(turn, configs, player, target, playerDied);
    }

    private saveGlobalBloquearExtorquir(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const extorquirCard = turn.getFirstCard() as CardSlot;

        const extorquirCardType = player.getCard(extorquirCard).getType();

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearExtorquir) {
            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const extorquirMaxAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

            const actualAmount = Math.min(target.getMoney(), extorquirMaxAmount);

            target.removeMoney(actualAmount);
            player.addMoney(actualAmount);

            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(thirdPerson);
    }

    private saveNormalBloquearExtorquir(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const extorquirCard = turn.getFirstCard() as CardSlot;

        const extorquirCardType = player.getCard(extorquirCard).getType();

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearExtorquir) {
            const playerIsDead = player.killCard(extorquirCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const extorquirMaxAmount = configs.tiposCartas[extorquirCardType].quantidadeExtorquir;

            const actualAmount = Math.min(target.getMoney(), extorquirMaxAmount);

            target.removeMoney(actualAmount);
            player.addMoney(actualAmount);

            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addBlockContester(player);
    }

    private saveBloquearAssassinar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalBloquearAssassinar(turn, configs, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalBloquearAssassinar(turn, configs, player, target, playerDied);
    }

    private saveGlobalBloquearAssassinar(
        turn: Turn,
        configs: Config,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearAssassinar) {
            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(bloquearCard);
            target.killCard(cardKilledByContestar);

            playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(thirdPerson);
    }

    private saveNormalBloquearAssassinar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const assassinarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearAssassinar) {
            const playerIsDead = player.killCard(assassinarCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            target.killCard(bloquearCard);
            target.killCard(cardKilledByContestar);

            playerDied(target.name);

            this.winContesting = true;
        }

        turn.addBlockContester(player);
    }

    private saveBloquearInvestigar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalBloquearInvestigar(turn, configs, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalBloquearInvestigar(turn, configs, player, target, playerDied);
    }

    private saveGlobalBloquearInvestigar(
        turn: Turn,
        configs: Config,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearInvestigar) {
            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            const targetIsDead = target.killCard(cardKilledByContestar);

            if (targetIsDead)
                playerDied(target.name);

            this.isInvestigating = true;
            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(thirdPerson);
    }

    private saveNormalBloquearInvestigar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const investigarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearInvestigar) {
            const playerIsDead = player.killCard(investigarCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const cardKilledByContestar = (bloquearCard+1)%2 as CardSlot;

            const targetIsDead = target.killCard(cardKilledByContestar);

            if (targetIsDead)
                playerDied(target.name);

            this.isInvestigating = true;
            this.winContesting = true;
        }

        turn.addBlockContester(player);
    }

    private saveBloquearTrocar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        if (this.isGlobalContesting)
            this.saveGlobalBloquearTrocar(turn, configs, player, target, thirdPerson, selfCard, playerDied);
        else
            this.saveNormalBloquearTrocar(turn, configs, player, target, playerDied);
    }

    private saveGlobalBloquearTrocar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        thirdPerson: Player,
        selfCard: CardSlot,
        playerDied: (name: string) => void
    ): void {
        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearTrocar) {
            player.rollbackCards();

            const thirdPersonIsDead = thirdPerson.killCard(selfCard);

            if (thirdPersonIsDead)
                playerDied(thirdPerson.name);
        } else {
            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addCard(selfCard);
        turn.addBlockContester(thirdPerson);
    }

    private saveNormalBloquearTrocar(
        turn: Turn,
        configs: Config,
        player: Player,
        target: Player,
        playerDied: (name: string) => void
    ): void {
        const trocarCard = turn.getFirstCard() as CardSlot;

        const bloquearCard = turn.getLastCard() as CardSlot;

        const bloquearCardType = target.getCard(bloquearCard).getType();

        if (configs.tiposCartas[bloquearCardType].bloquearTrocar) {
            player.rollbackCards();

            const playerIsDead = player.killCard(trocarCard);

            if (playerIsDead)
                playerDied(player.name);
        } else {
            const targetIsDead = target.killCard(bloquearCard);

            if (targetIsDead)
                playerDied(target.name);

            this.winContesting = true;
        }

        turn.addBlockContester(player);
    }

    finish(): TurnState {
        return this.isInvestigating ?
            TurnState.TURN_WAITING_REPLY
            :
            TurnState.TURN_FINISHED;
    }

    actionInfos({
        player,
        target
    }: RequestInfos): ActionInfos {
        return {
            attacker: player.name,
            action: Action.CONTESTAR,
            card: undefined,
            target: target?.name,
            attackedCard: undefined,
            isInvestigating: this.isInvestigating,
            winContesting: this.winContesting
        };
    }
}