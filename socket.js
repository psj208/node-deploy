const SocketIO = require('socket.io');

module.exports = (server,app,sessionMiddleware) =>{
  const io = SocketIO(server,{ path: '/socket.io' });
  app.set('io',io);
  const room = io.of('/room');
  const chat = io.of('/chat');

  //세션 미들웨어에 요청,응답,next 객체를 인자로 넣어줌
  io.use((socket,next)=>{
    sessionMiddleware(socket.request, socket.request.res,next);
  });

  room.on('connection',(socket)=>{
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect',()=>{
      console.log('room 네임스페이스 접속 해제');
      clearInterval(socket.interval);
    });
    // socket.on('reply',(data)=>{
    //   console.log(data);
    // });
    socket.interval = setInterval(()=>{
      socket.emit('news','Hello socketio');
    },9000);

  });

  chat.on('connection',(socket)=>{
    console.log('chat 네임스페이스 접속');
    const req = socket.request;

    // const { headers: { referer }} = req;
    // const roomId = referer.split('/')[referer.split('/').length -1].replace(/\?.+/, '');

    socket.on('join',(data)=>{
      console.log('chat네임스페이스 join 접속!',data);
      socket.join(data.id);
      socket.to(data.id).emit('join',{
        user: 'system',
        chat:  data.user+'님이 입장하셨습니다.'
      });
    });

    socket.on('disconnect',()=>{
      console.log('chat 네임스페이스 접속 해제');
      // socket.leave(roomId);
    });
  });


}
