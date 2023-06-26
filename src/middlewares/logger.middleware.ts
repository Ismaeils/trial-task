import { NextFunction, Request, Response } from "express"

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(`[LoggingMiddleware] new request ${req.method}/ ${req.path} withBody ${JSON.stringify(req.body)} withParams ${JSON.stringify(req.params)}`);
    next();
}