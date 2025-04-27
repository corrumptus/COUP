import Lobby from "@entitys/Lobby";

export default class BeginMatchValidator {
    static validate(lobby: Lobby): string | undefined {
        if (lobby.getState().players.length < 2)
            return "Um jogo só pode ser criado com mais de 1 pessoa";

        return undefined;
    }
}