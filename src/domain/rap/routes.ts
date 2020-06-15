import { Request, Response, Router } from 'express';
import { v4 as uuid } from 'uuid';
import { asyncRoute, errorHandler } from '../../utils/express';
import { RapRepository } from './repository';
import { RapAudioUrlService } from './audio-url-service';
import { json } from 'body-parser';

export default (
  repository: RapRepository,
  getAudioUrl: RapAudioUrlService,
  generateId: () => string = uuid,
) => {

  const loadRaps = async (_: Request, response: Response) => {
    const raps = await repository.loadAll();
    response.send(raps);
  };

  const saveRap = async (request: Request, response: Response) => {
    const rap = request.body;
    await repository.save({
      id: rap.id || generateId(),
      title: rap.title,
      rapper: rap.rapper,
      bonus: rap.bonus,
      imageUrl: rap.imageUrl,
      appearedAt: rap.appearedAt,
    });
    response.send(201);
  };

  const loadStream = async (request: Request, response: Response) => {
    const id = request.params.id;
    const rap = await repository.load(id);

    rap ?
      response.send(await getAudioUrl(rap))
      : response.send(404);
  };

  return Router()
    .use(json())
    .get('/get-all', asyncRoute(loadRaps))
    .post('/save', asyncRoute(saveRap))
    .get('/stream/:id', asyncRoute(loadStream))
    .use(errorHandler);
};