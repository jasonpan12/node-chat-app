// Add libraries
const path = require('path');
const http = require('http'); // need to configure http manually
const express = require('express');
const socketIO = require('socket.io');

// Set up constants
const publicPath = path.join(__dirname, '../public'); // build a path that we can pass into express middleware. aviods .. popping up in path
const port = process.env.PORT || 3000;
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

// Set up express app
var app = express();
var server = http.createServer(app); // pass express into http
var io = socketIO(server); // add socket into http
var users = new Users();

app.use(express.static(publicPath));
app.set('title', 'JPans Chat App');
// app.set('view engine', 'html');

// Define routes
app.get('/',(req, res) => {
  res.render('index');
});


io.on('connection', (socket) => { // socket argument similar to socket var over in html
  console.log('new user connected');
  // socket.emit to user who joined from admin
  // text should say "welcome to the chat app"
  // call socket.broadcast.emit to everyone but user who joined
  // text to say new user joined


  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) { // only do this if user exists, also check if message is rl
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback(); // call callback to let client know server ack'd the request
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) { // only do this if user exists, also check if message is rl
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('join', (params, callback) => {
  // make sure they're all real strings
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id); // remove if they were already in a diff room
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.leave('The Office Fans');
  // io.to(params.room).emit
  // socket.broadcast.to(params.room).emit


    socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback(); // call callback w/ no args, meaning no err
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) { // will return a user if removal was successful/actually occurred
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
