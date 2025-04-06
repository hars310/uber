
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ['websocket'],
  auth: { token: localStorage.getItem("token") },
  autoConnect:"false" // optional, for stability
});

export default socket;