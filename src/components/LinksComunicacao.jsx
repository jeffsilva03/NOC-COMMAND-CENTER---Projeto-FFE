export function LinksComunicacao({ dados, statusLinks, toggleLink }) {
  return (
    <main className="container-fluid px-3 px-md-4 mt-4 pb-4">
      <h4 className="fw-light text-info border-bottom border-secondary pb-2 mb-4">
        Monitoramento de Conectividade
      </h4>

      <div className="row">
        {dados.map((item) => {
          const isOnline = statusLinks[item.id];
          const latenciaAtual = isOnline ? item.latencia : 'TIMEOUT';
          const usoBanda = isOnline ? Math.floor(Math.random() * 40) + 40 : 0;

          return (
            <div key={item.id} className="col-12 col-md-6 col-xl-3 mb-4">
              <section
                className={`card glass-card h-100 ${
                  isOnline ? 'border-info' : 'border-danger link-offline'
                }`}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <div>
                        <h6 className="mb-0 fw-bold d-flex align-items-center">
                          <span
                            className={`led-indicator ${isOnline ? 'led-up' : 'led-down'}`}
                            aria-hidden="true"
                          ></span>
                          {item.tipo}
                        </h6>
                        <small className="text-secondary d-block mt-1">Alvo: {item.target}</small>
                      </div>

                      <div className="text-end flex-shrink-0">
                        <small className="text-secondary d-block">Latência</small>
                        <strong className={isOnline ? 'text-success' : 'text-danger'}>
                          {latenciaAtual}
                        </strong>
                      </div>
                    </div>

                    <div className="mb-4 mt-3">
                      <div className="d-flex justify-content-between small text-secondary">
                        <span>Tráfego de Dados</span>
                        <span>{usoBanda}%</span>
                      </div>

                      <div className="progress-tech" aria-label={`Uso de banda ${usoBanda}%`}>
                        <div
                          className={`progress-tech-bar ${isOnline ? 'bg-info' : 'bg-danger'}`}
                          style={{ width: `${usoBanda}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleLink(item.id)}
                    className={`btn btn-sm w-100 fw-bold shadow-sm ${
                      isOnline ? 'btn-outline-danger' : 'btn-success'
                    }`}
                  >
                    {isOnline ? '⚠ Simular Queda' : '🔄 Restaurar Conexão'}
                  </button>
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </main>
  );
}
