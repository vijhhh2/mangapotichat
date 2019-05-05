const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`User of id ${socket.id} is connected`);

  socket.on('disconnect', () => console.log(`User of id ${socket.id} is disconnected`));

  socket.on('createMessage', (msg) => {
    console.log(msg);
    io.emit('newMessage', {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
  })
});



server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
