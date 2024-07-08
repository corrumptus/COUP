import { Config } from "@utils/socketAPI";
import { Differ } from "@utils/utils";

const COUPConfigToText = {
  "quantidadeMoedasIniciais": (diff: number) => `Moedas iniciais: 3 -> ${diff}`,
  "renda": (diff: number) => `Renda: +$1 -> +$${diff}`,
  "ajudaExterna": (diff: number) => `Ajuda externa: +$2 -> +$${diff}`,
  "quantidadeMinimaGolpeEstado": (diff: number) => `Golpe de estado: -$7 -> -$${diff}`,
  "quantidadeMaximaGolpeEstado": (diff: number) => `Golpe de estado(máximo): 10 -> ${diff}`,
  "religiao": (diff: boolean) => `Religião: não -> sim`,
  "quantidadeTrocarPropriaReligiao": (diff: number) => `Trocar Religião(própria): -$1 -> -$${diff}`,
  "quantidadeTrocarReligiaoOutroJogador": (diff: number) => `Trocar Religião(outro): -$2 -> -$${diff}`,
  "deveresMesmaReligiao": {
    "golpeEstado": (diff: boolean) => `Golpe de estado(Religião): não -> sim`,
    "assassinar": (diff: boolean) => `Assassinar(Religião): não -> sim`,
    "extorquir": (diff: boolean) => `Extorquir(Religião): não -> sim`,
    "taxar": (diff: boolean) => `Taxar(Religião): não -> sim`,
  },
  "tiposCartas": {
    "duque": {
      "taxar": (diff: boolean) => `Taxar(Duque): sim -> não`,
      "extorquir": (diff: boolean) => `Extorquir(Duque): não -> sim`,
      "assassinar": (diff: boolean) => `Assassinar(Duque): não -> sim`,
      "trocarPropria": (diff: boolean) => `Trocar(própria)(Duque): não -> sim`,
      "trocarOutroJogador": (diff: boolean) => `Trocar(outro)(Duque): não -> sim`,
      "investigar": (diff: boolean) => `Investigar(Duque): não -> sim`,
      "quantidadeTaxar": (diff: number) => `Quantidade taxar(Duque): +$3 -> +$${diff}`,
      "quantidadeExtorquir": (diff: number) => `Quantidade extorquir(Duque): 0 -> +$${diff}`,
      "quantidadeAssassinar": (diff: number) => `Quantidade Assassinar(Duque): 0 -> -$${diff}`,
      "quantidadeTrocarPropria": (diff: number) => `Quantidade trocar(própria)(Duque): 0 -> ${diff}`,
      "quantidadeTrocarOutroJogador": (diff: number) => `Quantidade trocar(outro)(Duque): 0 -> ${diff}`,
      "bloquearTaxar": (diff: boolean) => `Bloqueia taxar(Duque): não -> sim`,
      "bloquearExtorquir": (diff: boolean) => `Bloqueia Extorquir(Duque): não -> sim`,
      "bloquearAssassinar": (diff: boolean) => `Bloqueia Assassinar(Duque): não -> sim`,
      "bloquearTrocar": (diff: boolean) => `Bloqueia Trocar(Duque): não -> sim`,
      "bloquearInvestigar": (diff: boolean) => `Bloqueia investigar(Duque): não -> sim`
    },
    "capitao": {
      "taxar": (diff: boolean) => `Taxar(Capitão): não -> sim`,
      "extorquir": (diff: boolean) => `Extorquir(Capitão): sim -> não`,
      "assassinar": (diff: boolean) => `Assassinar(Capitão): não -> sim`,
      "trocarPropria": (diff: boolean) => `Trocar(própria)(Capitão): não -> sim`,
      "trocarOutroJogador": (diff: boolean) => `Trocar(outro)(Capitão): não -> sim`,
      "investigar": (diff: boolean) => `Investigar(Capitão): não -> sim`,
      "quantidadeTaxar": (diff: number) => `Quantidade taxar(Capitão): 0 -> +$${diff}`,
      "quantidadeExtorquir": (diff: number) => `Quantidade extorquir(Capitão): +$2 -> +$${diff}`,
      "quantidadeAssassinar": (diff: number) => `Quantidade Assassinar(Capitão): 0 -> -$${diff}`,
      "quantidadeTrocarPropria": (diff: number) => `Quantidade trocar(própria)(Capitão): 0 -> ${diff}`,
      "quantidadeTrocarOutroJogador": (diff: number) => `Quantidade trocar(outro)(Capitão): 0 -> ${diff}`,
      "bloquearTaxar": (diff: boolean) => `Bloqueia taxar(Capitão): não -> sim`,
      "bloquearExtorquir": (diff: boolean) => `Bloqueia Extorquir(Capitão): sim -> não`,
      "bloquearAssassinar": (diff: boolean) => `Bloqueia Assassinar(Capitão): não -> sim`,
      "bloquearTrocar": (diff: boolean) => `Bloqueia Trocar(Capitão): não -> sim`,
      "bloquearInvestigar": (diff: boolean) => `Bloqueia investigar(Capitão): não -> sim`
    },
    "assassino": {
      "taxar": (diff: boolean) => `Taxar(Assassino): não -> sim`,
      "extorquir": (diff: boolean) => `Extorquir(Assassino): não -> sim`,
      "assassinar": (diff: boolean) => `Assassinar(Assassino): sim -> não`,
      "trocarPropria": (diff: boolean) => `Trocar(própria)(Assassino): não -> sim`,
      "trocarOutroJogador": (diff: boolean) => `Trocar(outro)(Assassino): não -> sim`,
      "investigar": (diff: boolean) => `Investigar(Assassino): não -> sim`,
      "quantidadeTaxar": (diff: number) => `Quantidade taxar(Assassino): 0 -> +$${diff}`,
      "quantidadeExtorquir": (diff: number) => `Quantidade extorquir(Assassino): 0 -> +$${diff}`,
      "quantidadeAssassinar": (diff: number) => `ReQuantidade Assassinar(Assassino)-$3 -> -$${diff}`,
      "quantidadeTrocarPropria": (diff: number) => `Quantidade trocar(própria)(Assassino): 0 -> ${diff}`,
      "quantidadeTrocarOutroJogador": (diff: number) => `Quantidade trocar(outro)(Assassino): 0 -> ${diff}`,
      "bloquearTaxar": (diff: boolean) => `Bloqueia taxar(Assassino): não -> sim`,
      "bloquearExtorquir": (diff: boolean) => `Bloqueia Extorquir(Assassino): não -> sim`,
      "bloquearAssassinar": (diff: boolean) => `Bloqueia Assassinar(Assassino): não -> sim`,
      "bloquearTrocar": (diff: boolean) => `Bloqueia Trocar(Assassino): não -> sim`,
      "bloquearInvestigar": (diff: boolean) => `Bloqueia investigar(Assassino): não -> sim`
    },
    "condessa": {
      "taxar": (diff: boolean) => `Taxar(Condessa): não -> sim`,
      "extorquir": (diff: boolean) => `Extorquir(Condessa): não -> sim`,
      "assassinar": (diff: boolean) => `Assassinar(Condessa): não -> sim`,
      "trocarPropria": (diff: boolean) => `Trocar(própria)(Condessa): não -> sim`,
      "trocarOutroJogador": (diff: boolean) => `Trocar(outro)(Condessa): não -> sim`,
      "investigar": (diff: boolean) => `Investigar(Condessa): não -> sim`,
      "quantidadeTaxar": (diff: number) => `Quantidade taxar(Condessa): 0 -> +$${diff}`,
      "quantidadeExtorquir": (diff: number) => `Quantidade extorquir(Condessa): 0 -> +$${diff}`,
      "quantidadeAssassinar": (diff: number) => `Quantidade Assassinar(Condessa): 0 -> -$${diff}`,
      "quantidadeTrocarPropria": (diff: number) => `Quantidade trocar(própria)(Condessa): 0 -> ${diff}`,
      "quantidadeTrocarOutroJogador": (diff: number) => `Quantidade trocar(outro)(Condessa): 0 -> ${diff}`,
      "bloquearTaxar": (diff: boolean) => `Bloqueia taxar(Condessa): não -> sim`,
      "bloquearExtorquir": (diff: boolean) => `Bloqueia Extorquir(Condessa): não -> sim`,
      "bloquearAssassinar": (diff: boolean) => `Bloqueia Assassinar(Condessa): sim -> não`,
      "bloquearTrocar": (diff: boolean) => `Bloqueia Trocar(Condessa): não -> sim`,
      "bloquearInvestigar": (diff: boolean) => `Bloqueia investigar(Condessa): não -> sim`
    },
    "embaixador": {
      "taxar": (diff: boolean) => `Taxar(Embaixador): não -> sim`,
      "extorquir": (diff: boolean) => `Extorquir(Embaixador): não -> sim`,
      "assassinar": (diff: boolean) => `Assassinar(Embaixador): não -> sim`,
      "trocarPropria": (diff: boolean) => `Trocar(própria)(Embaixador): sim -> não`,
      "trocarOutroJogador": (diff: boolean) => `Trocar(outro)(Embaixador): não -> sim`,
      "investigar": (diff: boolean) => `Investigar(Embaixador): não -> sim`,
      "quantidadeTaxar": (diff: number) => `Quantidade taxar(Embaixador): 0 -> +$${diff}`,
      "quantidadeExtorquir": (diff: number) => `Quantidade extorquir(Embaixador): 0 -> +$${diff}`,
      "quantidadeAssassinar": (diff: number) => `Quantidade Assassinar(Embaixador): 0 -> -$${diff}`,
      "quantidadeTrocarPropria": (diff: number) => `Quantidade trocar(própria)(Embaixador): 2 -> ${diff}`,
      "quantidadeTrocarOutroJogador": (diff: number) => `Quantidade trocar(outro)(Embaixador): 0 -> ${diff}`,
      "bloquearTaxar": (diff: boolean) => `Bloqueia taxar(Embaixador): não -> sim`,
      "bloquearExtorquir": (diff: boolean) => `Bloqueia Extorquir(Embaixador): sim -> não`,
      "bloquearAssassinar": (diff: boolean) => `Bloqueia Assassinar(Embaixador): não -> sim`,
      "bloquearTrocar": (diff: boolean) => `Bloqueia Trocar(Embaixador): não -> sim`,
      "bloquearInvestigar": (diff: boolean) => `Bloqueia investigar(Embaixador): não -> sim`
    },
    "inquisidor": {
      "taxar": (diff: boolean) => `Taxar(Inquisidor): não -> sim`,
      "extorquir": (diff: boolean) => `Extorquir(Inquisidor): não -> sim`,
      "assassinar": (diff: boolean) => `Assassinar(Inquisidor): não -> sim`,
      "trocarPropria": (diff: boolean) => `Trocar(própria)(Inquisidor): sim -> não`,
      "trocarOutroJogador": (diff: boolean) => `Trocar(outro)(Inquisidor): sim -> não`,
      "investigar": (diff: boolean) => `Investigar(Inquisidor): sim -> não`,
      "quantidadeTaxar": (diff: number) => `Quantidade taxar(Inquisidor): 0 -> +$${diff}`,
      "quantidadeExtorquir": (diff: number) => `Quantidade extorquir(Inquisidor): 0 -> +$${diff}`,
      "quantidadeAssassinar": (diff: number) => `Quantidade Assassinar(Inquisidor): 0 -> -$${diff}`,
      "quantidadeTrocarPropria": (diff: number) => `Quantidade trocar(própria)(Inquisidor): 1 -> ${diff}`,
      "quantidadeTrocarOutroJogador": (diff: number) => `Quantidade trocar(outro)(Inquisidor): 1 -> ${diff}`,
      "bloquearTaxar": (diff: boolean) => `Bloqueia taxar(Inquisidor): não -> sim`,
      "bloquearExtorquir": (diff: boolean) => `Bloqueia Extorquir(Inquisidor): sim -> não`,
      "bloquearAssassinar": (diff: boolean) => `Bloqueia Assassinar(Inquisidor): não -> sim`,
      "bloquearTrocar": (diff: boolean) => `Bloqueia Trocar(Inquisidor): não -> sim`,
      "bloquearInvestigar": (diff: boolean) => `Bloqueia investigar(Inquisidor): não -> sim`
    }
  }
}

function diffsToString<T>(diff: T, converter: Record<string, Function>): string[] {
  const diffs: string[] = [];

  for (let key in diff) {
    if (typeof diff[key] !== "object")
      diffs.push(converter[key]((diff[key] as any)[1]));
    else {
      diffs.push(...diffsToString(diff[key], converter[key] as unknown as Record<string, Function>))
    }
  }

  return diffs;
}

export default function ConfigDiff({
  configDiff,
  disappear
}: {
  configDiff: Differ<Config>,
  disappear: () => void
}) {
  setTimeout(() => {
    disappear();
  }, 4000);

  const getDiffs = diffsToString(configDiff, COUPConfigToText as unknown as Record<string, Function>);

  return (
    <div className="w-full max-h-[350px] absolute top-[50%] translate-y-[-50%] bg-neutral-400 flex flex-wrap px-[20%]">
      {getDiffs.map((d => <span key={d}>{d}</span>))}
    </div>
  )
}