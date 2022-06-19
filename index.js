//필요한 모듈
const express = require("express");
const app = express();
const port = 5000;

//몽고디비 연결 호스트 설정
const config = require("./config/key");
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//application/json
app.use(express.json());

//몽고디비 연결
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  //성공시
  .then(() => console.log("MongoDB Connected..."))
  //실패시
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Good");
});

app.post("/register", (req, res) => {
  //회원가입할때 필요한 정보들을 client에서 가져오면
  const user = new User(req.body);
  
  // user 데이터 베이스에 넣어준다
  //save 하기 전에 비밀번호를 암호화 해줘야한다
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
