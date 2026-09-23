import dashboardRepository
  from '../repositories/dashboardRepository.js';

export function apiLogger(
  req,
  res,
  next
) {

  const inicio =
    process.hrtime.bigint();


  res.on(
    'finish',
    () => {

      const fim =
        process
          .hrtime
          .bigint();


      const duracaoNs =
        fim -
        inicio;


      const duracaoMs =
        Math.round(
          Number(
            duracaoNs
          ) /
          1_000_000
        );


      dashboardRepository
        .registrarLog(
          req.method,
          req.originalUrl,
          res.statusCode,
          duracaoMs
        )
        .catch(
          (error) => {
            console.error(
              'Erro ao registrar log:',
              error
            );
          }
        );
    }
  );


  next();
}