import { Request, Response, Router } from 'express';
import { asyncRoute } from '../../util/express';
import { RapRepository, Rap } from './repository';
import { json } from 'body-parser';

export const rapRouter = (repository: RapRepository) => {

  const loadAllRaps = async (_: Request, response: Response) => {
    const raps = await repository.loadAll();
    response.send(raps);
  };

  const loadRap = () => async (request: Request, response: Response) => {
    const id = request.params.id;
    const rap = await repository.load(id);

    if (!rap) {
      response.status(404).send();
      return;
    }

    response.status(200).send(rap);
  };

  return Router()
    .use(json())
    .get('/', asyncRoute(loadAllRaps))
    .get('/:id', asyncRoute(loadRap));
};