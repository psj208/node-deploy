var socket = io.connect('http://localhost:3000/room',{
  path: '/socket.io'
});

document.getElementById('room-form').addEventListener('click',function(){
  var newTitle = prompt('방 제목 입력해주세요.');
  if(!newTitle){
    return alert('방 제목을 반드시 입력하셔야 합니다.');
  }
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    var room = JSON.parse(xhr.responseText);
    console.log(room);
    if(xhr.status === 201){
      [].forEach.call(document.getElementsByClassName('chat_list'),function(el) {
         el.classList.remove("active_chat");
      });

      var inbox = document.querySelector('.inbox_chat');
      var chat_list = document.createElement('div');
      chat_list.setAttribute("class", "chat_list");
      chat_list.classList.add('active_chat');

      var chat_people = document.createElement('div');
      chat_people.setAttribute("class", "chat_people");

      var chat_img = document.createElement('div');
      chat_img.setAttribute('class', 'chat_img');

      var img = document.createElement('img');
      src = 'https://ptetutorials.com/images/user-profile.png';
      img.setAttribute('src',src);

      chat_img.appendChild(img);

      chat_people.appendChild(chat_img);

      var chat_ib = document.createElement('div');
      chat_ib.setAttribute('class','chat_ib');
      // '+monthNames[room.createdAt.getMonth()]+' '+room.createdAt.getDate()+'
      chat_ib.innerHTML = '<h5>'+newTitle+'<span class="chat_date"></span></h5><p>채팅내용</p>';
      chat_people.appendChild(chat_ib);

      chat_list.appendChild(chat_people);
      inbox.appendChild(chat_list);
      chat_list.classList.add('active_chat');

      addJoinEvent(room._id); // 채팅접속

    }else if(xhr.status === 202){
      var e = JSON.parse(xhr.responseText);
      return alert(e);
    }else{
      console.error(xhr.responseText);
    }
  };
  xhr.open('POST','/chat/room');
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify({ title:newTitle }));
});
// 방목록 표시
// function getRoom(){
//   var xhr = new XMLHttpRequest();
//   xhr.onload = function(){
//     if(xhr.status === 200){
//       var rooms = JSON.parse(xhr.responseText);
//       var inbox = document.querySelector('.inbox_chat');
//
//       inbox.innerHTML = '';
//       rooms.map(function(room){
//         var chat_list = document.createElement('div');
//         chat_list.setAttribute('class','chat_list');
//
//         var chat_people = document.createElement('div');
//         chat_people.setAttribute("class", "chat_people");
//
//         var chat_img = document.createElement('div');
//         chat_img.setAttribute('class', 'chat_img');
//
//         var img = document.createElement('img');
//         src = 'https://ptetutorials.com/images/user-profile.png';
//         img.setAttribute('src',src);
//
//         chat_img.appendChild(img);
//
//         chat_people.appendChild(chat_img);
//
//         var chat_ib = document.createElement('div');
//         chat_ib.setAttribute('class','chat_ib');
//         chat_ib.innerHTML = '<h5>'+room.title+'<span class="chat_date">최신채팅날짜</span></h5><p>채팅내용</p>';
//
//
//         chat_people.appendChild(chat_ib);
//
//         chat_list.appendChild(chat_people);
//         inbox.appendChild(chat_list);
//       });
//
//     }else{
//       console.error(xhr.responseText);
//     }
//   }
//   xhr.open('GET','/chat/');
//   xhr.send();
// }
