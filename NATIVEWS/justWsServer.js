// http is a core node module
const http = require("http");
// ws is a third-party library: npm install ws
const webSocket = require("ws");

const server = http.createServer((req, res) => {
  res.end("I am connected");
});

const wss = new webSocket.WebSocketServer({ server });

wss.on("headers", (headers, req) => {
  console.log(headers);
});

wss.on("connection", (ws, req) => {
  ws.send("Welcome to the websocket server!!!");
  ws.on("message", (msg) => {
    console.log(msg.toString());
  });
});

server.listen(8000);
