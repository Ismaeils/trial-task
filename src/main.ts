import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { getRedisClient, initRedis } from './config/redis.config';
import { uUIDCachingMiddleware } from './middlewares/cache.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;

// Init Redis & register middlewares
(async () => {
  await initRedis();
})();

app.use(express.json());

app.use(loggerMiddleware);

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({message: 'Ping Back!'});
});

app.post('/generate-uuid', uUIDCachingMiddleware, (req: Request, res: Response) => {
  if(!req.body.text) return res.status(400).json({message: "Property text cannot be empty"});
  console.log(req.body.text);
  // UUID generation logic
  const uuid = crypto.randomUUID();
  const redisClient = getRedisClient();
  redisClient.set(req.body.text, uuid);
  res.status(200).json({message: 'UUID generated successfully', data: { uuid }});
});

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({message: 'You are definitely lost, this endpoint doesnt exist mister'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is super running at http://localhost:${port}`);
});
