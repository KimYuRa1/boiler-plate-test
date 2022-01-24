const {User1} = require("../models/User1");

let auth = (req, res, next) => {
    //인증 처리를 하는 곳

    //client 쿠키에서 token을 가져옴
    let token = req.cookies.x_auth;

    //token 복호화(decode) 후 user를 찾는다
    User1.findByToken(token, (err, user)=> {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true}) //user가 없으니 auth false, error가 있다고 전해줌
        req.token = token;
        req.user = user; //token과 user을 req에 넣어줌으로 인해서 index.js > app.get('api/users/auth', auth , (req, res)=> { ... 안에서 > req.~~로 user정보,token을 가질 수 있고 사용할 수 있게 됨       
        next(); //index.js> app.get('api/users/auth', auth , (req, res)=> { ... //middleware(auth)에서 계속 넘어갈 수 있도록(빠져나가게)함.
    })

    //user가 있으면 인증 O
    //user가 없으면 인증 X

}

module.exports = {auth}