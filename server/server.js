const path = require("path");
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isValidString } = require("./utils/validate");
const { Users } = require("./utils/users");

let users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log(`User of id ${socket.id} is connected`);
  socket.on("join", (params, cb) => {
    if (!isValidString(params.name) || !isValidString(params.room)) {
      cb("invalid information");
    } else {
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit(
        "updateUsersList",
        users.getUsersList(params.room)
      );
      socket.emit("newMessage", generateMessage("Admin", "Welcome to chat"));
      socket.broadcast
        .to(params.room)
        .emit("newMessage", generateMessage("Admin", `${params.name} joined`));
      cb();
    }
  });

  socket.on("createMessage", (msg, cb) => {
  let user = users.getUser(socket.id)[0];
    if(user) {
      io.to(user.room).emit("newMessage", generateMessage(msg.from, msg.text));
      cb("This is from server");
    }
  });

  socket.on("createGeoLocation", ({ name, latitude, longitude }) => {
    let user = users.getUser(socket.id)[0];
    if(user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(name, latitude, longitude)
      );
    }
  });

  socket.on("disconnect", () => {
    console.log('disconnected');
    const user = users.removeUser(socket.id)[0];
    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUsersList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} left the room`)
        );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
