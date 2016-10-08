
var socket = io()
var sessionId

function submitfunction(){
  var from = $('#user').val()
  var message = $('#m').val()
  if(message != '') {
  // socket.emit('chatMessage', from, message);
  socket.emit('sendToUser', sessionId, from, message)
}

$('#m').val('').focus();
  return false;
}

// function notifyTyping() { 
//   var user = $('#user').val();
//   socket.emit('notifyUser', user);
// }

socket.on('rooms_join',function(message){
  console.log(socket.io.engine.id, message)
})

socket.on('connect',function(message){
  console.log(socket.io.engine.id)
})

socket.on('message', function(message){
  sessionId = message
})

socket.on('sendToUser', function(from, msg) {
  var me = $('#user').val()
  var color = (from == me) ? 'white' : '#fdff63';
  var from = (from == me) ? 'Me' : from
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>')
})

socket.on('chatMessage', function(from, msg){
  var me = $('#user').val()
  var color = (from == me) ? 'white' : '#fdff63'
  var from = (from == me) ? 'Me' : from
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>')
});

// socket.on('notifyUser', function(user){
//   var me = $('#user').val();
//   if(user != me) {
//     $('#notifyUser').text(user + ' is typing ...');
//   }
//   setTimeout(function(){ $('#notifyUser').text(''); }, 10000);;
// });
$(document).ready(function(){
  // push socket ke cache
  var name = makeid()
  $('#user').val(name)
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion')
});

function makeid() {
  // ganti jadi input user menggunakan sweetalert biar so sweet :3
  // http://t4t5.github.io/sweetalert/
  // minta masukkan username
  var text = prompt("input usename");
  return text;
}
