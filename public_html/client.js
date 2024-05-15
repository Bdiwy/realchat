var socket = io.connect('http://localhost:5000');

var chat_id              = document.querySelector('#chat_id');
var body                 = document.querySelector('.message-input');
var send 	             = document.getElementById('sendMessageBtn');
var chat 	             = document.querySelector('.chat-messages-list');
var boradcast 	         = document.getElementById('boradcast');
const chatHistory        = document.getElementsByClassName('chatidforrealtime');
const deleteMessageLink  = document.getElementById('deleteMessageLink');

send.addEventListener('click', function () {

    socket.emit('message', {
        RealTimeResponse:RealTimeResponse,
        messagememberid:RealTimeResponse.memberid,
        currentUserId: currentUserId,
        chat_id: chat_id.value,
        body: body.value,
    });

    setTimeout(() => {
        socket.emit('messagedata', {
            newmessage: "newmessage"
        });
        const deleteMessageLink = document.getElementById('deleteMessageLink');
        if (deleteMessageLink) {
            deleteMessageLink.setAttribute('onclick', `deleteMessage('${newmessage.id}')`);
        } else {
            console.error("Element with ID 'deleteMessageLink' not found.");
        } +console.log(newmessage.id);
    }, 3000); 
    
});

function formatDate(date) {
    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day = daysOfWeek[date.getDay()];
    var hour = date.getHours() % 12 || 12;
    var period = date.getHours() >= 12 ? 'PM' : 'AM';
    var minutes = ('0' + date.getMinutes()).slice(-2);
    return day + ' ' + hour + ':' + minutes + ' ' + period;
}

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
    console.log(chatHistory.id);
    var currentDateTime = new Date(); 
    var formattedDateTime = formatDate(currentDateTime);
    var chatMessagesList = document.querySelector('.chat-messages-list');

    if (data.RealTimeResponse.chatId == data.chat_id && data.RealTimeResponse.chatId == chatHistory.id) {
    var isthismyMessage = data.messagememberid == RealTimeResponse.memberid ;
    var imagePath = data.RealTimeResponse.userdata;
    var senderName;
    if (data.RealTimeResponse.userType == '1') {
        senderName = `<a href="teachers/${data.RealTimeResponse.userdata.id}">${data.RealTimeResponse.userdata.first_name+' '+data.RealTimeResponse.userdata.last_name}</a>`;
    } else if (data.RealTimeResponse.userType == '2') {
        senderName = `<a href="families/${data.RealTimeResponse.userdata.id}">${data.RealTimeResponse.userdata.first_name+' '+data.RealTimeResponse.userdata.last_name}</a>`;
    } else {
        senderName = data.RealTimeResponse.userdata.name;
    }
    var imageSrc = data.RealTimeResponse.userdata.image;
    var dropdown= `<div class="dropdown">
                                <button class="btn p-0" type="button" id="chat-header-actions"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="bx bx-dots-vertical-rounded fs-4"></i>
                                    </button>
                                <div class="dropdown-menu dropdown-menu-start" aria-labelledby="chat-header-actions">
                                    <a href="javascript:void(0)" id="deleteMessageLink" style="color:red; text-align:center;" data-bs-toggle="modal" data-bs-target="#deletemessage" onclick="deleteMessage(${data.body})"> <i class="bx bx-trash-alt"></i>Delete </a>
                                </div>
                            </div>`;
                            chat.innerHTML += `
                            <li class="chat-message ${isthismyMessage ? 'chat-message-right' : 'chat-message-left' } ">
                                <div class="d-flex overflow-hidden">
                                    ${!isthismyMessage ? `
                                        <div class="user-avatar flex-shrink-0 ms-3">
                                            <div class="avatar avatar-sm" style="margin-top: 1px;">
                                                <a href="" target="_blank">
                                                    <img src="${imageSrc}" alt="user photo" class="rounded-circle" style="margin-left:10px;" />
                                                </a>
                                            </div>
                                        </div>` : ''}
                                    ${isthismyMessage ? dropdown :''}
                                    <div class="chat-message-wrapper flex-grow-1">
                                        <div class="chat-message-text" style="${isthismyMessage ? 'margin-right:20px' : 'margin-left:20px'} ;" >
                                            <div class="chat-sender-name text-muted mb-1" style="cursor: pointer;">${!isthismyMessage ? senderName : ''}</div>
                                            <p class="mb-0  ${isthismyMessage ? 'right' : 'left'}">
                                                ${data.body}
                                            </p>
                                        </div>
                                        <div class="text-end text-muted mt-1" style="${isthismyMessage ? 'margin-right:20px' : 'margin-left:20px'} ;">
                                    ${isthismyMessage ? ' <i class="bx bx-check-double text-success"></i>' : ''}
                                    <small>${formattedDateTime}</small>
                                </div>
                                    </div>									
                                </div> 
                            </li>
                        `;
                        
                
    }
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
    };


   
    
    
    



socket.on('new_borad',function(data){
 boradcast.innerHTML = '<strong>'+data.username+': </strong> write message <img src="/write.gif" style="width:25px;height:20px" />';
});