const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isValidString } = require('./utils/validate');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`User of id ${socket.id} is connected`);

  socket.on('disconnect', () => console.log(`User of id ${socket.id} is disconnected`));

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat'));
  socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined'));

  socket.on('join', (params,cb) => {
    if(!isValidString(params.name) || !isValidString(params.room)) {
      cb('invalid information');
    } else {
      cb();
    }
  });

  socket.on('createMessage', (msg, cb) => {P
    console.log(msg);
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    cb('This is from server');
  });

  socket.on('createGeoLocation', ({name, latitude, longitude}) => {
    io.emit('newLocationMessage', generateLocationMessage(name, latitude, longitude));
  });
});



server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
