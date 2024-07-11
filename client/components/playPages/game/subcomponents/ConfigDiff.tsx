import { Config } from "@utils/socketAPI";
import { Differ } from "@utils/utils";

const COUPConfigToText = {
  moedasIniciais: "Moedas iniciais",
  renda: "Renda",
  ajudaExterna: "Ajuda externa",
  quantidadeMinimaGolpeEstado: "Golpe de estado(minimo)",
  quantidadeMaximaGolpeEstado: "Golpe de estado(máxima)",
  religiao: {
    reforma: "religiao",
    quantidadeTrocarPropria: "Trocar Religião(própria)",
    quantidadeTrocarOutro: "Trocar Religião(inimigo)",
    deveres: {
      golpeEstado: "Golpe de estado(Religião)",
      assassinar: "Assassinar(Religião)",
      extorquir: "Extorquir(Religião)",
      taxar: "Taxar(Religião)",
    },
    cartasParaCorrupcao: {
      duque: "Duque(Corrupção)",
      capitao: "Capitão(Corrupção)",
      assassino: "Assassino(Corrupção)",
      condessa: "Condessa(Corrupção)",
      embaixador: "Embaixador(Corrupção)",
      inquisidor: "Inquisidor(Corrupção)"
    }
  },
  tiposCartas: {
    duque: {
      taxar: "Taxar(Duque)",
      extorquir: "Extorquir(Duque)",
      assassinar: "Assassinar(Duque)",
      trocar: "Trocar(Duque)",
      investigar: "Investigar(Duque)",
      quantidadeTaxar: "Quantidade de taxar(Duque)",
      quantidadeExtorquir: "Quantidade de extorquir(Duque)",
      quantidadeAssassinar: "Quantidade para assassinar(Duque)",
      quantidadeTrocar: "Quantidade de trocas(Duque)",
      quantidadeInvestigar: "Quantidade de investigações(Duque)",
      bloquearTaxar: "Bloquear taxar(Duque)",
      bloquearExtorquir: "Bloquear extorquir(Duque)",
      bloquearAssassinar: "Bloquear assassinar(Duque)",
      bloquearTrocar: "Bloquear trocar(Duque)",
      bloquearInvestigar: "Bloquear investigar(Duque)",
    },
    capitao: {
      taxar: "Taxar(Capitão)",
      extorquir: "Extorquir(Capitão)",
      assassinar: "Assassinar(Capitão)",
      trocar: "Trocar(Capitão)",
      investigar: "Investigar(Capitão)",
      quantidadeTaxar: "Quantidade de taxar(Capitão)",
      quantidadeExtorquir: "Quantidade de extorquir(Capitão)",
      quantidadeAssassinar: "Quantidade para assassinar(Capitão)",
      quantidadeTrocar: "Quantidade de trocas(Capitão)",
      quantidadeInvestigar: "Quantidade de investigações(Capitão)",
      bloquearTaxar: "Bloquear taxar(Capitão)",
      bloquearExtorquir: "Bloquear extorquir(Capitão)",
      bloquearAssassinar: "Bloquear assassinar(Capitão)",
      bloquearTrocar: "Bloquear trocar(Capitão)",
      bloquearInvestigar: "Bloquear investigar(Capitão)",
    },
    assassino: {
      taxar: "Taxar(Assassino)",
      extorquir: "Extorquir(Assassino)",
      assassinar: "Assassinar(Assassino)",
      trocar: "Trocar(Assassino)",
      investigar: "Investigar(Assassino)",
      quantidadeTaxar: "Quantidade de taxar(Assassino)",
      quantidadeExtorquir: "Quantidade de extorquir(Assassino)",
      quantidadeAssassinar: "Quantidade para assassinar(Assassino)",
      quantidadeTrocar: "Quantidade de trocas(Assassino)",
      quantidadeInvestigar: "Quantidade de investigações(Assassino)",
      bloquearTaxar: "Bloquear taxar(Assassino)",
      bloquearExtorquir: "Bloquear extorquir(Assassino)",
      bloquearAssassinar: "Bloquear assassinar(Assassino)",
      bloquearTrocar: "Bloquear trocar(Assassino)",
      bloquearInvestigar: "Bloquear investigar(Assassino)",
    },
    condessa: {
      taxar: "Taxar(Condessa)",
      extorquir: "Extorquir(Condessa)",
      assassinar: "Assassinar(Condessa)",
      trocar: "Trocar(Condessa)",
      investigar: "Investigar(Condessa)",
      quantidadeTaxar: "Quantidade de taxar(Condessa)",
      quantidadeExtorquir: "Quantidade de extorquir(Condessa)",
      quantidadeAssassinar: "Quantidade para assassinar(Condessa)",
      quantidadeTrocar: "Quantidade de trocas(Condessa)",
      quantidadeInvestigar: "Quantidade de investigações(Condessa)",
      bloquearTaxar: "Bloquear taxar(Condessa)",
      bloquearExtorquir: "Bloquear extorquir(Condessa)",
      bloquearAssassinar: "Bloquear assassinar(Condessa)",
      bloquearTrocar: "Bloquear trocar(Condessa)",
      bloquearInvestigar: "Bloquear investigar(Condessa)",
    },
    embaixador: {
      taxar: "Taxar(Embaixador)",
      extorquir: "Extorquir(Embaixador)",
      assassinar: "Assassinar(Embaixador)",
      trocar: "Trocar(Embaixador)",
      investigar: "Investigar(Embaixador)",
      quantidadeTaxar: "Quantidade de taxar(Embaixador)",
      quantidadeExtorquir: "Quantidade de extorquir(Embaixador)",
      quantidadeAssassinar: "Quantidade para assassinar(Embaixador)",
      quantidadeTrocar: "Quantidade de trocas(Embaixador)",
      quantidadeInvestigar: "Quantidade de investigações(Embaixador)",
      bloquearTaxar: "Bloquear taxar(Embaixador)",
      bloquearExtorquir: "Bloquear extorquir(Embaixador)",
      bloquearAssassinar: "Bloquear assassinar(Embaixador)",
      bloquearTrocar: "Bloquear trocar(Embaixador)",
      bloquearInvestigar: "Bloquear investigar(Embaixador)",
    },
    inquisidor: {
      taxar: "Taxar(Inquisidor)",
      extorquir: "Extorquir(Inquisidor)",
      assassinar: "Assassinar(Inquisidor)",
      trocar: "Trocar(Inquisidor)",
      investigar: "Investigar(Inquisidor)",
      quantidadeTaxar: "Quantidade de taxar(Inquisidor)",
      quantidadeExtorquir: "Quantidade de extorquir(Inquisidor)",
      quantidadeAssassinar: "Quantidade para assassinar(Inquisidor)",
      quantidadeTrocar: "Quantidade de trocas(Inquisidor)",
      quantidadeInvestigar: "Quantidade de investigações(Inquisidor)",
      bloquearTaxar: "Bloquear taxar(Inquisidor)",
      bloquearExtorquir: "Bloquear extorquir(Inquisidor)",
      bloquearAssassinar: "Bloquear assassinar(Inquisidor)",
      bloquearTrocar: "Bloquear trocar(Inquisidor)",
      bloquearInvestigar: "Bloquear investigar(Inquisidor)",
    }
  }
}

type Converter<T> = {
  [P in keyof T]: string | Converter<T[P]>
}

function diffsToString<T>(diff: Differ<T>, converter: Converter<T>): string[] {
  const diffs: string[] = [];

  for (let key in diff) {
    if (typeof diff[key] === "object" && !Array.isArray(diff[key]))
      diffs.push(...diffsToString(diff[key], converter[key] as Converter<typeof diff[typeof key]>));
    else {
      diffs.push(`${converter[key]}: ${ifBooleanYesOrNo((diff[key] as string[])[0])} -> ${ifBooleanYesOrNo((diff[key] as string[])[1])}`);
    }
  }

  return diffs;
}

function ifBooleanYesOrNo(val: any): string {
  if (typeof val === "boolean")
    return val ? "sim" : "não";

  return String(val);
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

  const getDiffs = diffsToString(configDiff, COUPConfigToText);

  return (
    <div className="w-full max-h-[350px] absolute top-[50%] translate-y-[-50%] bg-neutral-400 flex flex-wrap px-[20%]">
      {getDiffs.map((d => <span key={d}>{d}</span>))}
    </div>
  )
}