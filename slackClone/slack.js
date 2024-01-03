const express = require("express");
const socketio = require("socket.io");
const app = express();
const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

//  manufactured way to change an ns
app.get("/change-ns", (req, res) => {
  // update namespace array
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  // let everyone know in THIS namespace, that it changed
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

io.on("connection", (socket) => {
  socket.emit("welcome", "Welcome to the server.");
  socket.on("clientConnect", (data) => {
    console.log(socket.id, "has connected");
  });
  socket.emit("nsList", namespaces);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has connected to ${namespace.endpoint}`);
  });
});
