const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //bcrypt사용방법 참조 - 먼저 salt를 생성하고, 그 생성된 salt로 비밀번호를 암호화시킴
const jwt = require('jsonwebtoken');

const user1Schema = mongoose.Schema({
    name: {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true  // 사이 스페이스를 없애주는 역할
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type: String,
        maxlength : 50
    },
    role : {
        type : Number,// 예를 들면 0이면 관리자, 1이면 일반 유저로 설정하기 위해~
        default : 0
    },
    image : String,
    token : { // 유효성 관리
        type : String
    },
    tokenExp : { //token이 사용할 수 있는 기간 설정
        type : Number
    }
})

user1Schema.pre('save', function(next){// user1모델에 유저 정보를 저장하기 전에 function을 수행하고 나서! index.js의 register route 안의 다른 것들을 수행하라.

    var user = this;

    if(user.isModified('password')){ //비밀번호가 바뀔 때 실행
        //비밀번호를 암호화시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) next(err)

            bcrypt.hash( user.password, salt, function(err,hash){ // plainPassword , salt, function(err, hash-암호화된 비밀번호)
                if(err) return next(err)

                user.password = hash
                next()
            }) 
        })

    } else { //다른 것(비밀번호X)을 바꿀 때 실행
        next()
    }
}) 

user1Schema.methods.comparePassword = function(plainPassword, cb) {
    //plainpassword 1234567   암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null, isMatch) //err 없고 isMatch (true)
        
    })
}

user1Schema.methods.generateToken = function(cb) {
    var user=this;
    //json web token을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    //user._id + 'secretToken' = token 만듦
    //나중에 token 생성할 때 'secretToken'를 넣으면 user._id가 나옴.
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

user1Schema.statics.findByToken = function( token, cb) {
    var user = this;

    //user,_id + "secretToken" = token
    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //user id(decoded)를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 token과 보관된 token이 일치하는지 확인.
        user.findOne({ "_id" : decoded, "token" : token} , function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User1 = mongoose.model('User1', user1Schema);

module.exports = {User1} // 이 모델(User1)을 다른 파일에서도 쓰기 위해 export해줌