const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessage = require("./utils/formatMessage");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Встановлення папки для статичних файлів
app.use(express.static(path.join(__dirname, "public")));

const bot = "SportsRooms Bot";

// Виконується при підключенні клієнта
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Привітання поточного користувача
    socket.emit("message", formatMessage(bot, "Welcome to SportsRooms!"));

    // Розсилка повідомлення про підключення користувача
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(bot, `${user.username} has joined the chat`)
      );

    // Відправлення інформації про користувачів та кімнату
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Прослуховування події chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Виконується при відключенні клієнта
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(bot, `${user.username} has left the chat`)
      );

      // Відправлення інформації про користувачів та кімнату
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(3000, () =>
  console.log(`Server running at http://localhost:3000`)
);
