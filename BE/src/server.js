import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import {
  messageSocketHandler,
  authenticateSocket,
} from "./routes/messageRoutes.js";
import { notificationSocketHandler } from "./middlewares/notificationSocketHandler.js";
import app from "./app.js";

dotenv.config();
console.log("Проверка загрузки .env:");
console.log("PORT:", process.env.PORT);
console.log("SECRET_KEY:", process.env.SECRET_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI);

connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
  transports: ["websocket", "polling"],
});

app.set("io", io);

io.use((socket, next) => {
  authenticateSocket(socket, next);
});

io.on("connection", (socket) => {
  console.log("Новое WebSocket соединение");

  messageSocketHandler(socket, io);

  notificationSocketHandler(socket, io);
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
