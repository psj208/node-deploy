const mongoose = require('mongoose');
const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = ()=> {
  const connect = () => {
      //개발 환경이 아닐때 몽구스가 생성하는 쿼리 내용을 콘솔을 통해 확인
      if( process.env.NODE_ENV !== 'production' ){
        mongoose.set('debug',true);
      }
      mongoose.connect(MONGO_URL,{
        dbName: 'nodeChat',
        useNewUrlParser: true
      },(error)=>{
        if(error){
          console.log('mongoDB connection error',error);
        }else{
          console.log('mongoDB connection success!!')
        }
      });
  }
  connect();

  mongoose.connection.on('error',(error)=>{
    console.error('mongoDB connection error',error);
  });
  mongoose.connection.on('disconnected',()=>{
    console.error('mongoDB connection error, reconnecting... ');
    connect();
  });

  require('./user');
  require('./chat');
  require('./room');

}
