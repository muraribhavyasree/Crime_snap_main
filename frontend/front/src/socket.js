import { io } from "socket.io-client";

const socket = io("https://crime-snap-main-3.onrender.com", {
  transports: ["websocket", "polling"],
});

export default socket;