import { Request, Response, Router } from 'express';
import { asyncRoute, errorHandler } from '../../util/express';
import { RapRepository } from './repository';

export const rapRouter = (repository: RapRepository) => {

  const loadRaps = async (_: Request, response: Response) => {
    const raps = await repository.loadAll();
    response.send(raps);
  };

  return Router()
    .get('/', asyncRoute(loadRaps))
    .use(errorHandler);
};