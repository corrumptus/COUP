import { useEffect } from "react";
import Config from "@type/config";
import { Differ, Converter } from "@type/utils";

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
      bloquearTaxar: "Bloquear taxar(Inquisidor)",
      bloquearExtorquir: "Bloquear extorquir(Inquisidor)",
      bloquearAssassinar: "Bloquear assassinar(Inquisidor)",
      bloquearTrocar: "Bloquear trocar(Inquisidor)",
      bloquearInvestigar: "Bloquear investigar(Inquisidor)",
    }
  }
}

function diffsToString<T>(diff: Differ<T>, converter: Converter<T>): string[] {
  const diffs: string[] = [];

  for (let key in diff) {
    if (typeof diff[key] === "object" && !Array.isArray(diff[key]))
      diffs.push(...diffsToString(diff[key] as Differ<typeof diff[typeof key]>, converter[key] as Converter<typeof diff[typeof key]>));
    else
      diffs.push(`${converter[key]}: ${toString((diff[key] as any[])[0])} -> ${toString((diff[key] as any[])[1])}`);
  }

  return diffs;
}

function toString(val: any): string {
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
  const getDiffs = diffsToString(configDiff, COUPConfigToText);

  const timeout = setTimeout(() => {
    disappear();
  }, 4000);

  useEffect(() => {
    return () => {
      if (getDiffs.length === 0) {
        clearTimeout(timeout);
        disappear();
      }
    };
  });

  if (getDiffs.length === 0)
    return undefined;

  return (
    <div
      className="w-full h-full absolute flex flex-col justify-center items-center z-[4] bg-zinc-700/50"
      id="gameView-configDiffs"
      data-testid="gameView-configDiffs"
    >
      <h1 className="text-white text-2xl font-bold">Configurações diferentes</h1>
      <div className="w-[80%] h-[50%] grid grid-cols-2 gap-y-2 bg-neutral-400 p-3 rounded-3xl overflow-auto">
        {getDiffs.map((d =>
          <span
            key={d}
            id="gameView-configDiff"
            data-testid="gameView-configDiff"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}