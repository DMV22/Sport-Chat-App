const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const leaveBtn = document.getElementById("leave-btn");

// Функція для відображення повідомлення на сторінці
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);

  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  chatMessages.appendChild(div);
}

// Функція для відображення назви кімнати на сторінці
function outputRoomName(room) {
  roomName.innerText = room;
}

// Функція для відображення користувачів на сторінці
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// Визначення подій для відправки повідомлень та виходу з чату
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msgInput = e.target.elements.msg;
  let msg = msgInput.value.trim();

  if (!msg) {
    return false;
  }

  // Еміт повідомлення на сервер
  socket.emit("chatMessage", msg);

  msgInput.value = "";
  msgInput.focus();
});

leaveBtn.addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  }
});

// Отримання користувача та кімнати з URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Підключення до серверу за допомогою WebSocket
const socket = io();

// Приєднання до кімнати чату
socket.emit("joinRoom", { username, room });

// Отримання інформації про кімнату та користувачів
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Отримання повідомлень від сервера
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
