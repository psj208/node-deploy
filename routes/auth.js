const express = require('express');
const passport = require('passport');
// const bkfd2Password = require("pbkdf2-password");
// const hasher = bkfd2Password();
const crypto = require('crypto');
const { isLoggedIn, isNotLoggedIn,ismodifyed } = require('./middlewares');
const User = require('../schemas/user');

const router = express.Router();

/*
  //등록
  const chat = new Chat({
    room: req.params.id,
    user: req.session.color, //유저 아이디
    chat: req.body.chat
  });

  await chat.save();
  //삭제
  await Chat.remove({ _id: req.params.id });
  //select
  const exUser = await User.find({ user });
*/

router.get('/login',isNotLoggedIn,(req,res,next)=>{
  res.render('auth/login');
});

router.get('/register',isNotLoggedIn,(req,res,next)=>{
  res.render('auth/register',{
    joinError : req.flash('joinError')
  });
});

router.post('/register',isNotLoggedIn,async (req,res,next)=>{
  const { user, password, displayName } = req.body;

  try{
    const exUser = await User.findOne({ user });

    if(exUser){
      req.flash('joinError','이미 가입된 이메일입니다.');
      return res.redirect('/auth/register');
    }

    const salt = await crypto.randomBytes(64).toString('base64');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

    const newUser = new User({
      user: user,
      password: hash.toString('base64'),
      salt: salt,
      displayName: displayName
    });
    await newUser.save();

    return res.redirect('/auth/login');
  }catch(error){
    console.error(error);
    return next(error);
  }

});

router.post('/login',isNotLoggedIn,(req,res,next)=>{
  passport.authenticate('local',(authError, user, info)=>{
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      req.flash('loginError',info.message);
      return res.redirect('/auth/login');
    }
    return req.login(user, (loginError)=>{ // -> passport.serializeUser 실행

      return res.redirect('/');
    });

  })(req,res,next); //미들웨어 내의 미들웨어는 이걸 붙인다.
  //라우터미들웨어 안에 패스포트 passport.authenticate('local')미들웨어 사용
  //미들웨어에 사용자정의기능을 추가하고싶을때 내부 미들웨어에 (req,res,next) 인자로 제공해서 호출
});
router.get('/facebook',ismodifyed,(req,res,next)=>{

  return res.redirect('/');
})
router.get('/kakao',passport.authenticate('kakao'));

router.get('/kakao/callback',passport.authenticate('kakao',{
  failureRedirect : '/',
}),(req,res)=>{
  res.redirect('/');
});

router.get('/logout',isLoggedIn,(req,res)=>{
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

  // route.get('/logout',function(req,res){
  //   // console.log('logout');
  //   req.logout();
  //   req.session.save(function(){
  //     res.redirect('/');
  //   });
  //
  // });

module.exports = router;
