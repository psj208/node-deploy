const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../schemas/user');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback' // 카카오로부터 인증 결과를 받을 라우터 주소
  },async(accessToken, refreshToken, profile, done)=>{
      try{
        const exUser = await User.findOne({ where: { user: profile.id, provider: 'kakao'} });
        console.log(exUser);
        if(exUser){
          done(null, exUser);

        }else{

          const newUser = new User({
            user: profile.id,
            displayName: profile.displayName,
            provider: 'kakao'
          });

          await newUser.save();

          done(null, newUser);
        }


      }catch(error){
        console.error(error);
        done(error);
      }
  }));
};
