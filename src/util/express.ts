import { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncRoute = (route: RequestHandler) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    await route(request, response, next);
  } catch (error) {
    next(error);
  }
};

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  switch(error.name) {
    default:
      return response.status(500).send({ error: 'An unhandled error occured' });
  }
};