// Add libraries
const path = require('path');
const http = require('http'); // need to configure http manually
const express = require('express');
const socketIO = require('socket.io');

// Set up constants
const publicPath = path.join(__dirname, '../public'); // build a path that we can pass into express middleware. aviods .. popping up in path
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');

// Set up express app
var app = express();
var server = http.createServer(app); // pass express into http
var io = socketIO(server); // add socket into http

app.use(express.static(publicPath));
app.set('title', 'JPans Chat App');

io.on('connection', (socket) => { // socket argument similar to socket var over in html
  console.log('new user connected');

  socket.emit('newUserWelcome', generateMessage('Admin', 'welcome to the chat app'));

  socket.broadcast.emit('newUserAnnouncement', generateMessage('Admin', 'new user joined'));

  // socket.emit to user who joined from admin
  // text should say "welcome to the chat app"
  // call socket.broadcast.emit to everyone but user who joined
  // text to say new user joined


  socket.on('createMessage', (message) => {
    console.log('createMessage:', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    // io.emit('newMessage', {
    //   from: message.from,
    //   test: message.text,
    //   createdAt: new Date().getTime()
    // });

    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });

  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Define routes
app.get('/',(req, res) => {
  res.render('index');
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
