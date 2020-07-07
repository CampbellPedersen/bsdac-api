import { Request, Response, Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { RapAudioUrlService } from './audio-url-service';
import { Rap, RapRepository } from './repository';
import { BsdacApiResponse, asyncRoute, errorHandler } from '../../utils/express';
import { FileUploadService } from '../../utils/file';
import { isValidString, isValidBoolean, isValidPositiveNumber as isPositiveNumber } from '../../utils/validation';

const rapRequestFailsValidation = (body: any): boolean => {
  let fails = false;

  if (!isValidString(body.title)) fails = true;
  if (body.lyrics && !isValidString(body.lyrics)) fails = true;
  if (!isValidString(body.rapper)) fails = true;
  if (!isValidBoolean(body.bonus)) fails = true;
  if (!isValidString(body.imageUrl)) fails = true;
  if (!body.appearedAt) fails = true;
  if (body.appearedAt) {
    if (!isValidString(body.appearedAt.name)) fails = true;
    if (!isPositiveNumber(body.appearedAt.series)) fails = true;
  }

  return fails;
};

export default (
  repository: RapRepository,
  upload: FileUploadService,
  getAudioUrl: RapAudioUrlService,
  generateId: () => string = uuid,
) => {

  const loadRaps = async (_: Request, response: BsdacApiResponse<Rap[]>) => {
    const raps = await repository.loadAll();
    response.json(raps);
  };

  const saveRap = async (request: Request, response: Response) => {
    const body = JSON.parse(request.body.details) as Omit<Rap, 'id'>;
    if (!request.file) return response.sendStatus(400);
    if (rapRequestFailsValidation(body)) return response.sendStatus(400);

    const id = generateId();
    await upload(id, request.file.mimetype, request.file.buffer);
    await repository.save({
      id,
      lyrics: body.lyrics,
      title: body.title,
      rapper: body.rapper,
      bonus: body.bonus,
      imageUrl: body.imageUrl,
      appearedAt: body.appearedAt,
    });
    response.sendStatus(201);
  };

  const loadStream = async (request: Request, response: Response) => {
    const id = request.params.id;
    const rap = await repository.load(id);

    rap ?
      response.send(await getAudioUrl(rap))
      : response.sendStatus(404);
  };

  return Router()
    .get('/get-all', asyncRoute(loadRaps))
    .post('/save', multer({ storage: multer.memoryStorage() }).single('file'), asyncRoute(saveRap))
    .get('/stream/:id', asyncRoute(loadStream))
    .use(errorHandler);
};