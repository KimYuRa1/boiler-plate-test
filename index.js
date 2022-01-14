const express = require('express') // express모듈을 가져옴
const app = express() //express함수를 사용하여 새로운 express app을 만듦
const port = 7000
const {User1} = require("./models/User1");
const bodyParser = require('body-parser');
const config = require('./config/key');


//application/x-form-urlencoded 형태의 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
//application/json 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then ( ()=> console.log('MongoDB connected ... '))
  .catch( err => console.log(err) )

app.get('/', (req, res) => { // 루트 디렉토리에 오면
  res.send('Hello World! 안녕하세요!') //출력
})

//회원가입을 위한 route (/register)만들기
app.post('/register', (req,res) => {
  //회원가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

  const user=new User1(req.body);//req.body 안에는 {name:“hello”, email:“~~”,password : “~”, ...} 등이 들어있는 것. =>bodyparser이 있어서 가능! 
  
  //mongoDB의 메서드. 이 정보들이 user모델에 저장됨
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({ //status(200) : 성공했다는 의미 . json형식으로 정보 전달해주기
      success: true
    })
  }) 


})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})