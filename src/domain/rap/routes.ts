import { Request, Response, Router } from 'express';
import { json } from 'body-parser';
import { v4 as uuid } from 'uuid';
import { BsdacApiRequest, BsdacApiResponse, asyncRoute, errorHandler } from '../../utils/express';
import { isValidString, isValidBoolean } from '../../utils/validation';
import { Rap, RapRepository } from './repository';
import { RapAudioUrlService } from './audio-url-service';

const rapRequestFailsValidation = (body: any): boolean => {
  let fails = false;

  if (!isValidString(body.title)) fails = true;
  if (!isValidString(body.rapper)) fails = true;
  if (!isValidBoolean(body.bonus)) fails = true;
  if (!isValidString(body.imageUrl)) fails = true;
  if (!body.appearedAt) fails = true;

  return fails;
};

export default (
  repository: RapRepository,
  getAudioUrl: RapAudioUrlService,
  generateId: () => string = uuid,
) => {

  const loadRaps = async (_: Request, response: BsdacApiResponse<Rap[]>) => {
    const raps = await repository.loadAll();
    response.json(raps);
  };

  const saveRap = async (request: BsdacApiRequest<Omit<Rap, 'id'>>, response: Response) => {
    const body = request.body;
    if (rapRequestFailsValidation(request.body)) response.send(400);
    await repository.save({
      id: generateId(),
      title: body.title,
      rapper: body.rapper,
      bonus: body.bonus,
      imageUrl: body.imageUrl,
      appearedAt: body.appearedAt,
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