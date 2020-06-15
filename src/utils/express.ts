import { NextFunction, Request, RequestHandler, Response } from 'express';

export type BsdacApiRequest<T> = Omit<Request, 'body'> & { body: T };
export type BsdacApiResponse<T> = Omit<Response, 'json'> & { json: (body?: T) => void };

export const asyncRoute = (route: RequestHandler) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    await route(request, response, next);
  } catch (e) {
    next(e);
  }
};

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  switch(error.name) {
    default:
      return response.status(500).send({ error: 'An unhandled error occured' });
  }
};