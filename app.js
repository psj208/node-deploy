const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash'); // 일회성 메세지
const ColorHash = require('color-hash');
const passport = require('passport');
require('dotenv').config();


const webSocket = require('./socket');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const connect = require('./schemas');
const passportConfig = require('./passport');
const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);

const app = express();
connect();
passportConfig(passport);

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
}else{
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret:process.env.COOKIE_SECRET,
  cookie:{
    httpOnly: true,
    secure: false,
    // expires: null,
    // maxAge: 600000
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true
  })
};
if(process.env.NODE_ENV === 'production'){
  // https 사용하기 위해선
  // proxy:true https 적용을위해 노드서버 앞에 다른 서버를 두었을때
  // cookie.secure:true 로드밸런싱(요청부하분산)등을 위해
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}
const sessionMiddleware = session(sessionOption);
app.use(sessionMiddleware);
/*
  resave : 요청왔을때 수정사항이 없어도 다시 저장할것인지 대한 설정
  saveUninitialized : 세션에 저장할 내역이 없더라도 세션을 저장할것인지, 방문자추적할때 사용
  httpOnly : 클라이언트에서 쿠키를 확인 못하도록
  secure : false-https 환경이 아닌곳에서 사용, 배포시 ture 설정하는것이 좋음
  store : 세션저장, 보통 레디스 자주 사용
*/
app.use(flash());

app.use((req,res,next)=>{
  if(!req.session.color){
    const colorHash = new ColorHash();
    req.session.color = "익명"+colorHash.hex(req.sessionID);
  }
  next();
});

app.use(passport.initialize()); // req객체에 패스포트 설정을 심는다.
app.use(passport.session()); // req.session 객체에 패스포트 정보를 저장
// express-session에서 생성하는것이므로 보다 뒤에 연결

app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/chat',chatRouter);

app.use((req,res,next)=>{
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

app.use((err,req,res)=>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'),()=>{
  console.log('app listening on port',app.get('port'),'..');
});
webSocket(server,app,sessionMiddleware);
