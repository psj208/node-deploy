var chat = io.connect('http://localhost:3000/chat',{
  path: '/socket.io'
});
console.log("asdu", '#{guest}');

chat.on('join',function(data){
  console.log("view쪽 join",data); // system 누구 입장 한거 표시
});
chat.on('chat',function(data){


  if(data.user === id){
    var outgoing_msg = document.createElement('div');
    outgoing_msg.setAttribute('class', 'outgoing_msg');
    var sent_msg = document.createElement('div');
    sent_msg.setAttribute('class','sent_msg');
    sent_msg.innerHTML = "<p>"+chat.chat+"</p>";
  }else if(data.user === 'system'){

  }else{
    var incoming_msg = document.createElement('div');
    incoming_msg.setAttribute('class','incoming_msg');

    var incoming_msg_img = document.createElement('div');
    incoming_msg_img.setAttribute('class','incoming_msg_img');

    var img = document.createElement('img');
    src = 'https://ptetutorials.com/images/user-profile.png';
    img.setAttribute('src',src);
    incoming_msg_img.appendChild(img);

    incoming_msg.appendChild(incoming_msg_img);

    var received_msg = document.createElement('div');
    received_msg.setAttribute('class','received_msg');

    var received_withd_msg = document.createElement('div');
    received_withd_msg.setAttribute('class','received_withd_msg');
    received_withd_msg.innerHTML = "<p>"+data.chat+"</p>";

    received_msg.appendChild(received_withd_msg);
    incoming_msg.appendChild(received_msg);

    chatLogs.appendChild(incoming_msg);


  }

});

var sliders = [].slice.call(document.getElementsByClassName("chat_list"));
function addJoinEvent(id){
  console.log(id);
  var xhr = new XMLHttpRequest();
  chat.emit('join',{id:id});


  xhr.onload = function(){
    if(xhr.status === 200){
      var chats = JSON.parse(xhr.responseText);
      console.log(chats);
      // 밑을 옮기기
      var el = document.querySelector('#chat-form');
      el.dataset.id = id;

      var chatLogs = document.querySelector('#chatLogs');
      chatLogs.innerHTML = '';
      if(chat.chat){

        chats.chat.map(function(chat){
          if(chat.user === user){
            var outgoing_msg = document.createElement('div');
            outgoing_msg.setAttribute('class', 'outgoing_msg');
            var sent_msg = document.createElement('div');
            sent_msg.setAttribute('class','sent_msg');
            sent_msg.innerHTML = "<p>"+chat.chat+"</p>";
          }else if(chat.user === 'system'){

          }else{
            var incoming_msg = document.createElement('div');
            incoming_msg.setAttribute('class','incoming_msg');

            var incoming_msg_img = document.createElement('div');
            incoming_msg_img.setAttribute('class','incoming_msg_img');

            var img = document.createElement('img');
            src = 'https://ptetutorials.com/images/user-profile.png';
            img.setAttribute('src',src);
            incoming_msg_img.appendChild(img);

            incoming_msg.appendChild(incoming_msg_img);

            var received_msg = document.createElement('div');
            received_msg.setAttribute('class','received_msg');

            var received_withd_msg = document.createElement('div');
            received_withd_msg.setAttribute('class','received_withd_msg');
            received_withd_msg.innerHTML = "<p>"+chat.chat+"</p>";

            received_msg.appendChild(received_withd_msg);
            incoming_msg.appendChild(received_msg);

            chatLogs.appendChild(incoming_msg);
          }
        });
      }

    }else{
      console.error(xhr.responseText);
    }
  };

  xhr.open('GET','/chat/room/'+id);
  xhr.send();
}
// 방 접속
sliders.forEach(function (e, index){
  e.addEventListener("click", function(){
    addJoinEvent(e.dataset.id);
  });
});

//chating input
document.querySelector('#chat-form').addEventListener('submit',function(e){

  e.preventDefault();

  if(e.target.chat.value){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 200){
          e.target.chat.value = '';
        }else{
          console.error(error);
        }
    }
    xhr.open('POST','/chat/room/'+e.target.dataset.id+'/chat');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({ chat: this.chat.value }));
  }else{
    alert('채팅을 입력하세요.');
  }
});
