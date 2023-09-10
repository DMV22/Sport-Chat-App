const users = [];

// Додавання користувача до чату
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Отримання поточного користувача
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// Користувач покидає чат
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Отримання користувачів кімнати
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
