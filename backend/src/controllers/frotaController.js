import frotaRepository from '../repositories/frotaRepository.js';

class FrotaController {

  // GET /api/frota
  async listar(req, res) {
    try {
      const veiculos = await frotaRepository.listarTodos(500);

      res.status(200).json(veiculos);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        erro: 'Erro interno no servidor.'
      });
    }
  }


  // GET /api/frota/:id
  async buscarDetalhes(req, res) {
    try {
      const veiculo = await frotaRepository.buscarPorId(
        req.params.id
      );

      if (!veiculo) {
        return res.status(404).json({
          mensagem: 'Veículo não encontrado.'
        });
      }

      res.status(200).json(veiculo);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        erro: 'Falha na busca.'
      });
    }
  }


  // POST /api/frota
  async registrar(req, res) {
    try {

      if (!req.body.id || !req.body.tipo) {
        return res.status(400).json({
          erro: 'ID e Tipo são obrigatórios.'
        });
      }

      const novoVeiculo =
        await frotaRepository.criar(req.body);

      res.status(201).json(novoVeiculo);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        erro: 'Erro ao inserir. ID duplicado?'
      });
    }
  }


  // PUT /api/frota/:id
  async atualizarTelemetria(req, res) {
    try {

      const linhasAfetadas =
        await frotaRepository.atualizar(
          req.params.id,
          req.body
        );

      if (linhasAfetadas === 0) {
        return res.status(404).json({
          mensagem: 'Veículo inexistente.'
        });
      }

      res.status(200).json({
        mensagem: 'Telemetria atualizada.'
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        erro: 'Erro no Update SQL.'
      });
    }
  }


  // DELETE /api/frota/:id
  async remover(req, res) {
    try {

      const linhasAfetadas =
        await frotaRepository.deletar(
          req.params.id
        );

      if (linhasAfetadas === 0) {
        return res.status(404).json({
          mensagem: 'Veículo inexistente.'
        });
      }

      res.status(204).send();

    } catch (error) {
      console.error(error);

      res.status(500).json({
        erro: 'Falha ao deletar.'
      });
    }
  }
}

export default new FrotaController();