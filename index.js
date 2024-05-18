var express = require('express');
var socket  = require('socket.io');

var application = express();
var server = application.listen(5000,function(){
	console.log('Your Server Is runing at http:/localhost:5000');
});

application.use(express.static('public_html'));

var sio = socket(server);

sio.on('connection',function(visitor){
	console.log('we have a new visitor as id=>',visitor.id);

	// visitor.on('message', function (data) {
    //     // Here you can filter the chat members and send the message accordingly
    //     data.RealTimeResponse.chatmembers.forEach(member => {
    //         if (data.RealTimeResponse.chat_id == data.chat_id) {
    //             // sio.to(member.socketId).emit('new_msg', data);
	// 			// sio.sockets.emit('new_msg',data);
    //         }
    //     });
    // });

	visitor.on('message',function(data){
			sio.sockets.emit('new_msg',data); 
	});

	visitor.on('deletemessage',function(data){
		sio.sockets.emit('new_deletemessage',data); 
	});

	visitor.on('borad',function(data){
		visitor.broadcast.emit('new_borad',data); 
	});


});
