import { io } from "socket.io-client";

const socket = io("https://crime-snap-main-764y.onrender.com", {
  transports: ["websocket"],
});

export default socket;