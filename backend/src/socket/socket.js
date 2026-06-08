const { Server } = require("socket.io");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://crimesnap24.netlify.app",
        "https://crimesnap245.netlify.app"
      ],
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;