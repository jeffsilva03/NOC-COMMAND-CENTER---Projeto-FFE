import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/frota';

export function BancoDados({ onAlteracao }) {
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [logs, setLogs] = useState([
    'Server listening on port 3000...',
    'SQLite database connected.',
  ]);

  const [novoVeiculo, setNovoVeiculo] = useState({
    id: '',
    modelo: '🚗',
    tipo: 'Carro',
    vel: '',
    latitude: '',
    longitude: '',
  });

  const [veiculoEdicao, setVeiculoEdicao] = useState(null);

  // =====================================================
  // LOG DO PAINEL
  // =====================================================

  function adicionarLog(mensagem) {
    const horario = new Date().toLocaleTimeString();

    setLogs((logsAtuais) => [
      ...logsAtuais,
      `[${horario}] ${mensagem}`,
    ]);
  }

  // =====================================================
  // GET - LISTAR 500 VEÍCULOS
  // =====================================================

  async function carregarVeiculos() {
    try {
      setCarregando(true);

      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }

      const dados = await resposta.json();

      setVeiculos(dados);

      adicionarLog(
        `GET /api/frota -> ${dados.length} registros carregados`
      );
    } catch (erro) {
      console.error(erro);

      adicionarLog(
        `ERRO GET /api/frota -> ${erro.message}`
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // POST - CRIAR VEÍCULO
  // =====================================================

  async function cadastrarVeiculo(evento) {
    evento.preventDefault();

    if (!novoVeiculo.id || !novoVeiculo.tipo) {
      adicionarLog(
        'POST recusado -> ID e tipo são obrigatórios'
      );

      return;
    }

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(novoVeiculo),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        adicionarLog(
          `POST ${novoVeiculo.id} -> ${resposta.status} ${JSON.stringify(
            dados
          )}`
        );

        return;
      }

      adicionarLog(
        `POST ${novoVeiculo.id} -> 201 Created`
      );

      setNovoVeiculo({
        id: '',
        modelo: '🚗',
        tipo: 'Carro',
        vel: '',
        latitude: '',
        longitude: '',
      });

      await carregarVeiculos();

      if (onAlteracao) {
        onAlteracao();
      }
    } catch (erro) {
      adicionarLog(
        `ERRO POST -> ${erro.message}`
      );
    }
  }

  // =====================================================
  // PUT - ATUALIZAR VEÍCULO
  // =====================================================

  async function atualizarVeiculo(evento) {
    evento.preventDefault();

    if (!veiculoEdicao) return;

    try {
      const resposta = await fetch(
        `${API_URL}/${veiculoEdicao.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            vel: veiculoEdicao.vel,
            latitude: veiculoEdicao.latitude,
            longitude: veiculoEdicao.longitude,
          }),
        }
      );

      if (!resposta.ok) {
        adicionarLog(
          `PUT ${veiculoEdicao.id} -> HTTP ${resposta.status}`
        );

        return;
      }

      adicionarLog(
        `PUT ${veiculoEdicao.id} -> 200 OK`
      );

      setVeiculoEdicao(null);

      await carregarVeiculos();

      if (onAlteracao) {
        onAlteracao();
      }
    } catch (erro) {
      adicionarLog(
        `ERRO PUT -> ${erro.message}`
      );
    }
  }

  // =====================================================
  // DELETE - EXCLUIR VEÍCULO
  // =====================================================

  async function deletarVeiculo(id) {
    const confirmar = window.confirm(
      `Deseja excluir o veículo ${id}?`
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!resposta.ok) {
        adicionarLog(
          `DELETE ${id} -> HTTP ${resposta.status}`
        );

        return;
      }

      adicionarLog(
        `DELETE ${id} -> 204 No Content`
      );

      setVeiculos((listaAtual) =>
        listaAtual.filter(
          (veiculo) => veiculo.id !== id
        )
      );

      if (onAlteracao) {
        onAlteracao();
      }
    } catch (erro) {
      adicionarLog(
        `ERRO DELETE -> ${erro.message}`
      );
    }
  }

  // =====================================================
  // CARREGA AUTOMATICAMENTE AO ABRIR A GUIA
  // =====================================================

  useEffect(() => {
    carregarVeiculos();
  }, []);

  return (
    <div className="crud-page">

      {/* CABEÇALHO */}

      <div className="crud-header">

        <div>
          <h2>🗄️ Banco de Dados (CRUD)</h2>

          <p>
            Gerenciamento da frota armazenada no SQLite
          </p>
        </div>

        <button
          className="crud-limit-btn"
          onClick={carregarVeiculos}
          disabled={carregando}
        >
          🔄 LIMIT 500 (GET)
        </button>

      </div>

      <div className="crud-divider"></div>

      <div className="crud-layout">

        {/* ================================================= */}
        {/* COLUNA ESQUERDA */}
        {/* ================================================= */}

        <aside className="crud-sidebar">

          <section className="crud-panel">

            <h3>
              <span>✚</span> Novo Ativo (POST)
            </h3>

            <form
              className="crud-form"
              onSubmit={cadastrarVeiculo}
            >

              <label>ID único</label>

              <input
                placeholder="V-100001"
                value={novoVeiculo.id}
                onChange={(evento) =>
                  setNovoVeiculo({
                    ...novoVeiculo,
                    id: evento.target.value,
                  })
                }
              />

              <div className="crud-form-row">

                <div>
                  <label>Ícone</label>

                  <select
                    value={novoVeiculo.modelo}
                    onChange={(evento) =>
                      setNovoVeiculo({
                        ...novoVeiculo,
                        modelo: evento.target.value,
                      })
                    }
                  >
                    <option value="🚗">🚗</option>
                    <option value="🚌">🚌</option>
                    <option value="🚚">🚚</option>
                    <option value="🏍️">🏍️</option>
                    <option value="🛻">🛻</option>
                    <option value="🚐">🚐</option>
                    <option value="🚙">🚙</option>
                    <option value="🏎️">🏎️</option>
                    <option value="🚜">🚜</option>
                    <option value="🚑">🚑</option>
                  </select>
                </div>

                <div>
                  <label>Categoria</label>

                  <select
                    value={novoVeiculo.tipo}
                    onChange={(evento) =>
                      setNovoVeiculo({
                        ...novoVeiculo,
                        tipo: evento.target.value,
                      })
                    }
                  >
                    <option>Carro</option>
                    <option>Moto</option>
                    <option>Ônibus</option>
                    <option>Caminhão</option>
                    <option>Caminhonete</option>
                    <option>Van</option>
                    <option>SUV</option>
                    <option>Esportivo</option>
                    <option>Trator</option>
                    <option>Ambulância</option>
                  </select>
                </div>

              </div>

              <div className="crud-form-row">

                <div>
                  <label>Velocidade</label>

                  <input
                    type="number"
                    placeholder="80"
                    value={novoVeiculo.vel}
                    onChange={(evento) =>
                      setNovoVeiculo({
                        ...novoVeiculo,
                        vel: evento.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label>Latitude</label>

                  <input
                    placeholder="-23.5505"
                    value={novoVeiculo.latitude}
                    onChange={(evento) =>
                      setNovoVeiculo({
                        ...novoVeiculo,
                        latitude: evento.target.value,
                      })
                    }
                  />
                </div>

              </div>

              <label>Longitude</label>

              <input
                placeholder="-46.6333"
                value={novoVeiculo.longitude}
                onChange={(evento) =>
                  setNovoVeiculo({
                    ...novoVeiculo,
                    longitude: evento.target.value,
                  })
                }
              />

              <button
                className="crud-post-btn"
                type="submit"
              >
                POST
              </button>

            </form>

          </section>

          {/* TERMINAL */}

          <section className="crud-terminal">

            <h4>🖥️ Terminal Node.js Logs</h4>

            <div className="crud-terminal-content">

              {logs.map((log, index) => (
                <div key={index}>
                  {log}
                </div>
              ))}

            </div>

          </section>

        </aside>

        {/* ================================================= */}
        {/* TABELA */}
        {/* ================================================= */}

        <section className="crud-table-panel">

          <div className="crud-table-title">

            <div>
              <h3>
                🗄️ Tabela SQLite
              </h3>

              <span>
                Amostra de 500 do DB de 100k
              </span>
            </div>

            <div className="crud-count">
              {veiculos.length} registros
            </div>

          </div>

          <div className="crud-table-wrapper">

            <table className="crud-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ícone</th>
                  <th>Categoria</th>
                  <th>Vel.</th>
                  <th>GPS</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id}>

                    <td className="crud-id">
                      {veiculo.id}
                    </td>

                    <td className="crud-icon">
                      {veiculo.modelo}
                    </td>

                    <td>
                      {veiculo.tipo}
                    </td>

                    <td>
                      <span className="crud-speed">
                        {veiculo.vel}
                      </span>
                    </td>

                    <td className="crud-gps">
                      {veiculo.latitude},
                      {' '}
                      {veiculo.longitude}
                    </td>

                    <td>

                      <div className="crud-actions">

                        <button
                          className="crud-put-btn"
                          onClick={() =>
                            setVeiculoEdicao({
                              ...veiculo,
                            })
                          }
                        >
                          PUT
                        </button>

                        <button
                          className="crud-delete-btn"
                          onClick={() =>
                            deletarVeiculo(
                              veiculo.id
                            )
                          }
                        >
                          DEL
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>

      {/* ================================================= */}
      {/* MODAL PUT */}
      {/* ================================================= */}

      {veiculoEdicao && (
        <div className="crud-modal-backdrop">

          <div className="crud-modal">

            <div className="crud-modal-header">

              <div>
                <span className="crud-modal-method">
                  PUT
                </span>

                <h3>
                  Atualizar {veiculoEdicao.id}
                </h3>
              </div>

              <button
                className="crud-modal-close"
                onClick={() =>
                  setVeiculoEdicao(null)
                }
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={atualizarVeiculo}
              className="crud-form"
            >

              <label>Velocidade</label>

              <input
                value={veiculoEdicao.vel}
                onChange={(evento) =>
                  setVeiculoEdicao({
                    ...veiculoEdicao,
                    vel: evento.target.value,
                  })
                }
              />

              <label>Latitude</label>

              <input
                value={
                  veiculoEdicao.latitude
                }
                onChange={(evento) =>
                  setVeiculoEdicao({
                    ...veiculoEdicao,
                    latitude:
                      evento.target.value,
                  })
                }
              />

              <label>Longitude</label>

              <input
                value={
                  veiculoEdicao.longitude
                }
                onChange={(evento) =>
                  setVeiculoEdicao({
                    ...veiculoEdicao,
                    longitude:
                      evento.target.value,
                  })
                }
              />

              <button
                type="submit"
                className="crud-update-confirm"
              >
                SALVAR ALTERAÇÕES
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}