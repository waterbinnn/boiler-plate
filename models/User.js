const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: String,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//pre : mongoose 에서 가져온 메서드 , 저장하기 전에 뭔가를 하고 끝나면 next 를 진행
userSchema.pre('save',function(next){
  
  //이걸 통해 password 가져올 수 있다
  let user = this;

  if (user.isModified('password')){

    
    //비밀번호를 암호화 시킨다. 
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
      
      //hash 가 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function(err,hash){
        if(err) return next(err)
        user.password = hash //암호화하는데 성공하면 hash 로 만들어주는 것
        next() //완성됐으면 다시 next 로 돌아가게 
      } )
    });
  } else {
    next()
  }
  });

  userSchema.methods.comparePassword = function(plainPassword,cb) {
    //plainPassword 1234567 암호화된 비밀번호 : "$2b$10$r1GLXxVTdTEwiLed8tz9lO.S5RjyWF8YqR5Rm973MT.Vhf9tYhVx2"
    // 이 둘이 맞는지 확인을 해야 함 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
      if(err) return cb(err), //err 면 return cd(err)
      cb(null, isMatch) //err 가 아니면 error 은 null , isMatch 는 true 
    })
  }

  //비밀번호까지 맞다면 토큰 형성 
  userSchema.methods.generateToken = function(cb){
    let user = this;

    //jsonwebtoken 을 이용해서 token 생성하기 

    let token = jwt.sign(user._id.toHexString(),'secretToken')

    // user._id + 'secretToken' = token
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err,user)
    {
      if(err) return cb(err)
      cb(null, user)
    })
  }

  userSchema.statics.findByToken = function(token, cb) {
    let user = this;
    // user._id + '' = token
    //토큰을 decode 한다. (암호화)
    jwt.verify(token,'secretToken',function(err,decoded){
      //유저 아이디를 이용해서 유저를 찾은 다음에
      //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인 

      user.findOne({'_id':decoded, 'token': token}, function(err,user){
        if(err) return cb(err)
        cb(null,user) 
      })
    })
  }


const User = mongoose.model("User", userSchema);



module.exports = { User };
