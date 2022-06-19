const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  }
  });


const User = mongoose.model("User", userSchema);



module.exports = { User };
