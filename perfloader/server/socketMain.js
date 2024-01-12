const socketMain = (io) => {
  let machineMacA;
  io.on("connection", (socket) => {
    const auth = socket.handshake.auth;
    console.log(auth.token);
    if (auth.token === "asklfjdhuijnvzcxvkjwaueiorouiojkl") {
      // valid nodeClient
      socket.join("nodeClient");
    } else if (auth.token === "iouiobnsdafwerwqerqwerqwer") {
      // valid reactClient
      socket.join("reactClient");
    } else {
      socket.disconnect();
      console.log("You have been disconnected");
    }
    console.log(`New connection on ${process.pid}`);
    io.emit("welcome", `Welcome to worker ${process.pid}`);
    socket.on("perfData", (data) => {
      console.log("Tick...");
      if (!machineMacA) {
        machineMacA = data.macA;
        io.to("reactClient").emit("connectedOrNot", {
          isAlive: true,
          machineMacA,
        });
      }
      io.to("reactClient").emit("perfData", data);
      // console.log(data);
    });
    socket.on("disconnect", (reason) => {
      // a nodeClient just disconnected, let the front end know
      io.to("reactClient").emit("connectedOrNot", {
        isAlive: false,
        machineMacA,
      });
    });
  });
};

module.exports = socketMain;
