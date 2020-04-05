import { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncRoute = (route: RequestHandler) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    await route(request, response, next);
  } catch (error) {
    next(error);
  }
};