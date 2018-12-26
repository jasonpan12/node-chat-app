// client side javascript

var socket = io();

function scrollToBottom() { // will be called for every message
  // selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child'); // get just the last item

  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight) {
    messages.scrollTop(scrollHeight); // setting scrolltop to scrollheight pushes clientheight down to zero, i.e. putting user to bottom
  }
}
socket.on('connect', function(){
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) { // show error if it exists, and redirect back to join page
      alert(err);
      window.location.href = '/';
    } else {
      console.log('no error');
    }
  });
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
  scrollToBottom();
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
  scrollToBottom();

})
socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  console.log('Users.list', users);

  // create a new list each time this is called
  var oL = jQuery('<ol></ol>');
  users.forEach(function (user) { // loop over entire user population in user class each time
    oL.append(jQuery('<li></li>').text(user));
  });
  // display the ordered list in the users div
  jQuery('#users').html(oL);
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
