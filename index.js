const express = require('express') // express모듈을 가져옴
const app = express() //express함수를 사용하여 새로운 express app을 만듦
const port = 7000
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser'); //express에서 제공되는 cookieParser

const {User1} = require("./models/User1");
const {auth} = require("./middleware/auth");

//application/x-form-urlencoded 형태의 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
//application/json 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then ( ()=> console.log('MongoDB connected ... '))
  .catch( err => console.log(err) )

app.get('/', (req, res) => { // 루트 디렉토리에 오면
  res.send('Hello World! 안녕하세요!') //출력
})

//회원가입을 위한 route (/Register Route)만들기
app.post('/api/users/register', (req,res) => {
  //회원가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

  const user=new User1(req.body);//req.body 안에는 {name:“hello”, email:“~~”,password : “~”, ...} 등이 들어있는 것. =>bodyparser이 있어서 가능! 
  
  //User1.js에서 user1Schema.pre('save', function ... )을 수행함

  //mongoDB의 메서드. 이 정보들이 user모델에 저장됨
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({ //status(200) : 성공했다는 의미 . json형식으로 정보 전달해주기
      success: true
    })
  })
  
})

app.post('/api/users/login', (req, res) => {
  
  //요청된 E-mail을 DB에서 찾기 : User.findOne()
  User1.findOne({email: req.body.email}, (err, user)=> {
    
    if(!user){ //user가 없으면
      return res.json({
        loginSuccess: false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

  //요청된 E-mail이 DB에 있다면 비밀번호가 맞는지 확인
  user.comparePassword(req.body.password, (err, isMatch) => { //로그인을 위해 입력한 password와 DB에 저장된 password가 일치하는지 확인. isMatch하면 
    if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
    
    //비밀번호가 맞다면 Token을 생성
    user.generateToken((err, user)=> {
      if(err) return res.status(400).send(err); //status(400) = 에러

      //token을 저장한다. 어디에? 쿠키, 로컬 스토리지 , 세션 .. 여기서는 "쿠키"에 저장하자!
      res.cookie("x_auth", user.token)
      .status(200)
      .json({loginSuccess: true, userId: user._id }) 
    })
  })
  })

} )

//'/api/users/...' 는 나중에 Router을 이용해서 정리를 편리하게 하기 위함!
app.get('/api/users/auth', auth , (req, res)=> { //auth라는 미들웨어 : /를 통해 request를 만든 다음, callback function을 하기 전에, 중간에서 일함.
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentification이 true라는 말.
  res.status(200).json({ //이렇게 정보를 주면 어떤 페이지에서든지 user 정보를 이용할 수 있게 되어 편함.
    //user정보들 제공해주기
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //role이 0이면 일반유저, role이 0이 아니면 관리자.
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req,res) => {
  //로그 아웃 하려는 유저를 데이터 베이스에서 찾아서
  User1.findOneAndUpdate( {_id: req.user._id}, //auth middleware에서 req에 넣어준 id
    {token: ""} //token 지워줌
    ,(err,user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    }
  )

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})