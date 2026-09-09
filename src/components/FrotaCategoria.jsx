import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DEPENDENCIAS = {
  Caminhão: { id: 2, nome: 'Link VSAT BGAN' },
  Ônibus: { id: 4, nome: 'Sessão BGP' },
  Moto: { id: 5, nome: 'LTE-Móvel' },
  Carro: { id: 1, nome: 'Link VSAT Principal' },
  Caminhonete: { id: 1, nome: 'Link VSAT Principal' },
};

const FALLBACK_OSPF = { id: 3, nome: 'Roteamento OSPF' };

function obterDependencia(tipo) {
  return DEPENDENCIAS[tipo] ?? FALLBACK_OSPF;
}

function obterCombustivel(veiculo) {
  const numero = Number.parseInt(veiculo.id.replace(/\D/g, ''), 10) || 1;
  return Math.max(20, 100 - (numero - 1) * 8);
}

export function FrotaCategoria({ frota, statusLinks }) {
  const { categoria } = useParams();
  const veiculosExibidos = frota.filter((veiculo) => veiculo.tipo === categoria);
  const dependencia = obterDependencia(categoria);
  const linkCategoriaOnline = statusLinks[dependencia.id];

  useEffect(() => {
    if (categoria !== 'Ambulância') return undefined;

    let audioCtx = null;
    let osc = null;
    let gainNode = null;
    let intervalId = null;
    let encerrado = false;

    const iniciarSirene = async () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext || encerrado) return;

        if (!audioCtx) audioCtx = new AudioContext();

        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        if (encerrado || audioCtx.state !== 'running' || osc) return;

        osc = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        osc.type = 'sine';
        gainNode.gain.value = 0.2;
        osc.frequency.setValueAtTime(700, audioCtx.currentTime);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();

        let isHigh = false;
        intervalId = window.setInterval(() => {
          isHigh = !isHigh;
          if (osc && audioCtx?.state === 'running') {
            osc.frequency.setValueAtTime(isHigh ? 960 : 700, audioCtx.currentTime);
          }
        }, 500);
      } catch (erro) {
        console.warn('Áudio bloqueado. Interaja com a página para liberar a sirene.', erro);
      }
    };

    const liberarAudio = () => iniciarSirene();

    iniciarSirene();
    window.addEventListener('pointerdown', liberarAudio);
    window.addEventListener('keydown', liberarAudio);

    return () => {
      encerrado = true;
      window.removeEventListener('pointerdown', liberarAudio);
      window.removeEventListener('keydown', liberarAudio);

      if (intervalId) window.clearInterval(intervalId);

      if (osc) {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Oscilador já encerrado.
        }
      }

      if (gainNode) {
        try {
          gainNode.disconnect();
        } catch {
          // Nó já desconectado.
        }
      }

      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, [categoria]);

  return (
    <main className="container-fluid px-3 px-md-4 mt-4 pb-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center border-bottom border-secondary pb-2 mb-4">
        <div>
          <h4 className="fw-light text-info m-0">
            Telemetria Tática: <span className="fw-bold text-white">{categoria}</span>
          </h4>
          <small className="text-secondary">
            Dependência ativa: <span className="text-light">{dependencia.nome}</span>
          </small>
        </div>

        {!linkCategoriaOnline && (
          <span className="badge bg-danger fs-6 p-2">
            ⚠ COMUNICAÇÃO PERDIDA ({dependencia.nome})
          </span>
        )}
      </div>

      <div className="row">
        {veiculosExibidos.length === 0 ? (
          <p className="text-secondary">Nenhum ativo operando nesta categoria.</p>
        ) : (
          veiculosExibidos.map((veiculo) => {
            const dependenciaVeiculo = obterDependencia(veiculo.tipo);
            const veiculoAtivo = statusLinks[dependenciaVeiculo.id];
            const combustivel = obterCombustivel(veiculo);

            const urlMapa = `https://www.google.com/maps/search/?api=1&query=${veiculo.latitude},${veiculo.longitude}`;

            const textoGPS = `${veiculo.latitude}, ${veiculo.longitude}`;

            const horarioSync = veiculo.ultima_atualizacao
              ? new Date(veiculo.ultima_atualizacao).toLocaleTimeString()
              : '--:--:--';

            return (
              <div key={veiculo.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                <section
                  className={`card glass-card h-100 ${!veiculoAtivo ? 'offline-mode border-danger' : ''
                    }`}
                >
                  <div className="cenario">
                    <div
                      className="parallax-bg"
                      style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}
                      aria-hidden="true"
                    ></div>

                    <div className="grid-overlay" aria-hidden="true"></div>

                    <div className="estrada">
                      <div
                        className="linhas-estrada"
                        style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}
                        aria-hidden="true"
                      ></div>
                    </div>

                    {veiculoAtivo && Number(veiculo.vel) > 0 && (
                      <div className="vento" aria-hidden="true">
                        <div
                          className="linha-vento"
                          style={{ top: '15px', width: '50px', animationDuration: '0.4s' }}
                        ></div>
                        <div
                          className="linha-vento"
                          style={{
                            top: '35px',
                            width: '30px',
                            animationDuration: '0.6s',
                            animationDelay: '0.2s',
                          }}
                        ></div>
                        <div
                          className="linha-vento"
                          style={{
                            top: '50px',
                            width: '65px',
                            animationDuration: '0.8s',
                            animationDelay: '0.1s',
                          }}
                        ></div>
                      </div>
                    )}

                    <a
                      href={veiculoAtivo ? urlMapa : '#'}
                      target={veiculoAtivo ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      title={veiculoAtivo ? 'Rastrear no Google Maps' : 'Veículo Offline'}
                      onClick={(evento) => {
                        if (!veiculoAtivo) evento.preventDefault();
                      }}
                      className="veiculo-container text-decoration-none"
                      style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}
                      aria-label={`Rastrear ${veiculo.tipo} ${veiculo.id}`}
                    >
                      {veiculo.modelo}
                    </a>
                  </div>

                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3 align-items-center gap-2">
                      <h5 className="fw-bold text-info m-0">{veiculo.id}</h5>
                      <span className={`badge ${veiculoAtivo ? 'bg-success' : 'bg-danger'}`}>
                        {veiculoAtivo ? 'SINAL OK' : 'LINK PERDIDO'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between small text-white">
                        <span>Bateria / Combustível</span>
                        <span>{combustivel}%</span>
                      </div>
                      <div className="progress-tech">
                        <div
                          className="progress-tech-bar"
                          style={{
                            width: `${combustivel}%`,
                            background: combustivel < 30 ? '#dc3545' : '#0dcaf0',
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="row text-secondary small">
                      <div className="col-6 mb-2">
                        <strong className="text-white">Velocidade:</strong>
                        <br />
                        <span className={veiculoAtivo ? 'text-info fw-bold' : 'text-danger fw-bold'}>
                          {veiculoAtivo ? `${veiculo.vel} km/h` : '0 km/h'}
                        </span>
                      </div>

                      <div className="col-6 mb-2 text-end">
                        <strong className="text-white">Posição SQL:</strong>
                        <br />

                        <a
                          href={veiculoAtivo ? urlMapa : '#'}
                          target={veiculoAtivo ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          title={veiculoAtivo ? 'Abrir localização no Google Maps' : 'Veículo Offline'}
                          onClick={(evento) => {
                            if (!veiculoAtivo) evento.preventDefault();
                          }}
                          className={`font-monospace text-decoration-none ${veiculoAtivo ? 'text-warning' : 'text-secondary'
                            }`}
                        >
                          {veiculoAtivo ? textoGPS : 'OFFLINE'}
                        </a>

                        <div style={{ fontSize: '0.65rem', marginTop: '4px' }}>
                          Sync: {veiculoAtivo ? horarioSync : '--:--:--'}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
