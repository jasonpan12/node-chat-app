// client side javascript

var socket = io();

socket.on('connect', function(){
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  // console.log('newMessage:', message);

  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, { // pass value into template used by mustache
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, { // pass value into template used by mustache
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  jQuery('#messages').append(html);

})
socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('newEmail', function(email) { // email comes from socket.emit
  console.log('New Email', email);
});

// socket.emit('createMessage', {
//   from:'frank',
//   text:'hi'
// }, function (data) {
//   console.log('got it', data);// add acknowledgement
// });

// use jquery to attach a listener to an... object
jQuery('#message-form').on('submit', function (e) { // do something with the event
  e.preventDefault(); // prevent page refresh process

  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val() // select any attribute with message as its name
// no semicolon because its in object
  }, function() {
    // clear values after done
    messageTextBox.val('');
  })
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) { // if geolocation object doesn't exist
    return alert('Geolocation not supported by your browser');
  }

  // disable button while in progress
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled');
    alert('Unable to fetch location');
  });
});
