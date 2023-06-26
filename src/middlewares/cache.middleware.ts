import { NextFunction, Request, Response } from "express";
import { getRedisClient } from "../config/redis.config";

export async function uUIDCachingMiddleware(req: Request, res: Response, next: NextFunction) {
    const redisClient = getRedisClient();
    if(!req.body.text) next();
    const cachedData = await redisClient.get(req.body.text);
    if (cachedData) {
        res.status(200).json({message: 'UUID generated successfully', data: { uuid: cachedData }});
    } else {
        next();
    }
}