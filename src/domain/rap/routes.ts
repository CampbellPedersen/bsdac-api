import { Request, Response, Router } from 'express';
import { asyncRoute, errorHandler } from '../../util/express';
import { RapRepository } from './repository';
import { StreamUrlBuilder } from './stream-url-builder';

export const rapRouter = (
  repository: RapRepository,
  getStreamUrl: StreamUrlBuilder
) => {

  const loadRaps = async (_: Request, response: Response) => {
    const raps = await repository.loadAll();
    response.send(raps);
  };

  const loadStream = async (request: Request, response: Response) => {
    const id = request.params.id;
    const rap = await repository.load(id);

    rap ?
      response.status(200).send(await getStreamUrl(rap))
      : response.send(404);
  };

  return Router()
    .get('/', asyncRoute(loadRaps))
    .get('/stream/:id', asyncRoute(loadStream))
    .use(errorHandler);
};