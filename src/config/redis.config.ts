import redis, {createClient} from 'redis';

const clients: any = {};

function throwTimeoutError() {
    throw new Error('Redis connection failed');
}

function instanceEventListeners({ conn }: any) {
    conn.on('connect', () => {
        console.log('CacheStore - Connection status: connected');
    });

    conn.on('end', () => {
        console.log('CacheStore - Connection status: disconnected');
        throwTimeoutError();
    });

    conn.on('reconnecting', () => {
        console.log('CacheStore - Connection status: reconnecting');
    });

    conn.on('error', (err: Error) => {
        console.log('CacheStore - Connection status: error ', { err });
        throwTimeoutError();
    });
}
export async function initRedis() {
    console.log('CacheStore - Initializing Redis');
    console.log('CacheStore - Redis URL: ', process.env.REDIS_URL);
    const cacheInstance = createClient({url: process.env.REDIS_URL});
    await cacheInstance.connect();
    clients.cacheInstance = cacheInstance;
    instanceEventListeners({ conn: cacheInstance });
};

export function getRedisClient() {
    return clients.cacheInstance;
}