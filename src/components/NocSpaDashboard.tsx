import type { ReactNode } from 'react';

import {
  Activity,
  AlertTriangle,
  Car,
  Network,
  RotateCcw,
  Server,
  Wifi,
  WifiOff,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type {
  DashboardData,
} from '../types/fleet';

import {
  IncidentConsole,
} from './IncidentConsole';

import {
  BancoDados,
} from './BancoDados';

interface Props {
  dashboard: DashboardData;

  erroApi: boolean;

  toggleLink:
    (id: number) =>
      Promise<void>;

  derrubarLink:
    (id: number) =>
      Promise<void>;

  restaurarTodos:
    () => Promise<void>;

  simularLinksAlternados:
    () => Promise<void>;

  onAlteracao:
    () => void | Promise<void>;
}

export function NocSpaDashboard({
  dashboard,
  erroApi,
  toggleLink,
  derrubarLink,
  restaurarTodos,
  simularLinksAlternados,
  onAlteracao,
}: Props) {
  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date()
  );

  const {
    sistema,
    links,
    categorias,
    historicoVelocidade,
    incidentes,
    logs,
  } = dashboard;

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setCurrentTime(
            new Date()
          );
        },
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, []);

  const degraded =
    sistema.status ===
      'DEGRADADO' ||
    sistema.linksOnline <
      sistema.totalLinks;

  return (
    <div
      className="
        min-h-screen
        bg-[#050910]
        text-slate-200
      "
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <header
        className="
          border-b
          border-slate-800
          bg-[#070d15]
          px-6
          py-5
          lg:px-10
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className={`
                  h-3
                  w-3
                  rounded-full
                  ${
                    degraded
                      ? `
                        bg-amber-400
                        shadow-[0_0_14px_#fbbf24]
                      `
                      : `
                        bg-emerald-400
                        shadow-[0_0_14px_#34d399]
                      `
                  }
                `}
              />

              <h1
                className="
                  text-lg
                  font-extrabold
                  tracking-wide
                  text-white
                  lg:text-xl
                "
              >
                NOC COMMAND CENTER

                <span
                  className="
                    ml-2
                    font-light
                    text-slate-400
                  "
                >
                  | MONITORAMENTO DE FROTA
                </span>
              </h1>

            </div>

            <p
              className="
                mt-2
                font-mono
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-slate-600
              "
            >
              BIG DATA TELEMETRY CLUSTER
              {' • '}
              {erroApi
                ? 'API OFFLINE'
                : 'ONLINE'}
            </p>

          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                rounded-md
                border
                border-blue-500/20
                bg-blue-500/5
                px-4
                py-2
                font-mono
                text-xs
                text-blue-300
              "
            >
              <Car size={15} />

              {sistema.totalVeiculos
                .toLocaleString(
                  'pt-BR'
                )}
              {' '}
              VEÍCULOS RASTREADOS
            </div>

            <div
              className={`
                flex
                items-center
                gap-2
                rounded-md
                border
                px-4
                py-2
                text-xs
                font-semibold
                ${
                  degraded
                    ? `
                      border-amber-500/20
                      bg-amber-500/5
                      text-amber-300
                    `
                    : `
                      border-emerald-500/20
                      bg-emerald-500/5
                      text-emerald-300
                    `
                }
              `}
            >
              <Activity
                size={15}
              />

              {degraded
                ? 'DEGRADADO / CONTINGÊNCIA'
                : `SISTEMA OPERACIONAL (${sistema.uptime}%)`}
            </div>

            <div
              className="
                text-right
                font-mono
              "
            >

              <p
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                {currentTime
                  .toLocaleTimeString(
                    'pt-BR'
                  )}
                {' '}
                UTC-3
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-slate-600
                "
              >
                {currentTime
                  .toLocaleDateString(
                    'pt-BR'
                  )}
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* ===================================== */}
      {/* CONTROLES DE SIMULAÇÃO */}
      {/* ===================================== */}

      <section
        className="
          border-b
          border-slate-900
          px-6
          py-6
          lg:px-10
        "
      >

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-[#090f18]
            p-5
          "
        >

          <div
            className="
              mb-4
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-slate-300
              "
            >
              Controle de Simulação:
            </span>

            <span
              className="
                text-xs
                text-slate-600
              "
            >
              As alterações são gravadas
              pelo Back-end no SQLite
            </span>

          </div>

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >

            <button
              onClick={() => {
                void simularLinksAlternados();
              }}
              className="
                rounded-md
                border
                border-slate-700
                bg-slate-800/40
                px-4
                py-2
                text-xs
                text-slate-300
                transition
                hover:bg-slate-700
              "
            >
              Alternar Links
            </button>

            <button
              onClick={() => {
                void derrubarLink(3);
              }}
              className="
                rounded-md
                border
                border-rose-500/20
                bg-rose-500/5
                px-4
                py-2
                text-xs
                text-rose-300
              "
            >
              Derrubar Core OSPF
              (Link 3)
            </button>

            <button
              onClick={() => {
                void derrubarLink(1);
              }}
              className="
                rounded-md
                border
                border-rose-500/20
                bg-rose-500/5
                px-4
                py-2
                text-xs
                text-rose-300
              "
            >
              Derrubar VSAT D2
              (Link 1)
            </button>

            <button
              onClick={() => {
                void restaurarTodos();
              }}
              className="
                flex
                items-center
                gap-2
                rounded-md
                border
                border-emerald-500/20
                bg-emerald-500/5
                px-4
                py-2
                text-xs
                text-emerald-300
              "
            >
              <RotateCcw
                size={13}
              />

              Restaurar Todos
              (100%)
            </button>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* KPIs REAIS */}
      {/* ===================================== */}

      <section
        className="
          grid
          gap-4
          px-6
          py-7
          md:grid-cols-2
          xl:grid-cols-4
          lg:px-10
        "
      >

        <KpiCard
          title="Veículos Rastreados"
          value={
            sistema
              .totalVeiculos
              .toLocaleString(
                'pt-BR'
              )
          }
          subtext={
            `${categorias.length} categorias armazenadas no SQLite`
          }
          icon={
            <Car size={19} />
          }
          color="blue"
        />

        <KpiCard
          title="Veículos Online"
          value={
            sistema
              .veiculosOnline
              .toLocaleString(
                'pt-BR'
              )
          }
          subtext={
            `${sistema.uptime}% da frota com telemetria ativa`
          }
          icon={
            <Activity
              size={19}
            />
          }
          color="green"
        />

        <KpiCard
          title="Links de Telecom"
          value={
            `${sistema.linksOnline} / ${sistema.totalLinks}`
          }
          subtext={
            sistema.linksOnline ===
            sistema.totalLinks
              ? 'Todos os links operacionais'
              : `${
                  sistema.totalLinks -
                  sistema.linksOnline
                } link(s) em contingência`
          }
          icon={
            <Network
              size={19}
            />
          }
          color="amber"
        />

        <KpiCard
          title="Alertas de Frota"
          value={
            sistema
              .alertas
              .toLocaleString(
                'pt-BR'
              )
          }
          subtext={
            `${sistema.veiculosOffline.toLocaleString(
              'pt-BR'
            )} veículos sem comunicação`
          }
          icon={
            <AlertTriangle
              size={19}
            />
          }
          color="red"
        />

      </section>

      {/* ===================================== */}
      {/* LINKS REAIS DO BANCO */}
      {/* ===================================== */}

      <section
        className="
          px-6
          py-7
          lg:px-10
        "
      >

        <SectionTitle
          title="Monitoramento de Conectividade & Links"
          subtitle="DADOS DA TABELA LINKS"
        />

        <div
          className="
            mt-5
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-5
          "
        >

          {links.map(
            (link) => {

              const online =
                Boolean(
                  link.online
                );

              return (
                <article
                  key={link.id}
                  className="
                    rounded-xl
                    border
                    border-slate-800
                    bg-[#090f18]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-2
                    "
                  >

                    <div>

                      <p
                        className="
                          font-mono
                          text-[9px]
                          text-slate-600
                        "
                      >
                        LINK #{link.id}
                      </p>

                      <h3
                        className="
                          mt-1
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        {link.nome}
                      </h3>

                    </div>

                    <div
                      className={`
                        h-2
                        w-2
                        rounded-full
                        ${
                          online
                            ? 'bg-emerald-400'
                            : 'bg-rose-400'
                        }
                      `}
                    />

                  </div>

                  <p
                    className="
                      mt-3
                      text-[10px]
                      text-slate-600
                    "
                  >
                    {link.target}
                  </p>

                  <div
                    className="
                      mt-6
                      space-y-3
                    "
                  >

                    <div
                      className="
                        flex
                        justify-between
                        text-xs
                      "
                    >
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        Latência:
                      </span>

                      <span
                        className={
                          online
                            ? 'text-slate-300'
                            : 'text-rose-400'
                        }
                      >
                        {online
                          ? `${link.latencia_ms}ms`
                          : 'TIMEOUT'}
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        justify-between
                        text-xs
                      "
                    >
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        Tráfego:
                      </span>

                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {online
                          ? link.trafego_percentual
                          : 0}
                        %
                      </span>
                    </div>

                    <div
                      className="
                        h-1
                        overflow-hidden
                        rounded
                        bg-slate-800
                      "
                    >

                      <div
                        style={{
                          width: `${
                            online
                              ? link.trafego_percentual
                              : 0
                          }%`,
                        }}
                        className={`
                          h-full
                          ${
                            online
                              ? 'bg-cyan-400'
                              : 'bg-rose-500'
                          }
                        `}
                      />

                    </div>

                  </div>

                  <button
                    onClick={() => {
                      void toggleLink(
                        link.id
                      );
                    }}
                    className={`
                      mt-5
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-md
                      border
                      px-3
                      py-2
                      text-xs
                      ${
                        online
                          ? `
                            border-slate-700
                            text-slate-400
                          `
                          : `
                            border-emerald-500/20
                            text-emerald-300
                          `
                      }
                    `}
                  >

                    {online ? (
                      <>
                        <WifiOff
                          size={13}
                        />
                        Simular Queda
                      </>
                    ) : (
                      <>
                        <Wifi
                          size={13}
                        />
                        Restaurar Conexão
                      </>
                    )}

                  </button>

                </article>
              );
            }
          )}

        </div>

      </section>

      {/* ===================================== */}
      {/* TELEMETRIA REAL */}
      {/* ===================================== */}

      <section
        className="
          px-6
          py-8
          lg:px-10
        "
      >

        <SectionTitle
          title="Telemetria da Frota por Categoria & Big Data"
          subtitle="CONSULTAS SQL EM TEMPO REAL"
        />

        <div
          className="
            mt-6
            grid
            gap-8
            xl:grid-cols-[1.7fr_0.8fr]
          "
        >

          <div>

            {/* VELOCIDADE */}

            <article
              className="
                rounded-xl
                border
                border-slate-800
                bg-[#090f18]
                p-6
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >

                <div>

                  <h3
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      text-white
                    "
                  >
                    Velocidade Média
                    Global da Frota
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[10px]
                      text-slate-600
                    "
                  >
                    AVG(vel) calculado
                    pelo SQLite
                  </p>

                </div>

                <strong
                  className="
                    font-mono
                    text-2xl
                    font-light
                    text-cyan-400
                  "
                >
                  {sistema.velocidadeMedia}
                  {' '}
                  km/h
                </strong>

              </div>

              <div
                className="
                  mt-8
                  h-[260px]
                "
              >

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={
                      historicoVelocidade
                    }
                  >

                    <CartesianGrid
                      stroke="#182231"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="criado_em"
                      stroke="#475569"
                      tick={{
                        fontSize: 8,
                      }}
                    />

                    <YAxis
                      stroke="#475569"
                      tick={{
                        fontSize: 9,
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        background:
                          '#090f18',
                        border:
                          '1px solid #1e293b',
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="velocidade_media"
                      stroke="#67e8f9"
                      strokeWidth={2}
                      dot={{
                        r: 2,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </article>

            {/* DISTRIBUIÇÃO */}

            <article
              className="
                mt-6
                rounded-xl
                border
                border-slate-800
                bg-[#090f18]
                p-6
              "
            >

              <div
                className="
                  flex
                  justify-between
                "
              >

                <div>

                  <h3
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      text-white
                    "
                  >
                    Distribuição de
                    Veículos por Categoria
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[10px]
                      text-slate-600
                    "
                  >
                    COUNT(*) GROUP BY tipo
                  </p>

                </div>

                <span
                  className="
                    font-mono
                    text-[10px]
                    text-emerald-400
                  "
                >
                  TOTAL:{' '}
                  {sistema
                    .totalVeiculos
                    .toLocaleString(
                      'pt-BR'
                    )}
                </span>

              </div>

              <div
                className="
                  mt-8
                  h-[300px]
                "
              >

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      categorias
                    }
                  >

                    <CartesianGrid
                      stroke="#182231"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="tipo"
                      stroke="#475569"
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={75}
                      tick={{
                        fontSize: 8,
                      }}
                    />

                    <YAxis
                      stroke="#475569"
                      tick={{
                        fontSize: 8,
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        background:
                          '#090f18',
                        border:
                          '1px solid #1e293b',
                      }}
                    />

                    <Bar
                      dataKey="total"
                      fill="#3b82f6"
                      radius={[
                        3,
                        3,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </article>

          </div>

          {/* ================================= */}
          {/* CATEGORIAS REAIS */}
          {/* ================================= */}

          <aside
            className="
              max-h-[690px]
              overflow-y-auto
              rounded-xl
              border
              border-slate-800
              bg-[#090f18]
              p-5
            "
          >

            <div
              className="
                mb-4
                flex
                justify-between
              "
            >

              <h3
                className="
                  text-xs
                  font-bold
                  uppercase
                  text-white
                "
              >
                Status por Categoria
              </h3>

              <span
                className="
                  text-[9px]
                  text-slate-600
                "
              >
                {categorias.length}
                {' '}
                grupos
              </span>

            </div>

            {categorias.map(
              (category) => (

                <article
                  key={
                    category.tipo
                  }
                  className="
                    border-b
                    border-slate-800
                    py-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <strong
                      className="
                        text-sm
                        text-white
                      "
                    >
                      {category.tipo}
                    </strong>

                    <span
                      className={`
                        rounded
                        px-2
                        py-1
                        font-mono
                        text-[9px]
                        ${
                          category.online
                            ? `
                              bg-emerald-500/10
                              text-emerald-300
                            `
                            : `
                              bg-rose-500/10
                              text-rose-300
                            `
                        }
                      `}
                    >
                      {category.online
                        ? 'SINAL OK'
                        : 'OFFLINE'}
                    </span>

                  </div>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[9px]
                          text-slate-600
                        "
                      >
                        VEÍCULOS
                      </p>

                      <p
                        className="
                          mt-1
                          font-mono
                          text-lg
                          text-blue-300
                        "
                      >
                        {category.total
                          .toLocaleString(
                            'pt-BR'
                          )}
                      </p>

                    </div>

                    <div>

                      <p
                        className="
                          text-[9px]
                          text-slate-600
                        "
                      >
                        VEL. MÉDIA
                      </p>

                      <p
                        className="
                          mt-1
                          font-mono
                          text-lg
                          text-cyan-400
                        "
                      >
                        {
                          category
                            .velocidadeMedia
                        }
                        {' '}
                        <small>
                          km/h
                        </small>
                      </p>

                    </div>

                    <div>

                      <p
                        className="
                          text-[9px]
                          text-slate-600
                        "
                      >
                        SINAL
                      </p>

                      <p
                        className="
                          mt-1
                          font-mono
                          text-lg
                          text-emerald-300
                        "
                      >
                        {category.sinal}
                        %
                      </p>

                    </div>

                    <div>

                      <p
                        className="
                          text-[9px]
                          text-slate-600
                        "
                      >
                        DEPENDÊNCIA
                      </p>

                      <p
                        className="
                          mt-1
                          font-mono
                          text-lg
                          text-slate-300
                        "
                      >
                        Link #
                        {
                          category
                            .linkId
                        }
                      </p>

                    </div>

                  </div>

                </article>

              )
            )}

          </aside>

        </div>

      </section>

      {/* ===================================== */}
      {/* LOGS E INCIDENTES REAIS */}
      {/* ===================================== */}

      <IncidentConsole
        logs={logs}
        incidents={
          incidentes
        }
      />

      {/* ===================================== */}
      {/* CRUD REAL */}
      {/* ===================================== */}

      <section
        className="
          border-t
          border-slate-800
        "
      >

        <BancoDados
          onAlteracao={
            onAlteracao
          }
        />

      </section>

    </div>
  );
}

interface KpiProps {
  title: string;

  value: string;

  subtext: string;

  icon: ReactNode;

  color:
    | 'blue'
    | 'green'
    | 'amber'
    | 'red';
}

function KpiCard({
  title,
  value,
  subtext,
  icon,
  color,
}: KpiProps) {
  const colors = {
    blue: {
      line: 'bg-blue-500',
      text: 'text-blue-300',
    },

    green: {
      line: 'bg-emerald-400',
      text: 'text-emerald-300',
    },

    amber: {
      line: 'bg-amber-400',
      text: 'text-amber-300',
    },

    red: {
      line: 'bg-rose-400',
      text: 'text-rose-300',
    },
  };

  return (
    <article
      className="
        relative
        overflow-hidden
        rounded-xl
        border
        border-slate-800
        bg-[#090f18]
        p-6
      "
    >

      <div
        className={`
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          ${colors[color].line}
        `}
      />

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <p
          className="
            text-[10px]
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          {title}
        </p>

        <span
          className={
            colors[color].text
          }
        >
          {icon}
        </span>

      </div>

      <p
        className={`
          mt-5
          font-mono
          text-4xl
          font-light
          ${colors[color].text}
        `}
      >
        {value}
      </p>

      <p
        className="
          mt-3
          text-[10px]
          text-slate-600
        "
      >
        {subtext}
      </p>

    </article>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-3
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
            h-7
            w-1
            bg-blue-500
          "
        />

        <Server
          size={16}
          className="
            text-blue-400
          "
        />

        <h2
          className="
            text-sm
            font-bold
            uppercase
            tracking-wide
            text-white
            md:text-base
          "
        >
          {title}
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
        {subtitle}
      </span>

    </div>
  );
}