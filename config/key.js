if(process.env.NODE_ENV === 'production'){ //배포한 후
    module.exports=require('./prod')
} else{
    module.exports=require('./dev') //local환경에서
}