import { createServer } from "node:http";
import { createClient } from "redis";
import { WebSocket, WebSocketServer } from "ws";

const port = Number(process.env.REALTIME_PORT ?? 3001);
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const channel = "rahro:events";

const subscriber = createClient({ url: redisUrl });
const server = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(subscriber.isReady ? 200 : 503, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: subscriber.isReady ? "ok" : "unavailable" }));

    return;
  }
  response.writeHead(404).end();
});

const sockets = new WebSocketServer({ server, path: "/realtime" });
subscriber.on("error", (error) => console.error("Redis subscriber error", error.message));

sockets.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "connection.ready", occurredAt: new Date().toISOString() }));
});

await subscriber.connect();
await subscriber.subscribe(channel, (message) => {
  for (const socket of sockets.clients)
    if (socket.readyState === WebSocket.OPEN) socket.send(message);
});

server.listen(port, () => console.log(`Rahro realtime gateway listening on :${port}/realtime`));

async function shutdown() {
  sockets.close();
  server.close();
  if (subscriber.isOpen) await subscriber.quit();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
