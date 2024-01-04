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

// This is the connection event for the main namespace '/'
io.on("connection", (socket) => {
  socket.emit("welcome", "Welcome to the server.");
  socket.on("clientConnect", (data) => {
    console.log(socket.id, "has connected");
  });
  // provide all other namespaces to this client.
  socket.emit("nsList", namespaces);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} has connected to ${namespace.endpoint}`);
    socket.on("joinRoom", async (roomObj, ackCallBack) => {
      // need to fetch the history
      const thisNs = namespaces[roomObj.namespaceId];
      const thisRoomObj = thisNs.rooms.find((room) => room.roomTitle === roomObj.roomTitle);
      const thisRoomHistory = thisRoomObj.history;
      // leave all rooms, because the client can only be in one room
      const rooms = socket.rooms;
      let i = 0;
      rooms.forEach((room) => {
        if (i != 0) {
          socket.leave(room);
        }
        i++;
      });
      // join the room
      // NOTE - roomTitle is coming from the client. Which is NOT safe.
      // Auth to make sure the socket has the right access to the room

      socket.join(roomObj.roomTitle);
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      const socketCount = sockets.length;

      ackCallBack({
        numUsers: socketCount,
        thisRoomHistory,
      });
    });

    socket.on("newMessageToRoom", (messageObj) => {
      console.log(messageObj);
      // broadcast this to all the connected clients in this room
      // index 1 is the room the socket joined most recently
      const currentRoom = [...socket.rooms][1];

      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit("messageToRoom", messageObj);
      // add this message to this room's history
      const thisNs = namespaces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      console.log(thisRoom);
      thisRoom.addMessage(messageObj);
    });
  });
});
