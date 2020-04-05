import { Request, Response, Router } from 'express';
import { asyncRoute, errorHandler } from '../../util/express';
import { RapRepository } from './repository';

export const rapRouter = (repository: RapRepository) => {

  const loadRap = () => async (request: Request, response: Response) => {
    const rap = await repository.load(request.params.id);

    if (!rap) {
      response.status(404).send();
      return;
    }

    response.status(200).send(rap);
  };

  const loadRaps = async (_: Request, response: Response) => {
    const raps = await repository.loadAll();
    response.send(raps);
  };

  return Router()
    .get('/', asyncRoute(loadRaps))
    .get('/:id', asyncRoute(loadRap))
    .use(errorHandler);
};