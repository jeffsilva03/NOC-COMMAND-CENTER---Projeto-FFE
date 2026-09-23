import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type {
  DashboardData,
} from '../types/fleet';

const API_URL =
  'http://localhost:3000/api/dashboard';

export function useFleetMonitor() {
  const [
    dashboard,
    setDashboard,
  ] = useState<
    DashboardData | null
  >(null);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erroApi,
    setErroApi,
  ] = useState(false);

  // =========================================
  // BUSCA O DASHBOARD REAL
  // =========================================

  const carregarDashboard =
    useCallback(async () => {
      try {
        const resposta =
          await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error(
            `HTTP ${resposta.status}`
          );
        }

        const dados:
          DashboardData =
          await resposta.json();

        setDashboard(dados);

        setErroApi(false);
      } catch (erro) {
        console.error(
          'Erro ao carregar dashboard:',
          erro
        );

        setErroApi(true);
      } finally {
        setCarregando(false);
      }
    }, []);

  // =========================================
  // ALTERAR LINK NO BANCO
  // =========================================

  const alterarLink =
    useCallback(
      async (
        id: number,
        online: boolean
      ) => {
        try {
          const resposta =
            await fetch(
              `${API_URL}/links/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body:
                  JSON.stringify({
                    online,
                  }),
              }
            );

          if (!resposta.ok) {
            throw new Error(
              `HTTP ${resposta.status}`
            );
          }

          await carregarDashboard();

        } catch (erro) {
          console.error(
            'Erro ao alterar link:',
            erro
          );
        }
      },
      [carregarDashboard]
    );

  // =========================================
  // TOGGLE
  // =========================================

  const toggleLink =
    useCallback(
      async (
        id: number
      ) => {
        if (!dashboard) {
          return;
        }

        const link =
          dashboard.links.find(
            (item) =>
              item.id === id
          );

        if (!link) {
          return;
        }

        await alterarLink(
          id,
          !Boolean(
            link.online
          )
        );
      },
      [
        dashboard,
        alterarLink,
      ]
    );

  // =========================================
  // DERRUBAR UM LINK
  // =========================================

  const derrubarLink =
    useCallback(
      async (
        id: number
      ) => {
        await alterarLink(
          id,
          false
        );
      },
      [alterarLink]
    );

  // =========================================
  // RESTAURAR TODOS
  // =========================================

  const restaurarTodos =
    useCallback(async () => {
      try {
        const resposta =
          await fetch(
            `${API_URL}/links/restaurar-todos`,
            {
              method: 'POST',
            }
          );

        if (!resposta.ok) {
          throw new Error(
            `HTTP ${resposta.status}`
          );
        }

        await carregarDashboard();

      } catch (erro) {
        console.error(
          'Erro ao restaurar links:',
          erro
        );
      }
    }, [carregarDashboard]);

  // =========================================
  // CONTINGÊNCIA ALTERNADA
  // =========================================

  const simularLinksAlternados =
    useCallback(async () => {
      try {
        const resposta =
          await fetch(
            `${API_URL}/links/alternados`,
            {
              method: 'POST',
            }
          );

        if (!resposta.ok) {
          throw new Error(
            `HTTP ${resposta.status}`
          );
        }

        await carregarDashboard();

      } catch (erro) {
        console.error(
          'Erro na simulação:',
          erro
        );
      }
    }, [carregarDashboard]);

  // =========================================
  // PRIMEIRO CARREGAMENTO
  // =========================================

  useEffect(() => {
    void carregarDashboard();
  }, [carregarDashboard]);

  // =========================================
  // ATUALIZAÇÃO AUTOMÁTICA DOS DADOS
  // =========================================
  // Não troca de página.
  // Apenas consulta novamente o Back-end.

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          void carregarDashboard();
        },
        5000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [carregarDashboard]);

  return {
    dashboard,

    carregando,

    erroApi,

    carregarDashboard,

    toggleLink,

    derrubarLink,

    restaurarTodos,

    simularLinksAlternados,
  };
}