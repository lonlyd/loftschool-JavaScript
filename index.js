// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;
var contactlist = [];

io.on('connection', (socket) => {
  var addedUser = false;
  var id = socket.id;
  console.log('25 ' + contactlist);
  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username, userlogin) => {
    if (addedUser) return;
    contactlist.push(userlogin);
    
    // we store the username in the socket session for this client
    socket.username = username;
    socket.userlogin = userlogin;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      username: socket.username,
      numUsers: numUsers,
      userlogin: socket.userlogin,
      id: id,
    });
    // console.log(socket.userlogin + ' login');

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      userlogin: socket.userlogin,
      numUsers: numUsers
    });

    var clients = io.sockets.clients();
    
    // console.log(socket.userlogin + ' join');
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    console.log('57 ' + contactlist);
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
      userlogin: socket.userlogin
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      contactlist.splice(contactlist.indexOf(socket.userlogin));
      console.log('84 ' + contactlist);

      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

});