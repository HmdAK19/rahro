import "server-only";

import { createClient, type RedisClientType } from "redis";

import type { RealtimeEvent, RealtimeEventPublisher } from "./realtime-event";

const channel = "rahro:events";
const globalRedis = globalThis as typeof globalThis & {
  __rahroRedisPublisher?: Promise<RedisClientType | null>;
};

async function connectPublisher(): Promise<RedisClientType | null> {
  if (!process.env.REDIS_URL) return null;

  const client = createClient({
    url: process.env.REDIS_URL,
    socket: { connectTimeout: 1_500, reconnectStrategy: false },
  });
  client.on("error", (error) => console.error("Redis publisher error", error.message));
  try {
    await client.connect();

    return client as RedisClientType;
  } catch {
    client.destroy();

    return null;
  }
}

export class RedisEventPublisher implements RealtimeEventPublisher {
  async publish(event: RealtimeEvent): Promise<void> {
    globalRedis.__rahroRedisPublisher ??= connectPublisher();
    const client = await globalRedis.__rahroRedisPublisher;

    if (!client) return;
    try {
      await client.publish(channel, JSON.stringify(event));
    } catch {
      globalRedis.__rahroRedisPublisher = undefined;
    }
  }
}
