const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../schemas/user');
// await User.find()

module.exports = (passport) => {
  passport.serializeUser((user,done)=>{
    done(null,user.id);
  });

  passport.deserializeUser(async (id,done) => {
    try {
      const user = await User.findOne({_id:id});
      console.log('deserialize:',user)
      done(null,user);

    } catch (error){
      console.error(error);
      next(error);
    }
  });

  local(passport);
  kakao(passport);



}
