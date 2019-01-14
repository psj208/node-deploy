const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/',async (req,res,next)=>{
  try{
    const rooms = await Room.find({});
    res.json(rooms);
  }catch(error){
    console.error(error);
    next(error);
  }
});

router.post('/room',async (req,res,next)=>{
  try{
    console.log(req.user);
    if(!req.user){
      console.log(req.user);
      const e = '게스트는 채팅방을 만들 수 없습니다. 로그인해 주세요.';
      res.status(202).json(e);

    }else{
      const room = new Room({
        title : req.body.title,
        owner: req.user ?  req.user.user : req.session.color
      });

      const newRoom = await room.save();
      // const io = req.app.get('io');
      // io.of('/room').emit('newRoom',new)
      res.status(201).json(newRoom);
    }

  }catch (error){
    console.error(error);
    next(error);
  }
});

router.get('/room/:id',async (req,res,next)=>{
  try{
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if(!room){
      req.flash('roomError','존재하지않는 방입니다.');
      return res.redirect('/');
    }

    // const { rooms } = io.of('/chat').adapter;
    // if(rooms && rooms[req.params.id]){
    // }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');
    const data = {
      room,
      title: room.title,
      chats,
      user: req.user ?  req.user.user : req.session.color
    };
    res.json(data);
  }catch (e){
    console.error(e);
    next(e);
  }
});

router.post('/room/:id/chat',async (req,res,next)=>{
  try{
    const chat = new Chat({
      room: req.params.id,
      user: req.user ?  req.user.user : req.session.color,
      chat: req.body.chat

    });

    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat',chat);
    res.send('ok');
  }catch (e){
    console.error(e);
    next(e);
  }
});


module.exports = router;
