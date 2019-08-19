const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb://localhost:27017/signups')
const secretkey = 'fhdklsahgdshaginasbklhgiovasnbklvhsjkbvsbajkfg'

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.post('/signup', (req,res) =>{
  let newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save(err => {
    if(err){
      return res.status(400).json({
        title:'error',
        error:'email in use'
      })
    }
    return res.status(200).json({
      title:'signup success'
    })
  })
})

app.get('/', (req, res)=>{
  res.send('hello world')
})

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({
      title: 'server error',
      error: err
    })
    if(!user) return res.status(401).json({
      title: 'user not found',
      error: 'invalid creditentials'
    })
    // incorrect Password
    if(!bcrypt.compareSync(req.body.password, user.password)){
      return res.status(401).json({
        title: 'login failed',
        error: 'invalid creditentials'
      })
    }
    // If all is good, create a token
    let token = jwt.sign({ userId: user._id }, secretkey)
    return res.status(200).json({
      title: 'login successful',
      token: token
    })
  })
})

app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretkey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    User.findOne({ _id: decoded.userId }, ( err, user ) => {
      if (err) return console.log(err);
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          email: user.email,
          name: user.name
        }
      })
    })
  })
})


const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if(err) return console.log(err)
  console.log('server running on port ' + port);
})
