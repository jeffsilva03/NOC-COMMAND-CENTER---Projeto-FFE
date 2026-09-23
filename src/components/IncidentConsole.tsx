import {
  AlertTriangle,
  Server,
} from 'lucide-react';

import type {
  DashboardIncident,
  DashboardLog,
} from '../types/fleet';

interface IncidentConsoleProps {
  logs: DashboardLog[];

  incidents:
    DashboardIncident[];
}

function methodColor(
  method: string
) {
  if (method === 'GET') {
    return 'text-cyan-400';
  }

  if (method === 'POST') {
    return 'text-emerald-400';
  }

  if (method === 'PUT') {
    return 'text-amber-400';
  }

  if (method === 'DELETE') {
    return 'text-rose-400';
  }

  return 'text-slate-400';
}

function incidentStyle(
  level: string
) {
  if (
    level ===
    'CRITICAL'
  ) {
    return {
      border:
        'border-rose-500',

      text:
        'text-rose-400',

      bg:
        'bg-rose-500/5',
    };
  }

  if (
    level ===
    'WARNING'
  ) {
    return {
      border:
        'border-amber-500',

      text:
        'text-amber-400',

      bg:
        'bg-amber-500/5',
    };
  }

  return {
    border:
      'border-cyan-500',

    text:
      'text-cyan-400',

    bg:
      'bg-cyan-500/5',
  };
}

function formatDate(
  date: string
) {
  const parsed =
    new Date(
      `${date.replace(
        ' ',
        'T'
      )}Z`
    );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed
    .toLocaleTimeString(
      'pt-BR'
    );
}

export function IncidentConsole({
  logs,
  incidents,
}: IncidentConsoleProps) {
  return (
    <section
      className="
        border-t
        border-slate-800
        bg-[#050a12]
        px-6
        py-8
        text-slate-200
        lg:px-10
      "
    >

      <div
        className="
          mb-6
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              h-8
              w-1
              bg-blue-500
            "
          />

          <Server
            size={17}
            className="
              text-blue-400
            "
          />

          <h2
            className="
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-white
              md:text-base
            "
          >
            Incidentes de Frota
            & Logs de Sistema
          </h2>

        </div>

        <span
          className="
            font-mono
            text-[9px]
            uppercase
            tracking-widest
            text-slate-600
          "
        >
          DADOS PERSISTIDOS NO SQLITE
        </span>

      </div>

      <div
        className="
          grid
          gap-8
          xl:grid-cols-[1.35fr_1fr]
        "
      >

        {/* ============================= */}
        {/* LOGS REAIS */}
        {/* ============================= */}

        <section
          className="
            overflow-hidden
            rounded-lg
            border
            border-slate-800
            bg-[#080d14]
          "
        >

          <div
            className="
              border-b
              border-slate-800
              px-5
              py-3
            "
          >

            <span
              className="
                font-mono
                text-xs
                text-slate-400
              "
            >
              ● ● ●
              {' '}
              api_logs.sqlite
            </span>

          </div>

          <div
            className="
              h-[430px]
              overflow-y-auto
              p-5
              font-mono
              text-[11px]
              leading-7
            "
          >

            {logs.length ===
              0 && (
              <p
                className="
                  text-slate-600
                "
              >
                Nenhum log
                registrado.
              </p>
            )}

            {logs.map(
              (log) => (
                <div
                  key={log.id}
                  className="
                    flex
                    gap-3
                    whitespace-nowrap
                  "
                >

                  <span
                    className="
                      text-slate-700
                    "
                  >
                    [
                    {formatDate(
                      log.criado_em
                    )}
                    ]
                  </span>

                  <span
                    className={`
                      w-12
                      font-bold
                      ${methodColor(
                        log.metodo
                      )}
                    `}
                  >
                    {log.metodo}
                  </span>

                  <span
                    className="
                      text-slate-300
                    "
                  >
                    {log.endpoint}
                  </span>

                  <span
                    className="
                      text-slate-600
                    "
                  >
                    HTTP
                  </span>

                  <span
                    className={
                      log.status <
                      400
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }
                  >
                    {log.status}
                  </span>

                  <span
                    className="
                      text-slate-700
                    "
                  >
                    (
                    {log.latencia_ms}
                    ms)
                  </span>

                </div>
              )
            )}

          </div>

        </section>

        {/* ============================= */}
        {/* INCIDENTES REAIS */}
        {/* ============================= */}

        <section
          className="
            rounded-lg
            border
            border-slate-800
            bg-[#080d14]
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-800
              px-5
              py-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <AlertTriangle
                size={16}
                className="
                  text-amber-400
                "
              />

              <h3
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-white
                "
              >
                Incidentes Recentes
              </h3>

            </div>

            <span
              className="
                font-mono
                text-[10px]
                text-rose-400
              "
            >
              {incidents.length}
              {' '}
              REGISTROS
            </span>

          </div>

          <div
            className="
              h-[430px]
              overflow-y-auto
              p-5
            "
          >

            {incidents.length ===
              0 && (
              <p
                className="
                  text-xs
                  text-slate-600
                "
              >
                Nenhum incidente
                registrado.
              </p>
            )}

            {incidents.map(
              (incident) => {
                const style =
                  incidentStyle(
                    incident.nivel
                  );

                return (
                  <article
                    key={
                      incident.id
                    }
                    className={`
                      mb-4
                      border-l-2
                      p-4
                      ${style.border}
                      ${style.bg}
                    `}
                  >

                    <div
                      className="
                        flex
                        gap-3
                      "
                    >

                      <span
                        className="
                          font-mono
                          text-[9px]
                          text-slate-600
                        "
                      >
                        {formatDate(
                          incident.criado_em
                        )}
                      </span>

                      <div>

                        <p
                          className={`
                            font-mono
                            text-[10px]
                            font-bold
                            ${style.text}
                          `}
                        >
                          [
                          {
                            incident.nivel
                          }
                          ]
                        </p>

                        <p
                          className="
                            mt-2
                            text-xs
                            leading-6
                            text-slate-300
                          "
                        >
                          {
                            incident.mensagem
                          }
                        </p>

                        {incident
                          .link_nome && (
                          <p
                            className="
                              mt-2
                              text-[9px]
                              text-slate-600
                            "
                          >
                            {
                              incident
                                .link_nome
                            }
                          </p>
                        )}

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        </section>

      </div>

    </section>
  );
}