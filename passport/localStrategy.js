const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

// const { User } = require('../schemas/user');
const User = require('../schemas/user');
module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'user',
        passwordField: 'password'
      },

      async (user,password,done) => {
        try{
          const exUser = await User.findOne({ user });
          console.log(exUser);
          if(exUser){
            const hash = crypto.pbkdf2Sync(password, exUser.salt, 100000, 64, 'sha512');
            if(exUser.password === hash.toString('base64')){
              console.log('패스워드 동일!!');
              done(null,exUser);
            }else{
              console.log('패스워드 불일치!!');
              done(null,false,{message:'비밀번호가 일치하지 않습니다.'});;
            }
          }else{
            done(null,false,{message:'사용자가 없습니다.'});
          }
        }catch(error){
          console.error(error);
          next(error);
        }
      }
    )
  );
};
