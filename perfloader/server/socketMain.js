const socketMain = (io) => {
  io.on("connection", (socket) => {
    console.log(`New connection on ${process.pid}`);
    io.emit("welcome", `Welcome to worker ${process.pid}`);
  });
};

module.exports = socketMain;
