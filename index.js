const express = require('express') // express모듈을 가져옴
const app = express() //express함수를 사용하여 새로운 express app을 만듦
const port = 7000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ura3118:ura62283118@my-app-cluster0.ahjly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then ( ()=> console.log('MongoDB connected ... '))
  .catch( err => console.log(err) )

app.get('/', (req, res) => { // 루트 디렉토리에 오면
  res.send('Hello World!') //출력
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})