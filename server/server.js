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


io.on('connection', (socket) => { // socket argument similar to socket var over in html
  console.log('new user connected');
  // socket.emit to user who joined from admin
  // text should say "welcome to the chat app"
  // call socket.broadcast.emit to everyone but user who joined
  // text to say new user joined


  socket.on('createMessage', (message, callback) => {
    console.log('createMessage:', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server'); // call callback to let client know server ack'd the request
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

  socket.on('createLocationMessage', (coords) => {

    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) { // will return a user if removal was successful/actually occurred
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

// Define routes
app.get('/',(req, res) => {
  res.render('index');
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
