// client side javascript

var socket = io();

socket.on('connect', function(){
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage:', message);
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('newEmail', function(email) { // email comes from socket.emit
  console.log('New Email', email);
});

socket.on('newUserWelcome', function(message){
  console.log('Message: ', message);
});
socket.on('newUserAnnouncement', function(message){
  console.log('Message: ', message);
});
