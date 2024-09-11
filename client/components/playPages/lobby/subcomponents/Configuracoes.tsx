import { COUPSocket, Config } from "@utils/socketAPI";

export default function Configuracoes({
  configs,
  canEdit,
  socket
}: {
  configs: Config,
  canEdit: boolean,
  socket: COUPSocket
}) {
  const configStyles = "flex flex-col gap-4 overflow-auto px-[3%]";

  if (canEdit)
    return (
      <div className={configStyles}>
        <div>
          <h3 className="text-2xl font-bold text-center">Dinheiro</h3>
          <div className="config_outer_div">
            <label>Moedas Iniciais</label>
            <input
              type="number"
              value={configs.moedasIniciais}
              min={0}
              onChange={e => {
                socket.emit("updateConfigs", ["moedasIniciais"], Number(e.target.value))
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
        <div className="flex flex-col items-start">
          <h3 className="text-2xl font-bold text-center w-full">Religião</h3>
          <div className="config_checkbox">
            <label>Religião</label>
            <input
              type="checkbox"
              checked={configs.religiao.reforma}
              onChange={e =>
                socket.emit("updateConfigs", ["religiao", "reforma"], e.target.checked)
              }
            />
          </div>
          {configs.religiao.reforma && <div className="w-full">
              <div className="config_outer_div">
                <label>Trocar Religião(Própria)</label>
                <input
                  type="number"
                  value={configs.religiao.quantidadeTrocarPropria}
                  min={0}
                  onChange={e =>
                    socket.emit("updateConfigs", ["religiao", "quantidadeTrocarPropria"], Number(e.target.value))
                  }
                />
              </div>
              <div className="config_outer_div">
                <label>Trocar Religião(Inimigo)</label>
                <input
                  type="number"
                  value={configs.religiao.quantidadeTrocarOutro}
                  min={0}
                  onChange={e =>
                    socket.emit("updateConfigs", ["religiao", "quantidadeTrocarOutro"], Number(e.target.value))
                  }
                />
              </div>
              <div className="w-full">
                <p>Mandamentos da Religião</p>
                <div className="w-full flex flex-col items-start">
                  <div className="config_checkbox">
                    <label>Golpe de Estado</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.deveres.golpeEstado}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "deveres", "golpeEstado"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label>Assassinar</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.deveres.assassinar}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "deveres", "assassinar"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label>Extorquir</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.deveres.extorquir}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "deveres", "extorquir"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label>Taxar</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.deveres.taxar}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "deveres", "taxar"], e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <p>Cartas Para Corrupção</p>
                <div className="w-full flex flex-col items-start">
                  <div className="config_checkbox">
                    <label htmlFor="">Duque</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.cartasParaCorrupcao.duque}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "cartasParaCorrupcao", "duque"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label htmlFor="">Capitão</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.cartasParaCorrupcao.capitao}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "cartasParaCorrupcao", "capitao"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label htmlFor="">Assassino</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.cartasParaCorrupcao.assassino}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "cartasParaCorrupcao", "assassino"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label htmlFor="">Condessa</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.cartasParaCorrupcao.condessa}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "cartasParaCorrupcao", "condessa"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label htmlFor="">Embaixador</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.cartasParaCorrupcao.embaixador}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "cartasParaCorrupcao", "embaixador"], e.target.checked)
                      }
                    />
                  </div>
                  <div className="config_checkbox">
                    <label htmlFor="">Inquisidor</label>
                    <input
                      type="checkbox"
                      checked={configs.religiao.cartasParaCorrupcao.inquisidor}
                      onChange={e =>
                        socket.emit("updateConfigs", ["religiao", "cartasParaCorrupcao", "inquisidor"], e.target.checked)
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
              <div className="w-full flex flex-col items-start">
                <div className="config_checkbox">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.trocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "trocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
                    value={configs.tiposCartas.duque.quantidadeTrocar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "quantidadeTrocar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.duque.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "duque", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
              <div className="w-full flex flex-col items-start">
                <div className="config_checkbox">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.trocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "trocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
                    value={configs.tiposCartas.capitao.quantidadeTrocar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "quantidadeTrocar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.capitao.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "capitao", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
              <div className="w-full flex flex-col items-start">
                <div className="config_checkbox">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.trocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "trocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
                    value={configs.tiposCartas.assassino.quantidadeTrocar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "quantidadeTrocar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.assassino.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "assassino", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
              <div className="w-full flex flex-col items-start">
                <div className="config_checkbox">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.trocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "trocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
                    value={configs.tiposCartas.condessa.quantidadeTrocar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "quantidadeTrocar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.condessa.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "condessa", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
              <div className="w-full flex flex-col items-start">
                <div className="config_checkbox">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.trocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "trocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
                    value={configs.tiposCartas.embaixador.quantidadeTrocar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "quantidadeTrocar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.embaixador.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "embaixador", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
              <div className="w-full flex flex-col items-start">
                <div className="config_checkbox">
                  <label>Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.taxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "taxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.extorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "extorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.assassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "assassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Trocar(Próprias)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.trocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "trocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
                    value={configs.tiposCartas.inquisidor.quantidadeTrocar}
                    min={0}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "quantidadeTrocar"], Number(e.target.value))
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Taxar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearTaxar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearTaxar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Extorquir</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearExtorquir}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearExtorquir"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Assassinar</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearAssassinar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearAssassinar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
                  <label>Bloqueia Trocar(Troca Própria)</label>
                  <input
                    type="checkbox"
                    checked={configs.tiposCartas.inquisidor.bloquearTrocar}
                    onChange={e =>
                      socket.emit("updateConfigs", ["tiposCartas", "inquisidor", "bloquearTrocar"], e.target.checked)
                    }
                  />
                </div>
                <div className="config_checkbox">
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
          <p className="text-lg">{configs.moedasIniciais}</p>
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
          <p className="text-lg">{configs.religiao.reforma ? "sim" : "não"}</p>
        </div>
        {configs.religiao.reforma && <>
          <div className="config_diferenciation">
            <p className="text-xl">Trocar Religião(Própria)</p>
            <p className="text-lg">{configs.religiao.quantidadeTrocarPropria}</p>
          </div>
          <div>
            <p className="text-xl">Trocar Religião(Inimigo)</p>
            <p className="text-lg">{configs.religiao.quantidadeTrocarOutro}</p>
          </div>
          <div className="config_diferenciation">
            <p className="text-xl">Mandamentos da Religião</p>
            <div>
              <div>
                <p className="text-xl">Golpe de Estado</p>
                <p className="text-lg">{configs.religiao.deveres.golpeEstado ? "não" : "sim"}</p>
              </div>
              <div>
                <p className="text-xl">Assassinar</p>
                <p className="text-lg">{configs.religiao.deveres.assassinar ? "não" : "sim"}</p>
              </div>
              <div>
                <p className="text-xl">Extorquir</p>
                <p className="text-lg">{configs.religiao.deveres.extorquir ? "não" : "sim"}</p>
              </div>
              <div>
                <p className="text-xl">Taxar</p>
                <p className="text-lg">{configs.religiao.deveres.taxar ? "não" : "sim"}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xl">Cartas para Corrupção</p>
            <div>
              <p className="text-xl">Duque</p>
              <p className="text-lg">{configs.religiao.cartasParaCorrupcao.duque ? "sim" : "não"}</p>
            </div>
            <div>
              <p className="text-xl">Capitão</p>
              <p className="text-lg">{configs.religiao.cartasParaCorrupcao.capitao ? "sim" : "não"}</p>
            </div>
            <div>
              <p className="text-xl">Assassino</p>
              <p className="text-lg">{configs.religiao.cartasParaCorrupcao.assassino ? "sim" : "não"}</p>
            </div>
            <div>
              <p className="text-xl">Condessa</p>
              <p className="text-lg">{configs.religiao.cartasParaCorrupcao.condessa ? "sim" : "não"}</p>
            </div>
            <div>
              <p className="text-xl">Embaixador</p>
              <p className="text-lg">{configs.religiao.cartasParaCorrupcao.embaixador ? "sim" : "não"}</p>
            </div>
            <div>
              <p className="text-xl">Inquisidor</p>
              <p className="text-lg">{configs.religiao.cartasParaCorrupcao.inquisidor ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.duque.trocar ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.duque.quantidadeTrocar}</p>
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
                <p>{configs.tiposCartas.capitao.trocar ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.capitao.quantidadeTrocar}</p>
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
                <p>{configs.tiposCartas.assassino.trocar ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.assassino.quantidadeTrocar}</p>
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
                <p>{configs.tiposCartas.condessa.trocar ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.condessa.quantidadeTrocar}</p>
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
                <p>{configs.tiposCartas.embaixador.trocar ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.embaixador.quantidadeTrocar}</p>
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
                <p>{configs.tiposCartas.inquisidor.trocar ? "sim" : "não"}</p>
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
                <p>{configs.tiposCartas.inquisidor.quantidadeTrocar}</p>
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