import { Config, useSocket } from "@/app/utils/socketAPI";

export default function Configuracoes({ configs, canEdit }: { configs: Config, canEdit: boolean }) {
  const configStyles = "flex flex-col gap-4 overflow-auto px-[3%]";

  const socket = useSocket("http://localhost:5000");

  if (socket === undefined)
      return;

  if (canEdit)
    return (
      <div className={configStyles}>
        <div>
          <h3 className="text-2xl font-bold text-center">Dinheiro</h3>
          <div className="config_outer_div">
            <label>Moedas Iniciais</label>
            <input
              type="number"
              value={configs.quantidadeMoedasIniciais}
              min={0}
              onChange={e => {
                socket.emit("updateConfigs", ["quantidadeMoedasIniciais"], Number(e.target.value))
              }}
            />
          </div>
          <div className="config_outer_div">
            <label>Renda</label>
            <input
              type="number"
              value={configs.renda}
              min={0}
              onChange={e =>
                socket.emit("updateConfigs", ["renda"], Number(e.target.value))
              }
            />
          </div>
          <div className="config_outer_div">
            <label>Ajuda Externa</label>
            <input
              type="number"
              value={configs.ajudaExterna}
              min={0}
              onChange={e =>
                socket.emit("updateConfigs", ["ajudaExterna"], Number(e.target.value))
              }
            />
          </div>
          <div className="config_outer_div">
            <label>Golpe de Estado(Minimo)</label>
            <input
              type="number"
              value={configs.quantidadeMinimaGolpeEstado}
              min={0}
              onChange={e =>
                socket.emit("updateConfigs", ["quantidadeMinimaGolpeEstado"], Number(e.target.value))
              }
            />
          </div>
          <div className="config_outer_div">
            <label>Golpe de Estado(Máximo)</label>
            <input
              type="number"
              value={configs.quantidadeMaximaGolpeEstado}
              min={0}
              onChange={e =>
                socket.emit("updateConfigs", ["quantidadeMaximaGolpeEstado"], Number(e.target.value))
              }
            />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-center">Religião</h3>
          <div className="config_checkbox pr-[calc(100%-80px)]">
            <label>Religião</label>
            <input
              type="checkbox"
              checked={configs.religiao}
              onChange={e =>
                socket.emit("updateConfigs", ["religiao"], e.target.checked)
              }
            />
          </div>
          {configs.religiao && <div className="w-full">
            <div className="config_outer_div">
              <label>Trocar Religião(Própria)</label>
              <input
                type="number"
                value={configs.quantidadeTrocarPropriaReligiao}
                min={0}
                onChange={e =>
                  socket.emit("updateConfigs", ["quantidadeTrocarPropriaReligiao"], Number(e.target.value))
                }
              />
            </div>
            <div className="config_outer_div">
              <label>Trocar Religião(Inimigo)</label>
              <input
                type="number"
                value={configs.quantidadeTrocarReligiaoOutroJogador}
                min={0}
                onChange={e =>
                  socket.emit("updateConfigs", ["quantidadeTrocarReligiaoOutroJogador"], Number(e.target.value))
                }
              />
            </div>
            <div className="w-full">
              <p>Mandamentos da Religião</p>
              <div className="w-full">
                <div className="config_checkbox pr-[calc(100%-146px)]">
                  <label>Golpe de Estado</label>
                  <input
                    type="checkbox"
                    checked={configs.deveresMesmaReligiao.golpeEstado}
                    onChange={e =>
                      socket.emit("updateConfigs", ["deveresMesmaReligiao", "golpeEstado"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.deveresMesmaReligiao.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["deveresMesmaReligiao", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.deveresMesmaReligiao.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["deveresMesmaReligiao", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.deveresMesmaReligiao.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["deveresMesmaReligiao", "taxar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            </div>
          }
        </div>
        
        <div className="config_outer_div">
          <h3 className="text-2xl font-bold text-center">Cartas</h3>
          <div className="w-full flex flex-col gap-6 config_cartas">
            <div>
              <p>Duque</p>
              <div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-144px)]">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.trocarPropria}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "trocarPropria"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-136px)]">
                  <label>Trocar(Inimigo)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.trocarOutroJogador}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "trocarOutroJogador"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-95px)]">
                  <label>Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.investigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "investigar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Taxar Banco</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.duque.quantidadeTaxar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "quantidadeTaxar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Extorquir Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.duque.quantidadeExtorquir}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "quantidadeExtorquir"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Assassinar Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.duque.quantidadeAssassinar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "quantidadeAssassinar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Própria)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.duque.quantidadeTrocarPropria}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "quantidadeTrocarPropria"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Inimigo)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.duque.quantidadeTrocarOutroJogador}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "quantidadeTrocarOutroJogador"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-133px)]">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-159px)]">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-172px)]">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-252px)]">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-165px)]">
                  <label>Bloqueia Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearInvestigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearInvestigar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Capitão</p>
              <div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-144px)]">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.trocarPropria}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "trocarPropria"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-136px)]">
                  <label>Trocar(Inimigo)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.trocarOutroJogador}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "trocarOutroJogador"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-95px)]">
                  <label>Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.investigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "investigar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Taxar Banco</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.capitao.quantidadeTaxar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "quantidadeTaxar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Extorquir Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.capitao.quantidadeExtorquir}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "quantidadeExtorquir"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Assassinar Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.capitao.quantidadeAssassinar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "quantidadeAssassinar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Própria)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.capitao.quantidadeTrocarPropria}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "quantidadeTrocarPropria"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Inimigo)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.capitao.quantidadeTrocarOutroJogador}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "quantidadeTrocarOutroJogador"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-133px)]">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-159px)]">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-172px)]">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-252px)]">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-165px)]">
                  <label>Bloqueia Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearInvestigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearInvestigar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Assassino</p>
              <div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-144px)]">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.trocarPropria}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "trocarPropria"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-136px)]">
                  <label>Trocar(Inimigo)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.trocarOutroJogador}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "trocarOutroJogador"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-95px)]">
                  <label>Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.investigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "investigar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Taxar Banco</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.assassino.quantidadeTaxar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "quantidadeTaxar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Extorquir Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.assassino.quantidadeExtorquir}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "quantidadeExtorquir"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Assassinar Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.assassino.quantidadeAssassinar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "quantidadeAssassinar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Própria)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.assassino.quantidadeTrocarPropria}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "quantidadeTrocarPropria"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Inimigo)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.assassino.quantidadeTrocarOutroJogador}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "quantidadeTrocarOutroJogador"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-133px)]">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-159px)]">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-172px)]">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-252px)]">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-165px)]">
                  <label>Bloqueia Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearInvestigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearInvestigar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Condessa</p>
              <div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-144px)]">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.trocarPropria}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "trocarPropria"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-136px)]">
                  <label>Trocar(Inimigo)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.trocarOutroJogador}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "trocarOutroJogador"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-95px)]">
                  <label>Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.investigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "investigar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Taxar Banco</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.condessa.quantidadeTaxar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "quantidadeTaxar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Extorquir Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.condessa.quantidadeExtorquir}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "quantidadeExtorquir"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Assassinar Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.condessa.quantidadeAssassinar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "quantidadeAssassinar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Própria)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.condessa.quantidadeTrocarPropria}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "quantidadeTrocarPropria"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Inimigo)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.condessa.quantidadeTrocarOutroJogador}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "quantidadeTrocarOutroJogador"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-133px)]">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-159px)]">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-172px)]">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-252px)]">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-165px)]">
                  <label>Bloqueia Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearInvestigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearInvestigar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Embaixador</p>
              <div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-144px)]">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.trocarPropria}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "trocarPropria"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-136px)]">
                  <label>Trocar(Inimigo)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.trocarOutroJogador}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "trocarOutroJogador"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-95px)]">
                  <label>Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.investigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "investigar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Taxar Banco</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.embaixador.quantidadeTaxar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "quantidadeTaxar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Extorquir Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.embaixador.quantidadeExtorquir}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "quantidadeExtorquir"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Assassinar Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.embaixador.quantidadeAssassinar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "quantidadeAssassinar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Própria)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.embaixador.quantidadeTrocarPropria}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "quantidadeTrocarPropria"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Inimigo)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.embaixador.quantidadeTrocarOutroJogador}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "quantidadeTrocarOutroJogador"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-133px)]">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-159px)]">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-172px)]">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-252px)]">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-165px)]">
                  <label>Bloqueia Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearInvestigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearInvestigar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Inquisidor</p>
              <div>
                <div className="config_checkbox pr-[calc(100%-63px)]">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-89px)]">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-103px)]">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-144px)]">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.trocarPropria}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "trocarPropria"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-136px)]">
                  <label>Trocar(Inimigo)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.trocarOutroJogador}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "trocarOutroJogador"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-95px)]">
                  <label>Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.investigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "investigar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Taxar Banco</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.inquisidor.quantidadeTaxar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "quantidadeTaxar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Extorquir Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.inquisidor.quantidadeExtorquir}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "quantidadeExtorquir"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Assassinar Inimigo</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.inquisidor.quantidadeAssassinar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "quantidadeAssassinar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Própria)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.inquisidor.quantidadeTrocarPropria}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "quantidadeTrocarPropria"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_outer_div">
                  <label>Trocar Cartas(Inimigo)</label>
                  <input
                    type="number"
                    value={configs.tiposCartas.inquisidor.quantidadeTrocarOutroJogador}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "quantidadeTrocarOutroJogador"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-133px)]">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-159px)]">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-172px)]">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-252px)]">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox pr-[calc(100%-165px)]">
                  <label>Bloqueia Investigar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearInvestigar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearInvestigar"], e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className={configStyles}>
      <div className="w-full">
        <h3 className="text-2xl font-bold text-center">Dinheiro</h3>
        <div className="config_outer_div ">
          <p className="text-xl">Moedas Iniciais</p>
          <p className="text-lg">{configs.quantidadeMoedasIniciais}</p>
        </div>
        <div className="config_outer_div config_diferenciation">
          <p className="text-xl">Renda</p>
          <p className="text-lg">{configs.renda}</p>
        </div>
        <div className="config_outer_div">
          <p className="text-xl">Ajuda Externa</p>
          <p className="text-lg">{configs.ajudaExterna}</p>
        </div>
        <div className="config_outer_div config_diferenciation">
          <p className="text-xl">Golpe de Estado(Minimo)</p>
          <p className="text-lg">{configs.quantidadeMinimaGolpeEstado}</p>
        </div>
        <div className="config_outer_div">
          <p className="text-xl">Golpe de Estado(Máximo)</p>
          <p className="text-lg">{configs.quantidadeMaximaGolpeEstado}</p>
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-2xl font-bold text-center">Religião</h3>
        <div className="config_outer_div">
          <p className="text-xl">Religião</p>
          <p className="text-lg">{configs.religiao ? "sim" : "não"}</p>
        </div>
        {configs.religiao && <>
          <div className="config_diferenciation">
            <p className="text-xl">Trocar Religião(Própria)</p>
            <p className="text-lg">{configs.quantidadeTrocarPropriaReligiao}</p>
          </div>
          <div>
            <p className="text-xl">Trocar Religião(Inimigo)</p>
            <p className="text-lg">{configs.quantidadeTrocarReligiaoOutroJogador}</p>
          </div>
          <div className="config_diferenciation">
            <p className="text-xl">Mandamentos da Religião</p>
            <div>
              <div>
                <p className="text-xl">Golpe de Estado</p>
                <p className="text-lg">{configs.deveresMesmaReligiao.golpeEstado ? "sim" : "não"}</p>
              </div>
              <div>
                <p className="text-xl">Assassinar</p>
                <p className="text-lg">{configs.deveresMesmaReligiao.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p className="text-xl">Extorquir</p>
                <p className="text-lg">{configs.deveresMesmaReligiao.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p className="text-xl">Taxar</p>
                <p className="text-lg">{configs.deveresMesmaReligiao.taxar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
        </>
        }
      </div>
      <div className="config_outer_div">
        <h3 className="text-2xl font-bold text-center">Cartas</h3>
        <div className="w-full flex flex-col gap-6 config_not_editable_cartas">
          <div>
            <p>Duque</p>
            <div>
              <div>
                <p>Taxar</p>
                <p>{configs.tiposCartas.duque.taxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Extorquir</p>
                <p>{configs.tiposCartas.duque.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Assassinar</p>
                <p>{configs.tiposCartas.duque.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Próprias)</p>
                <p>{configs.tiposCartas.duque.trocarPropria ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Inimigo)</p>
                <p>{configs.tiposCartas.duque.trocarOutroJogador ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Investigar</p>
                <p>{configs.tiposCartas.duque.investigar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Taxar Banco</p>
                <p>{configs.tiposCartas.duque.quantidadeTaxar}</p>
              </div>
              <div>
                <p>Extorquir Inimigo</p>
                <p>{configs.tiposCartas.duque.quantidadeExtorquir}</p>
              </div>
              <div>
                <p>Assassinar Inimigo</p>
                <p>{configs.tiposCartas.duque.quantidadeAssassinar}</p>
              </div>
              <div>
                <p>Trocar Cartas(Própria)</p>
                <p>{configs.tiposCartas.duque.quantidadeTrocarPropria}</p>
              </div>
              <div>
                <p>Trocar Cartas(Inimigo)</p>
                <p>{configs.tiposCartas.duque.quantidadeTrocarOutroJogador}</p>
              </div>
              <div>
                <p>Bloqueia Taxar</p>
                <p>{configs.tiposCartas.duque.bloquearTaxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Extorquir</p>
                <p>{configs.tiposCartas.duque.bloquearExtorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Assassinar</p>
                <p>{configs.tiposCartas.duque.bloquearAssassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Trocar(Troca Própria)</p>
                <p>{configs.tiposCartas.duque.bloquearTrocar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Investigar</p>
                <p>{configs.tiposCartas.duque.bloquearInvestigar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
          <div>
            <p>Capitão</p>
            <div>
              <div>
                <p>Taxar</p>
                <p>{configs.tiposCartas.capitao.taxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Extorquir</p>
                <p>{configs.tiposCartas.capitao.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Assassinar</p>
                <p>{configs.tiposCartas.capitao.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Próprias)</p>
                <p>{configs.tiposCartas.capitao.trocarPropria ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Inimigo)</p>
                <p>{configs.tiposCartas.capitao.trocarOutroJogador ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Investigar</p>
                <p>{configs.tiposCartas.capitao.investigar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Taxar Banco</p>
                <p>{configs.tiposCartas.capitao.quantidadeTaxar}</p>
              </div>
              <div>
                <p>Extorquir Inimigo</p>
                <p>{configs.tiposCartas.capitao.quantidadeExtorquir}</p>
              </div>
              <div>
                <p>Assassinar Inimigo</p>
                <p>{configs.tiposCartas.capitao.quantidadeAssassinar}</p>
              </div>
              <div>
                <p>Trocar Cartas(Própria)</p>
                <p>{configs.tiposCartas.capitao.quantidadeTrocarPropria}</p>
              </div>
              <div>
                <p>Trocar Cartas(Inimigo)</p>
                <p>{configs.tiposCartas.capitao.quantidadeTrocarOutroJogador}</p>
              </div>
              <div>
                <p>Bloqueia Taxar</p>
                <p>{configs.tiposCartas.capitao.bloquearTaxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Extorquir</p>
                <p>{configs.tiposCartas.capitao.bloquearExtorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Assassinar</p>
                <p>{configs.tiposCartas.capitao.bloquearAssassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Trocar(Troca Própria)</p>
                <p>{configs.tiposCartas.capitao.bloquearTrocar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Investigar</p>
                <p>{configs.tiposCartas.capitao.bloquearInvestigar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
          <div>
            <p>Assassino</p>
            <div>
              <div>
                <p>Taxar</p>
                <p>{configs.tiposCartas.assassino.taxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Extorquir</p>
                <p>{configs.tiposCartas.assassino.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Assassinar</p>
                <p>{configs.tiposCartas.assassino.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Próprias)</p>
                <p>{configs.tiposCartas.assassino.trocarPropria ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Inimigo)</p>
                <p>{configs.tiposCartas.assassino.trocarOutroJogador ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Investigar</p>
                <p>{configs.tiposCartas.assassino.investigar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Taxar Banco</p>
                <p>{configs.tiposCartas.assassino.quantidadeTaxar}</p>
              </div>
              <div>
                <p>Extorquir Inimigo</p>
                <p>{configs.tiposCartas.assassino.quantidadeExtorquir}</p>
              </div>
              <div>
                <p>Assassinar Inimigo</p>
                <p>{configs.tiposCartas.assassino.quantidadeAssassinar}</p>
              </div>
              <div>
                <p>Trocar Cartas(Própria)</p>
                <p>{configs.tiposCartas.assassino.quantidadeTrocarPropria}</p>
              </div>
              <div>
                <p>Trocar Cartas(Inimigo)</p>
                <p>{configs.tiposCartas.assassino.quantidadeTrocarOutroJogador}</p>
              </div>
              <div>
                <p>Bloqueia Taxar</p>
                <p>{configs.tiposCartas.assassino.bloquearTaxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Extorquir</p>
                <p>{configs.tiposCartas.assassino.bloquearExtorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Assassinar</p>
                <p>{configs.tiposCartas.assassino.bloquearAssassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Trocar(Troca Própria)</p>
                <p>{configs.tiposCartas.assassino.bloquearTrocar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Investigar</p>
                <p>{configs.tiposCartas.assassino.bloquearInvestigar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
          <div>
            <p>Condessa</p>
            <div>
              <div>
                <p>Taxar</p>
                <p>{configs.tiposCartas.condessa.taxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Extorquir</p>
                <p>{configs.tiposCartas.condessa.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Assassinar</p>
                <p>{configs.tiposCartas.condessa.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Próprias)</p>
                <p>{configs.tiposCartas.condessa.trocarPropria ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Inimigo)</p>
                <p>{configs.tiposCartas.condessa.trocarOutroJogador ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Investigar</p>
                <p>{configs.tiposCartas.condessa.investigar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Taxar Banco</p>
                <p>{configs.tiposCartas.condessa.quantidadeTaxar}</p>
              </div>
              <div>
                <p>Extorquir Inimigo</p>
                <p>{configs.tiposCartas.condessa.quantidadeExtorquir}</p>
              </div>
              <div>
                <p>Assassinar Inimigo</p>
                <p>{configs.tiposCartas.condessa.quantidadeAssassinar}</p>
              </div>
              <div>
                <p>Trocar Cartas(Própria)</p>
                <p>{configs.tiposCartas.condessa.quantidadeTrocarPropria}</p>
              </div>
              <div>
                <p>Trocar Cartas(Inimigo)</p>
                <p>{configs.tiposCartas.condessa.quantidadeTrocarOutroJogador}</p>
              </div>
              <div>
                <p>Bloqueia Taxar</p>
                <p>{configs.tiposCartas.condessa.bloquearTaxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Extorquir</p>
                <p>{configs.tiposCartas.condessa.bloquearExtorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Assassinar</p>
                <p>{configs.tiposCartas.condessa.bloquearAssassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Trocar(Troca Própria)</p>
                <p>{configs.tiposCartas.condessa.bloquearTrocar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Investigar</p>
                <p>{configs.tiposCartas.condessa.bloquearInvestigar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
          <div>
            <p>Embaixador</p>
            <div>
              <div>
                <p>Taxar</p>
                <p>{configs.tiposCartas.embaixador.taxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Extorquir</p>
                <p>{configs.tiposCartas.embaixador.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Assassinar</p>
                <p>{configs.tiposCartas.embaixador.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Próprias)</p>
                <p>{configs.tiposCartas.embaixador.trocarPropria ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Inimigo)</p>
                <p>{configs.tiposCartas.embaixador.trocarOutroJogador ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Investigar</p>
                <p>{configs.tiposCartas.embaixador.investigar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Taxar Banco</p>
                <p>{configs.tiposCartas.embaixador.quantidadeTaxar}</p>
              </div>
              <div>
                <p>Extorquir Inimigo</p>
                <p>{configs.tiposCartas.embaixador.quantidadeExtorquir}</p>
              </div>
              <div>
                <p>Assassinar Inimigo</p>
                <p>{configs.tiposCartas.embaixador.quantidadeAssassinar}</p>
              </div>
              <div>
                <p>Trocar Cartas(Própria)</p>
                <p>{configs.tiposCartas.embaixador.quantidadeTrocarPropria}</p>
              </div>
              <div>
                <p>Trocar Cartas(Inimigo)</p>
                <p>{configs.tiposCartas.embaixador.quantidadeTrocarOutroJogador}</p>
              </div>
              <div>
                <p>Bloqueia Taxar</p>
                <p>{configs.tiposCartas.embaixador.bloquearTaxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Extorquir</p>
                <p>{configs.tiposCartas.embaixador.bloquearExtorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Assassinar</p>
                <p>{configs.tiposCartas.embaixador.bloquearAssassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Trocar(Troca Própria)</p>
                <p>{configs.tiposCartas.embaixador.bloquearTrocar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Investigar</p>
                <p>{configs.tiposCartas.embaixador.bloquearInvestigar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
          <div>
            <p>Inquisidor</p>
            <div>
              <div>
                <p>Taxar</p>
                <p>{configs.tiposCartas.inquisidor.taxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Extorquir</p>
                <p>{configs.tiposCartas.inquisidor.extorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Assassinar</p>
                <p>{configs.tiposCartas.inquisidor.assassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Próprias)</p>
                <p>{configs.tiposCartas.inquisidor.trocarPropria ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Trocar(Inimigo)</p>
                <p>{configs.tiposCartas.inquisidor.trocarOutroJogador ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Investigar</p>
                <p>{configs.tiposCartas.inquisidor.investigar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Taxar Banco</p>
                <p>{configs.tiposCartas.inquisidor.quantidadeTaxar}</p>
              </div>
              <div>
                <p>Extorquir Inimigo</p>
                <p>{configs.tiposCartas.inquisidor.quantidadeExtorquir}</p>
              </div>
              <div>
                <p>Assassinar Inimigo</p>
                <p>{configs.tiposCartas.inquisidor.quantidadeAssassinar}</p>
              </div>
              <div>
                <p>Trocar Cartas(Própria)</p>
                <p>{configs.tiposCartas.inquisidor.quantidadeTrocarPropria}</p>
              </div>
              <div>
                <p>Trocar Cartas(Inimigo)</p>
                <p>{configs.tiposCartas.inquisidor.quantidadeTrocarOutroJogador}</p>
              </div>
              <div>
                <p>Bloqueia Taxar</p>
                <p>{configs.tiposCartas.inquisidor.bloquearTaxar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Extorquir</p>
                <p>{configs.tiposCartas.inquisidor.bloquearExtorquir ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Assassinar</p>
                <p>{configs.tiposCartas.inquisidor.bloquearAssassinar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Trocar(Troca Própria)</p>
                <p>{configs.tiposCartas.inquisidor.bloquearTrocar ? "sim" : "não"}</p>
              </div>
              <div>
                <p>Bloqueia Investigar</p>
                <p>{configs.tiposCartas.inquisidor.bloquearInvestigar ? "sim" : "não"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}