const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/',async (req,res,next)=>{
  const rooms = await Room.find({});

  // .populate({
  //   path:'room',
  //   options: {
  //       limit: 2,
  //       sort: { created: -1}
  //
  //   }
  // const chats = await Chat.find({},{$group: {_id: "$room"},total :{$sum :1}}).sort({ createdAt : -1 });
  // const chats = await Chat.aggregate( [ { $group : { '_id': '$room' } },{'$limit' : 5}, ] );
  // const chat = Chat.aggregate(
  //   {
	//      $group : {_id : "$room", total : { $sum : 1 }}
  //   }
  // );
  //{room:'5c28868c82ec8f44a6fe6d72'},
  // slice('players', 5)
  // const chats = await Chat.find({}).sort({ createdAt : -1 }).aggregate({ $limit : 5 });

  // const chats = await Chat.find({}).populate('room').sort({ createdAt : -1});
  // console.log(chats);


  res.render('index',{
      user: req.user,
      id: req.user ? req.user.user : req.session.color,
      rooms,
      // chats
  });
});

module.exports = router;
