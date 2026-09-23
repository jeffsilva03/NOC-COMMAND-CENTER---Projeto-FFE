import dashboardRepository
  from '../repositories/dashboardRepository.js';

const DEPENDENCIAS = {
  Carro: 1,
  SUV: 1,
  Caminhonete: 1,

  Caminhão: 2,

  Van: 3,
  Esportivo: 3,
  Trator: 3,
  Ambulância: 3,

  Ônibus: 4,

  Moto: 5
};

class DashboardController {

  // =====================================
  // GET /api/dashboard
  // =====================================

  async painel(
    req,
    res
  ) {
    try {

      const [
        resumo,
        categorias,
        links,
        incidentes,
        logs
      ] = await Promise.all([
        dashboardRepository
          .obterResumoFrota(),

        dashboardRepository
          .obterCategorias(),

        dashboardRepository
          .obterLinks(),

        dashboardRepository
          .obterIncidentes(20),

        dashboardRepository
          .obterLogs(30)
      ]);


      const linksMap =
        Object.fromEntries(
          links.map(
            (link) => [
              link.id,
              link
            ]
          )
        );


      let totalOnline = 0;


      const categoriasFormatadas =
        categorias.map(
          (categoria) => {

            const linkId =
              DEPENDENCIAS[
                categoria.tipo
              ];

            const link =
              linksMap[linkId];

            const online =
              link
                ? Boolean(
                    link.online
                  )
                : true;

            if (online) {
              totalOnline +=
                categoria.total;
            }

            return {
              tipo:
                categoria.tipo,

              total:
                categoria.total,

              velocidadeMedia:
                categoria
                  .velocidade_media,

              linkId,

              online,

              sinal:
                online && link
                  ? link
                      .trafego_percentual
                  : 0
            };
          }
        );


      const total =
        resumo.total || 0;

      const offline =
        total -
        totalOnline;

      const uptime =
        total > 0
          ? Number(
              (
                (
                  totalOnline /
                  total
                ) *
                100
              ).toFixed(1)
            )
          : 0;

      const linksOnline =
        links.filter(
          (link) =>
            Boolean(
              link.online
            )
        ).length;


      // Persiste a média REAL
      // atual no histórico.

      await dashboardRepository
        .registrarSnapshot(
          resumo
            .velocidade_media ||
            0
        );


      const historico =
        await dashboardRepository
          .obterHistorico(20);


      res.status(200).json({

        sistema: {
          totalVeiculos:
            total,

          veiculosOnline:
            totalOnline,

          veiculosOffline:
            offline,

          alertas:
            offline,

          uptime,

          velocidadeMedia:
            resumo
              .velocidade_media ||
            0,

          linksOnline,

          totalLinks:
            links.length,

          status:
            linksOnline ===
            links.length
              ? 'OPERACIONAL'
              : 'DEGRADADO'
        },

        links,

        categorias:
          categoriasFormatadas,

        historicoVelocidade:
          historico,

        incidentes,

        logs
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500).json({
        erro:
          'Erro ao carregar dashboard.'
      });
    }
  }


  // =====================================
  // PUT /api/dashboard/links/:id
  // =====================================

  async atualizarLink(
    req,
    res
  ) {
    try {

      const id =
        Number(
          req.params.id
        );

      const online =
        Boolean(
          req.body.online
        );

      const link =
        await dashboardRepository
          .buscarLink(id);


      if (!link) {
        return res
          .status(404)
          .json({
            erro:
              'Link não encontrado.'
          });
      }


      await dashboardRepository
        .atualizarLink(
          id,
          online
        );


      const nivel =
        online
          ? 'INFO'
          : 'CRITICAL';


      const mensagem =
        online
          ? `${link.nome} restaurado. Conectividade restabelecida.`
          : `${link.nome} caiu. Comunicação interrompida.`;


      await dashboardRepository
        .registrarIncidente(
          nivel,
          mensagem,
          id
        );


      res.status(200).json({
        mensagem,
        online
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500).json({
        erro:
          'Erro ao alterar link.'
      });
    }
  }


  // =====================================
  // POST restaurar tudo
  // =====================================

  async restaurarTodos(
    req,
    res
  ) {
    try {

      await dashboardRepository
        .restaurarTodosLinks();


      await dashboardRepository
        .registrarIncidente(
          'INFO',
          'RESTAURAÇÃO TOTAL: Todos os links estão operacionais.'
        );


      res.status(200).json({
        mensagem:
          'Todos os links restaurados.'
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500).json({
        erro:
          'Erro ao restaurar links.'
      });
    }
  }


  // =====================================
  // POST alternados
  // =====================================

  async alternados(
    req,
    res
  ) {
    try {

      await dashboardRepository
        .definirLinksAlternados();


      await dashboardRepository
        .registrarIncidente(
          'WARNING',
          'Simulação de contingência: Links 2 e 4 foram derrubados.'
        );


      res.status(200).json({
        mensagem:
          'Links alternados simulados.'
      });

    } catch (error) {

      console.error(
        error
      );

      res.status(500).json({
        erro:
          'Erro na simulação.'
      });
    }
  }
}

export default new DashboardController();