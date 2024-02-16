import {Request, Response, Router} from 'express';
import { getRedisClient } from '../config/redis.config';
import LeaderboardEntryDatastore from '../datastores/leaderboard.datastore';
import { LeaderboardEntry } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { io } from "../main";
import { leaderboardCachingMiddleware } from '../middlewares/cache.middleware';

const LeaderboardRouter: Router = Router();

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const redisClient = getRedisClient();
    const leaderboardDatastore = new LeaderboardEntryDatastore();
    const leaderboardEntries: LeaderboardEntry[]  =  await leaderboardDatastore.getAll();

    // update redis cache
    redisClient.set('leaderboard', JSON.stringify(leaderboardEntries), {EX: 300});
    return leaderboardEntries;
}


LeaderboardRouter.get('/', leaderboardCachingMiddleware, async (req: Request, res: Response)=> {
    res.status(200).json({ data: await getLeaderboard()});
});

LeaderboardRouter.post('/player',  async (req: Request, res: Response)=> {
    const redisClient = getRedisClient();
    const leaderboardDatastore = new LeaderboardEntryDatastore();

    const newLeaderboardEntry = await leaderboardDatastore.create({
        username: faker.internet.userName(),
        score: 0,
        rank: -1
    });

    const dbEntries = await leaderboardDatastore.getAll();

    // update redis cache
    redisClient.set('leaderboard', JSON.stringify(dbEntries), {EX: 300});

    io.emit('leaderboard', dbEntries);

    res.status(200).json({message: 'Username generated successfully', data: { username: newLeaderboardEntry.username}});

});

export default LeaderboardRouter;