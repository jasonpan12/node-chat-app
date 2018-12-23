// client side javascript

var socket = io();

socket.on('connect', function(){
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage:', message);

  // create list item to receive new messages
  // create elementt with jquery
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  // select messages object and append new message to end of list
  jQuery('#messages').append(li);
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('newEmail', function(email) { // email comes from socket.emit
  console.log('New Email', email);
});

socket.emit('createMessage', {
  from:'frank',
  text:'hi'
}, function (data) {
  console.log('got it', data);// add acknowledgement
});

// use jquery to attach a listener to an... object
jQuery('#message-form').on('submit', function (e) { // do something with the event
  e.preventDefault(); // prevent page refresh process

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val() // select any attribute with message as its name
// no semicolon because its in object
  }, function() {

  })
});
