var socket = io.connect('http://localhost:5000');

var chat_id              = document.querySelector('#chat_id');
var body                 = document.querySelector('.message-input');
var chat 	             = document.querySelector('.chat-messages-list');
var boradcast 	         = document.getElementById('boradcast');
const chatHistory        = document.getElementsByClassName('chatidforrealtime');
const deleteMessageLink  = document.getElementById('deleteMessageLink');
var messageSound         = document.getElementById('messageSound');
var message_id           = document.getElementById('message_id') ;
var path                 = document.getElementById('attach-doc');
var filedata             = document.getElementById('filedata');
// Select both buttons
var sendButtons = [
    document.getElementById('sendMessageBtn'),
    document.getElementById('sendFileBtn')
];

  // Function to handle the click event
function handleClick() {
    const newMessage = {
        path : path.value ,
        type : path.value ? 'file' : '' ,
        id: 'msg_' + Date.now(), // Generating a unique ID for each message
        RealTimeResponse: RealTimeResponse,
        messagememberid: RealTimeResponse.memberid,
        currentUserId: currentUserId,
        chat_id: chat_id.value,
        body: body.value,
    };
    socket.emit('message', newMessage);
            setTimeout(() => {
                socket.emit('new_deleteMessage', {
                    newmessage: newMessage,
                });            
                const deleteMessageLink = document.getElementById(newMessage.body);
                const messageElements = document.querySelectorAll('#messageid');

                messageElements.forEach((messageElement) => {
                    messageElement.id = newMessage.id;
                });
            
                const message_id = document.querySelector('#message_id');
                if (message_id) {
                    message_id.id = newMessage.id;
                }
            
                if (deleteMessageLink) {
                    deleteMessageLink.setAttribute('onclick', `deleteMessage('${newMessage.id}', '${newMessage.body}')`);
                }
                }, 500);

                setTimeout(() => {
                    socket.emit('fileMessage', filemeessage);
                }, 1000);
            }     

            socket.on('fileMessage', function(data) {
                var chatMessagesList = document.querySelector('.chat-messages-list');
                var linkElement = document.querySelector('#linkimage.linkimage');
                var imgElement = document.querySelector('#imgsrc.imgsrc');
                var spinnerElement = document.querySelector('#spinner-border');
                var idfordelete = document.querySelector('.idfordelete')
                if (linkElement && imgElement) {
                    linkElement.setAttribute('href', '/storage/' + data.content.path);
                    imgElement.setAttribute('src', '/storage/' + data.content.path);
                    if (spinnerElement) {
                        spinnerElement.style.display = 'none';
                    }
                    linkElement.style.display = 'block';
                    idfordelete.setAttribute('id', 'image-' + data.content.path)
                    linkElement.setAttribute('id', 'linkimage-' + data.content.path);
                    imgElement.setAttribute('id', 'imgsrc-' + data.content.path);
                    if (spinnerElement) {
                        spinnerElement.setAttribute('id', 'loading-' + data.content.path);
                    }
                }
                
                const deleteMessageLink = document.getElementById('image-' + data.content.path);
                const messageElements = document.querySelectorAll('#messageid');
                messageElements.forEach((messageElement) => {
                    messageElement.id = data.id;
                });
            
                const message_id = document.querySelector('#message_id');
                if (message_id) {
                    message_id.id = data.id;
                }
            
                if (deleteMessageLink) {
                    deleteMessageLink.setAttribute('onclick', `deleteMessage(${data.id} , '${data.content.body}')`);
                }

                chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
            });
            
            sendButtons.forEach(function(btn) {
            
                if (btn) {
            
                    btn.addEventListener('click', handleClick);
            
                }
            
            });


$(document).ready(function() {
    $("#deletemessageForm").on("submit", function(event) {
        event.preventDefault();
        socket.emit('deletemessage', {
            message_id: $('#message_id').val(),
            message_value: $('#message_value').val(),
            RealTimeResponse : RealTimeResponse,
        });
    });

    // socket.on('new_deletemessage', function(data) {
    //     console.log(data.message_id);
    //     // var messagedelete = document.q(data.message_id); 
    //     var messagedelete = $('#'+data.message_id+' p'); 
    //     console.log(messagedelete);
    //     if (messagedelete) {

    //         messagedelete.html(`${data.RealTimeResponse.userType == 0 ? '<span style="color: red;">&#x2716; this message was deleted</span><br>'+ data.message_value:
    //         '<span style="color: red;">&#x2716; this message was deleted</span>'}`);  
    //         messageSound.play();
    //     } else {
    //         console.log('hhsdkm');
    //     }
    // });
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
    messageSound.play();
});



function handleNewMessage(data) {
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
    var hasImage = data.path.includes('.jpg') || data.path.includes('.png') || data.path.includes('.jpeg');
    var imageSrc = data.RealTimeResponse.userdata.image;
    var dropdown= `<div class="dropdown">
                                <button class="btn p-0" type="button" id="chat-header-actions"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="bx bx-dots-vertical-rounded fs-4"></i>
                                    </button>
                                <div class="dropdown-menu dropdown-menu-start" aria-labelledby="chat-header-actions">
                                    <a href="javascript:void(0)" class="idfordelete" id="${data.body}" style="color:red; text-align:center;" data-bs-toggle="modal" data-bs-target="#deletemessage" onclick="deleteMessage(${data.id},'${data.body}')"> <i class="bx bx-trash-alt"></i>Delete </a>
                                </div>
                            </div>`;
                            chat.innerHTML += `
                            <li class="chat-message ${isthismyMessage ? 'chat-message-right' : 'chat-message-left' } ${data.id} ">
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
                                        <div class="chat-message-text messageid" id="messageid"  style="${isthismyMessage ? 'margin-right:20px' : 'margin-left:20px'} ;" >
                                            <div class="chat-sender-name text-muted mb-1" style="cursor: pointer;">${!isthismyMessage ? senderName : ''}</div>
                                            ${hasImage ? `
                                            <div id="hasimage">
                                            <div class="spinner-border" id="spinner-border" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                            <a href="" class="linkimage" id="linkimage" target="_blank" style="color:red; display:none;">
                                            <img src="" class="imgsrc" id="imgsrc" alt="Image" style="width: 325px; height: 225px;" />
                                            </a>
                                            </div>
                                            ` :''}
                                            
                                            
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