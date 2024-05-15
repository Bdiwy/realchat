var socket = io.connect('http://localhost:5000');

var chat_id  = document.querySelector('#chat_id');
var body   = document.querySelector('.message-input');
var send 	  = document.getElementById('sendMessageBtn');
var chat 	  = document.querySelector('.chat-messages-list');
var boradcast 	  = document.getElementById('boradcast');

send.addEventListener('click', function () {

    socket.emit('message', {
        RealTimeResponse:RealTimeResponse,
        messagememberid:RealTimeResponse.memberid,
        currentUserId: currentUserId,
        chat_id: chat_id.value,
        body: body.value,
        imagePath :imagePath  ,
        imageFilename :imageFilename  ,
        message :message ,
    });

});


// message.addEventListener('keypress',function(){
// 	socket.emit('borad',{
// 		chat_id:chat_id.value
// 	});
// });
 
socket.on('new_msg',function(data){
//  boradcast.innerHTML = '';
    handleNewMessage(data) ;
});


function handleNewMessage(data) {
    console.log(data);
    console.log(data.chat_id);
    console.log(data.RealTimeResponse.chatId);
    if (data.RealTimeResponse.chatId == data.chat_id && data.RealTimeResponse.chatmembers.memberid == data.messagememberid) {
    var isthismyMessage = data.messagememberid == RealTimeResponse.memberid ;
    var dropdown= `<div class="dropdown">
                                <button class="btn p-0" type="button" id="chat-header-actions"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="bx bx-dots-vertical-rounded fs-4"></i>
                                    </button>
                                <div class="dropdown-menu dropdown-menu-start" aria-labelledby="chat-header-actions">
                                    <a href="javascript:void(0)"  style="color:red; text-align:center;" data-bs-toggle="modal" data-bs-target="#deletemessage" onclick="deleteMessage(${data.message})"> <i class="bx bx-trash-alt"></i>Delete </a>
                            </div>
                            </div>`;
                    chat.innerHTML += `
                    <li class="chat-message ${isthismyMessage ? 'chat-message-right' : 'chat-message-left' } ">
                                    <div class="d-flex overflow-hidden">
                                    
                                ${isthismyMessage ? dropdown :''}
                                    <div class="chat-message-wrapper flex-grow-1">
                                        <div class="chat-message-text" style="${isthismyMessage ? 'margin-right:20px' : 'margin-left:20px'} ;" >
                                        <div class="chat-sender-name text-muted mb-1" style="cursor: pointer;">${!isthismyMessage ? 'data.message.name' : ''}</div>
                                            <div class="file-details" style="padding:10px; padding-left:3px; ">
                                            <b><p class="file-info-line">
                                                <span class="file-name" ${isthismyMessage ? 'style="color:white"' : 'style="color: black ; postion:center;"'}>${data.body}</span>
                                            </p></b>
                                        </div>
                                        </div>									
                                </div>
                                </div>
                                </div>`;
                            }};



socket.on('new_borad',function(data){
 boradcast.innerHTML = '<strong>'+data.username+': </strong> write message <img src="/write.gif" style="width:25px;height:20px" />';
});