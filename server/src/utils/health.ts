import { Request, Response, NextFunction } from "express";

export const health = (request: Request, response: Response, next: NextFunction) => {
  response.sendStatus(200);
}