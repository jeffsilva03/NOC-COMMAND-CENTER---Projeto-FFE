import {
  useEffect,
} from 'react';

import './App.css';

import {
  NocSpaDashboard,
} from './components/NocSpaDashboard';

import {
  useFleetMonitor,
} from './hooks/useFleetMonitor';

export default function App() {
  const {
    dashboard,
    carregando,
    erroApi,
    carregarDashboard,
    toggleLink,
    derrubarLink,
    restaurarTodos,
    simularLinksAlternados,
  } = useFleetMonitor();

  // =====================================
  // OPENTELEMETRY SIMULADO
  // =====================================

  useEffect(() => {
    if (!dashboard) {
      return;
    }

    const traceId =
      Math.random()
        .toString(16)
        .slice(2);

    console.log(
      `[OTel] TraceID: ${traceId} - Atualizando dashboard...`,
      {
        totalVeiculos:
          dashboard.sistema.totalVeiculos,

        uptime:
          dashboard.sistema.uptime,

        status:
          dashboard.sistema.status,

        linksOnline:
          dashboard.sistema.linksOnline,
      }
    );
  }, [dashboard]);

  // =====================================
  // PRIMEIRO CARREGAMENTO
  // =====================================

  if (
    carregando &&
    !dashboard
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050910]
        "
      >
        <div
          className="
            h-14
            w-14
            animate-spin
            rounded-full
            border-4
            border-slate-800
            border-t-blue-500
          "
        />
      </main>
    );
  }

  // =====================================
  // ERRO TOTAL DA API
  // =====================================

  if (!dashboard) {
    return (
      <main
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          gap-4
          bg-[#050910]
          text-rose-400
        "
      >
        <h1 className="text-xl font-bold">
          API indisponível
        </h1>

        <p className="text-sm text-slate-500">
          Não foi possível carregar o NOC Command Center.
        </p>

        <button
          onClick={() => {
            void carregarDashboard();
          }}
          className="
            rounded-md
            border
            border-blue-500/30
            bg-blue-500/10
            px-4
            py-2
            text-sm
            text-blue-300
          "
        >
          Tentar novamente
        </button>
      </main>
    );
  }

  // =====================================
  // SPA
  // =====================================

  return (
    <NocSpaDashboard
      dashboard={
        dashboard
      }

      erroApi={
        erroApi
      }

      toggleLink={
        toggleLink
      }

      derrubarLink={
        derrubarLink
      }

      restaurarTodos={
        restaurarTodos
      }

      simularLinksAlternados={
        simularLinksAlternados
      }

      onAlteracao={
        carregarDashboard
      }
    />
  );
}