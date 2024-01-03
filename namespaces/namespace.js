const express = require("express");
const app = express();
// require('socket.io') = Server in the docs
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8001);
// io = the server object in the docs
const io = socketio(expressServer);

io.of("/").on("connection", (socket) => {
  socket.join("chat");
  io.of("/").to("chat").emit("welcomeToChatRoom", {});
  io.of("/")
    .to("chat")
    .to("chat2")
    .to("adminChat")
    .emit("welcomeToChatRoom", {});
  console.log(socket.id, "has connected");
  socket.on("newMessageToServer", (dataFromClient) => {
    console.log("Data:", dataFromClient);
    io.of("/").emit("newMessageToClients", { text: dataFromClient.text });
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log(socket.id, "has joined /admin");
  socket.join("chat");
  io.of("/admin").emit("welcome", "Welcome to the admin channel!");
  io.of("/admin").to("chat").emit("welcomeToChatRoom", {});
});
