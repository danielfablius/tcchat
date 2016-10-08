var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var path = require('path')
var clients = []

ips = []
waiting_rooms = []
rooms =
  [

  ]

// Initialize appication with route / (that means root of the application)
app.get('/', function(req, res) {
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  // res.sendFile(path.join(__dirname, '../test', 'index.html'));
  res.sendFile(__dirname + '/index.html')
});
 
// Register events on socket connection
io.on('connection', function(socket){
  console.info('New client connected (id = ' + socket.id + ').')
  clients.push(socket)
  socket.send(socket.id)
  io.sockets.connected[socket.id].emit('connect')
  // setTimeout(function() {console.log("t1")}, 5000);
  // console.log(socket)
  
  var address = socket.handshake.address;
  console.log('New connection from ' + address);
  if(ips.indexOf(address)==-1)
  {
    ips.push(address)
    waiting_rooms.push(socket.id)
    console.log("ip terdaftar :"+ips)
  }
  console.log("waitinglist:"+waiting_rooms)

  if(waiting_rooms.length > 1){

    num = Math.floor((Math.random() * waiting_rooms.length));
    p1 = waiting_rooms[num]
    waiting_rooms.splice(num,1)
    console.log(num,waiting_rooms.length)

    num = Math.floor((Math.random() * waiting_rooms.length));
    p2 = waiting_rooms[num]
    waiting_rooms.splice(num,1)
    console.log(num,waiting_rooms.length)

    d = new Date()
    room_id = "_"+d.getTime()
    rooms[room_id] = {p1:p1,p2:p2}


    if(io.sockets.connected[p1]) { 
      io.sockets.connected[p1].emit('paired',p2) 
    }
    if(io.sockets.connected[p2]) {
      io.sockets.connected[p2].emit('paired',p1)
    }

    io.sockets.connected[p1].emit('chatMessage', 'System', 'You are connected')
    io.sockets.connected[p2].emit('chatMessage', 'System', 'You are connected')

    if(io.sockets.connected[p1])io.sockets.connected[p1].emit('rooms_join',{room_id:room_id})
    if(io.sockets.connected[p2])io.sockets.connected[p2].emit('rooms_join',{room_id:room_id})

  }
      // console.log(rooms)
  // built in
    console.log("waitinglist 2 :"+waiting_rooms)

  socket.on('disconnect', function() {
    console.log("before_dc:" +waiting_rooms)
    ix = waiting_rooms.indexOf(socket.id)
    console.log(ix) 
    address = socket.handshake.address
    // console.log(address)
    
    iadd = ips.indexOf(address)
    if(iadd>=0)ips.splice(iadd,1)
    // console.log(ips) 
    // console.log(iadd) 
    // console.log(waiting_rooms)
    if(ix>=0)waiting_rooms.splice(ix,1)
    // console.log("rooms2" +waiting_rooms)
    for(x in rooms){
      if(rooms[x].p1==socket.id || rooms[x].p2==socket.id){
        // console.log(rooms)
        delete rooms[x]
        // console.log(rooms)
      }
    }
    var index = clients.indexOf(socket)
    if (index != -1) {
      clients.splice(index, 1)
      console.info('Client gone (id=' + socket.id + ').')
    }

  })

  for (i in clients) {
    console.info('i=' + i + ", id=" + clients[i].id)
  }

  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);  // emit ke semua user
  });

  socket.on('sendToUser', function(sessionId, pairedId, from, msg){
    console.info('Send msg=' + msg + " to id=" + clients[0].id)
    io.sockets.connected[sessionId].emit('sendToUser', from, msg)
    io.sockets.connected[pairedId].emit('sendToUser', from, msg)
  })

  // socket.on('notifyUser', function(user){
  //   io.emit('notifyUser', user);
  // });
});
 
// Listen application request on port 3030
http.listen(3030, function(){
  console.log('listening on *:3030');
});