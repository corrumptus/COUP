import { useState } from "react"
import type Config from "@type/config";

type InfoType = "duque" | "capitão" | "assassino" | "condessa" | "embaixador" | "inquisidor" | "ações" | "contra-ações" | "açõesCartas" | "religião"

export default function CardGameInfos({
  configs,
  customStyles
}: {
  configs: Config,
  customStyles?: string
}) {
  const [ infoType, setInfoType ] = useState<InfoType>("ações");
  let children: JSX.Element | null = null;

  if (infoType === "ações") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Ações</h3>
      <p className="text-[16px]">Cada <span className="text-red-500">jogador</span> pode efetuar apenas <span className="text-red-500">uma ação</span> por vez.</p>
      <p className="text-[16px]">Um jogador só pode fazer ações se puder pagar por elas.</p>
      <p className="text-[16px]">Toda ação se torna bem sucedida se não houver uma contra-ação.</p>
      <div className="pt-3">
        <h4 className="text-xl text-orange-500">Renda</h4>
        <p className="text-[16px]">
          A renda é uma ação que <span className="text-lime-700">aumenta</span> o seu dinheiro em <span className="text-lime-700">${configs.renda}</span>.
          <span className="text-red-500"> Não</span> pode ser <span className="text-red-500">bloqueado</span> ou <span className="text-red-500">contestado</span>.
        </p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-indigo-700">Ajuda Externa</h4>
        <p className="text-[16px]">
          A ajuda externa é uma ação que <span className="text-lime-700">aumenta</span> o seu dinheiro em <span className="text-lime-700">${configs.ajudaExterna}</span>.
          <span className="text-lime-700"> Pode</span> ser <span className="text-lime-700">bloqueado</span> por quem pode <span className="text-fuchsia-600">taxar</span>, mas <span className="text-red-500">não</span> pode ser <span className="text-red-500">contestado</span>.
        </p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-rose-600">Golpe de Estado</h4>
        <p className="text-[16px]">
          O golpe de estado é uma ação que <span className="text-red-500">requer</span> pelo menos <span className="text-red-500">${configs.quantidadeMinimaGolpeEstado}</span> e é <span className="text-red-500">obrigatório</span> quando se começa um turno com <span className="text-red-500">${configs.quantidadeMaximaGolpeEstado}</span>.
          <span className="text-red-500"> Não</span> pode ser <span className="text-red-500">bloquado</span> ou <span className="text-red-500">contestado</span>.
        </p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-blue-700">Ação de carta</h4>
        <p className="text-[16px]">Cada carta tem acesso a ações que podem ser usadas.</p>
      </div>
    </div>
  );

  if (infoType === "contra-ações") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Contra-ações</h3>
      <p className="text-[16px]">
        Cada <span className="text-red-500">jogador pode</span> usar uma <span className="text-red-500">contra-ação</span> a <span className="text-red-500">qualquer momento</span> dentro da <span className="text-red-500">vez do alvo</span>.
        As contra-ações se tornam <span className="text-red-500">inválidas</span> a partir do momento em que o <span className="text-red-500">novo jogador</span> escolheu a sua <span className="text-red-500">ação</span>.
      </p>
      <div className="pt-3">
        <h4 className="text-xl text-rose-600">Bloqueio</h4>
        <p className="text-[16px]">Um bloqueio deve ser usado para <span className="text-red-500">impedir</span> a <span className="text-red-500">ação</span> de um jogador.
        <span className="text-lime-700"> Pode</span> ser <span className="text-lime-700">contestado</span>.</p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-zinc-600">Contestação</h4>
        <p className="text-[16px]">Uma contestação serve para <span className="text-red-500">verificar</span> se um jogador <span className="text-red-500">realmente</span> poderia fazer uma <span className="text-red-500">ação</span>.</p>
      </div>
    </div>
  );

  function getTaxarValuesString() {
    return Object.entries(configs.tiposCartas)
      .filter(([_, infos]) => infos.taxar)
      .map(([card, infos]) => `+$${infos.quantidadeTaxar}(${card})`)
      .join(", ");
  }

  function getExtorquirValuesString() {
    return Object.entries(configs.tiposCartas)
      .filter(([_, infos]) => infos.extorquir)
      .map(([card, infos]) => `+$${infos.quantidadeExtorquir}(${card})`)
      .join(", ");
  }

  function getAssassinarValuesString() {
    return Object.entries(configs.tiposCartas)
      .filter(([_, infos]) => infos.assassinar)
      .map(([card, infos]) => `-$${infos.quantidadeAssassinar}(${card})`)
      .join(", ");
  }

  function getTrocarValuesString() {
    return Object.entries(configs.tiposCartas)
      .filter(([_, infos]) => infos.trocar)
      .map(([card, infos]) => `${infos.quantidadeTrocar}(${card})`)
      .join(", ");
  }

  if (infoType === "açõesCartas") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Ações de carta</h3>
      <div>
        <h4 className="text-xl text-fuchsia-600">Taxar</h4>
        <p className="text-[16px]">É uma ação que <span className="text-red-500">aumenta</span> o seu dinheiro em {getTaxarValuesString()}.</p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-green-600">Extorquir</h4>
        <p className="text-[16px]">É uma ação que <span className="text-red-500">rouba</span> dinheiro de outro jogador em {getExtorquirValuesString()}.</p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-red-600">Assassinar</h4>
        <p className="text-[16px]">É uma ação que <span className="text-red-500">mata</span> uma influência de outro jogador pelo preço de {getAssassinarValuesString()}.</p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-blue-700">Trocar(própria)</h4>
        <p className="text-[16px]">É uma ação que <span className="text-red-500">troca</span> {getTrocarValuesString()} suas <span className="text-red-500">próprias</span> cartas.</p>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-orange-500">Investigar</h4>
        <p className="text-[16px]">
          É uma ação que permite ao usuário <span className="text-red-500">ver</span> uma das <span className="text-red-500">cartas</span> de <span className="text-red-500">outro</span> jogador
          e concede o poder de <span className="text-red-500">mante-lá</span> ou <span className="text-red-500">troca-lá</span>.
        </p>
      </div>
    </div>
  );

  if (configs.religiao.reforma && infoType === "religião") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Religião</h3>
      <p className="text-[16px]">Cada jogador receberá uma <span className="text-red-500">religião</span> de forma <span className="text-red-500">aleatória</span>.</p>
      <p className="text-[16px]"> Jogadores de uma <span className="text-lime-700">mesma religião</span> não podem usar ações dos <span className="text-red-500">Impedimentos religiosos</span>.</p>
      <p className="text-[16px]"> Se todos os <span className="text-lime-700">jogadores</span> forem da <span className="text-red-500">mesma</span> religião ela <span className="text-red-500">pode</span> ser ou <span className="text-red-500">não ignorada</span>.</p>
      <div className="pt-3">
        <h4 className="text-xl text-blue-700">Conversão</h4>
        <p className="text-[16px]">Troca a religião e coloca o dinheiro no asilo.</p>
        <p className="text-[16px]">O asilo começa com ${configs.religiao.moedasIniciaisAsilo}</p>
        <ul>
          <li>Própria(<span className="text-red-500">-${configs.religiao.quantidadeTrocarPropria}</span>)</li>
          <li>Outro(<span className="text-red-500">-${configs.religiao.quantidadeTrocarOutro}</span>)</li>
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-green-600">Impedimentos religiosos</h4>
        <ul>
          {configs.religiao.deveres.taxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.religiao.deveres.extorquir &&
            <li className="text-orange-500">Extorquir</li>
          }
          {configs.religiao.deveres.assassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.religiao.deveres.golpeEstado &&
            <li className="text-blue-700">Golpe de estado</li>
          }
        </ul>
      </div>
    </div>
  );

  if (infoType === "duque") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Duque</h3>
      <div>
        <h4 className="text-xl text-zinc-600">Ações</h4>
        <ul>
          {configs.tiposCartas.duque.taxar &&
            <li className="text-fuchsia-600">Taxar(+${configs.tiposCartas.duque.quantidadeTaxar})</li>
          }
          {configs.tiposCartas.duque.extorquir &&
            <li className="text-green-600">Extorquir(+${configs.tiposCartas.duque.quantidadeExtorquir})</li>
          }
          {configs.tiposCartas.duque.assassinar &&
            <li className="text-rose-600">Assassinar(-${configs.tiposCartas.duque.quantidadeAssassinar})</li>
          }
          {configs.tiposCartas.duque.trocar &&
            <li className="text-blue-700">Trocar(própria)({configs.tiposCartas.duque.quantidadeTrocar})</li>
          }
          {configs.tiposCartas.duque.investigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-violet-700">Bloqueios</h4>
        <ul>
          {configs.tiposCartas.duque.bloquearTaxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.tiposCartas.duque.bloquearExtorquir &&
            <li className="text-green-600">Extorquir</li>
          }
          {configs.tiposCartas.duque.bloquearAssassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.tiposCartas.duque.bloquearTrocar &&
            <li className="text-blue-700">Trocar</li>
          }
          {configs.tiposCartas.duque.bloquearInvestigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
    </div>
  );

  if (infoType === "capitão") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Capitão</h3>
      <div>
        <h4 className="text-xl text-zinc-600">Ações</h4>
        <ul>
          {configs.tiposCartas.capitao.taxar &&
            <li className="text-fuchsia-600">Taxar(+${configs.tiposCartas.capitao.quantidadeTaxar})</li>
          }
          {configs.tiposCartas.capitao.extorquir &&
            <li className="text-green-600">Extorquir(+${configs.tiposCartas.capitao.quantidadeExtorquir})</li>
          }
          {configs.tiposCartas.capitao.assassinar &&
            <li className="text-rose-600">Assassinar(-${configs.tiposCartas.capitao.quantidadeAssassinar})</li>
          }
          {configs.tiposCartas.capitao.trocar &&
            <li className="text-blue-700">Trocar(própria)({configs.tiposCartas.capitao.quantidadeTrocar})</li>
          }
          {configs.tiposCartas.capitao.investigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-violet-700">Bloqueios</h4>
        <ul>
          {configs.tiposCartas.capitao.bloquearTaxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.tiposCartas.capitao.bloquearExtorquir &&
            <li className="text-green-600">Extorquir</li>
          }
          {configs.tiposCartas.capitao.bloquearAssassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.tiposCartas.capitao.bloquearTrocar &&
            <li className="text-blue-700">Trocar</li>
          }
          {configs.tiposCartas.capitao.bloquearInvestigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
    </div>
  );

  if (infoType === "assassino") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Assassino</h3>
      <div>
        <h4 className="text-xl text-zinc-600">Ações</h4>
        <ul>
          {configs.tiposCartas.assassino.taxar &&
            <li className="text-fuchsia-600">Taxar(+${configs.tiposCartas.assassino.quantidadeTaxar})</li>
          }
          {configs.tiposCartas.assassino.extorquir &&
            <li className="text-green-600">Extorquir(+${configs.tiposCartas.assassino.quantidadeExtorquir})</li>
          }
          {configs.tiposCartas.assassino.assassinar &&
            <li className="text-rose-600">Assassinar(-${configs.tiposCartas.assassino.quantidadeAssassinar})</li>
          }
          {configs.tiposCartas.assassino.trocar &&
            <li className="text-blue-700">Trocar(própria)({configs.tiposCartas.assassino.quantidadeTrocar})</li>
          }
          {configs.tiposCartas.assassino.investigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-violet-700">Bloqueios</h4>
        <ul>
          {configs.tiposCartas.assassino.bloquearTaxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.tiposCartas.assassino.bloquearExtorquir &&
            <li className="text-green-600">Extorquir</li>
          }
          {configs.tiposCartas.assassino.bloquearAssassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.tiposCartas.assassino.bloquearTrocar &&
            <li className="text-blue-700">Trocar</li>
          }
          {configs.tiposCartas.assassino.bloquearInvestigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
    </div>
  );

  if (infoType === "condessa") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Condessa</h3>
      <div>
        <h4 className="text-xl text-zinc-600">Ações</h4>
        <ul>
          {configs.tiposCartas.condessa.taxar &&
            <li className="text-fuchsia-600">Taxar(+${configs.tiposCartas.condessa.quantidadeTaxar})</li>
          }
          {configs.tiposCartas.condessa.extorquir &&
            <li className="text-green-600">Extorquir(+${configs.tiposCartas.condessa.quantidadeExtorquir})</li>
          }
          {configs.tiposCartas.condessa.assassinar &&
            <li className="text-rose-600">Assassinar(-${configs.tiposCartas.condessa.quantidadeAssassinar})</li>
          }
          {configs.tiposCartas.condessa.trocar &&
            <li className="text-blue-700">Trocar(própria)({configs.tiposCartas.condessa.quantidadeTrocar})</li>
          }
          {configs.tiposCartas.condessa.investigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-violet-700">Bloqueios</h4>
        <ul>
          {configs.tiposCartas.condessa.bloquearTaxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.tiposCartas.condessa.bloquearExtorquir &&
            <li className="text-green-600">Extorquir</li>
          }
          {configs.tiposCartas.condessa.bloquearAssassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.tiposCartas.condessa.bloquearTrocar &&
            <li className="text-blue-700">Trocar</li>
          }
          {configs.tiposCartas.condessa.bloquearInvestigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
    </div>
  );

  if (infoType === "embaixador") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Embaixador</h3>
      <div>
        <h4 className="text-xl text-zinc-600">Ações</h4>
        <ul>
          {configs.tiposCartas.embaixador.taxar &&
            <li className="text-fuchsia-600">Taxar(+${configs.tiposCartas.embaixador.quantidadeTaxar})</li>
          }
          {configs.tiposCartas.embaixador.extorquir &&
            <li className="text-green-600">Extorquir(+${configs.tiposCartas.embaixador.quantidadeExtorquir})</li>
          }
          {configs.tiposCartas.embaixador.assassinar &&
            <li className="text-rose-600">Assassinar(-${configs.tiposCartas.embaixador.quantidadeAssassinar})</li>
          }
          {configs.tiposCartas.embaixador.trocar &&
            <li className="text-blue-700">Trocar(própria)({configs.tiposCartas.embaixador.quantidadeTrocar})</li>
          }
          {configs.tiposCartas.embaixador.investigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-violet-700">Bloqueios</h4>
        <ul>
          {configs.tiposCartas.embaixador.bloquearTaxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.tiposCartas.embaixador.bloquearExtorquir &&
            <li className="text-green-600">Extorquir</li>
          }
          {configs.tiposCartas.embaixador.bloquearAssassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.tiposCartas.embaixador.bloquearTrocar &&
            <li className="text-blue-700">Trocar</li>
          }
          {configs.tiposCartas.embaixador.bloquearInvestigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
    </div>
  );

  if (infoType === "inquisidor") children = (
    <div className="h-full overflow-auto">
      <h3 className="text-xl font-bold">Inquisidor</h3>
      <div>
        <h4 className="text-xl text-zinc-600">Ações</h4>
        <ul>
          {configs.tiposCartas.inquisidor.taxar &&
            <li className="text-fuchsia-600">Taxar(+${configs.tiposCartas.inquisidor.quantidadeTaxar})</li>
          }
          {configs.tiposCartas.inquisidor.extorquir &&
            <li className="text-green-600">Extorquir(+${configs.tiposCartas.inquisidor.quantidadeExtorquir})</li>
          }
          {configs.tiposCartas.inquisidor.assassinar &&
            <li className="text-rose-600">Assassinar(-${configs.tiposCartas.inquisidor.quantidadeAssassinar})</li>
          }
          {configs.tiposCartas.inquisidor.trocar &&
            <li className="text-blue-700">Trocar(própria)({configs.tiposCartas.inquisidor.quantidadeTrocar})</li>
          }
          {configs.tiposCartas.inquisidor.investigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
      <div className="pt-3">
        <h4 className="text-xl text-violet-700">Bloqueios</h4>
        <ul>
          {configs.tiposCartas.inquisidor.bloquearTaxar &&
            <li className="text-fuchsia-600">Taxar</li>
          }
          {configs.tiposCartas.inquisidor.bloquearExtorquir &&
            <li className="text-green-600">Extorquir</li>
          }
          {configs.tiposCartas.inquisidor.bloquearAssassinar &&
            <li className="text-rose-600">Assassinar</li>
          }
          {configs.tiposCartas.inquisidor.bloquearTrocar &&
            <li className="text-blue-700">Trocar</li>
          }
          {configs.tiposCartas.inquisidor.bloquearInvestigar &&
            <li className="text-orange-500">Investigar</li>
          }
        </ul>
      </div>
    </div>
  );

  return (
    <div
      className={`h-[250px] w-[200px] p-4 bg-white rounded-2xl flex flex-col gap-1${" " + customStyles || ""}`}
      id="gameView-cardGameInfos"
      data-testid="gameView-cardGameInfos"
    >
      <select
        className="w-full bg-slate-400 border-none rounded-lg outline-none"
        onChange={e => setInfoType(e.target.value as InfoType)}
      >
        <option value="ações">Ações</option>
        <option value="contra-ações">Contra-ações</option>
        <option value="açõesCartas">Ações de carta</option>
        {configs.religiao.reforma &&
          <option value="religião">Religião</option>
        }
        <option value="duque">Duque</option>
        <option value="capitão">Capitão</option>
        <option value="assassino">Assassino</option>
        <option value="condessa">Condessa</option>
        <option value="embaixador">Embaixador</option>
        <option value="inquisidor">Inquisidor</option>
      </select>
      {children}
    </div>
  )
}