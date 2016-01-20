var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = {};

var getUserBySocketId = function(id) {
    return users[id];
}

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        console.log('message: ', msg);
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('user joined', function(user) {
        users[socket.id] = user;
        io.emit('user joined', {
            joined: user,
            users: users
        });
    })
    socket.on('disconnect', function() {
        var left = getUserBySocketId(socket.id);
        delete users[socket.id];
        io.emit('user disconnected', {
            left: left,
            users: users
        })

    })
})

http.listen(3000, function() {
    console.log('listening on *:3000');
});
