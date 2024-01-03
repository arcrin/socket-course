const express = require("express");
const socket = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000);
const io = socket(expressServer);

io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
  // in WS we use "send" method, and in socket.io we use "emit" method
  socket.emit("messageFromServer", { data: "Welcome to the socket server" });
  socket.on("messageFromClient", (message) => {
    console.log(message.data);
  });
});
