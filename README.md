# Using Authenication with Vue and MongoDb

## Lesson Objectives

- Know how to use axios, jsonwebtoken and mongoose
- Understand how to verify user
- Be able to make a basic authenication app.

### Introduction

We are going to try make basic authenication functionality using a Vue frontend and mongodb/express backend incorporating mongoose, axios, jsonwebtoken and bcrypt.

> Hand out start code

```
// terminal server directory
mongod
npm install
npm start
```
```
// terminal client directory
npm install
npm run serve
```

Visit `localhost:3000` and you should see "hello world".

Visit `localhost:8080` and you should see "Home".

## Signup

> Give 5 mins to look over the code.

You'll notice we have a very basic sign up form with data that captures the name, email address and password of the new user. The current sign up button doesn't perform anything just yet aside from logging 'click' to the console.

We have a client and server folder. Let's start by connecting the two.


First we want to include our body parser into our server.js

``` 
// server.js
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
```

Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.

A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).

```
app.post('/signup', (req, res) =>{
  
})
```

Next we will go back to the frontend and install Axios to call and send data back to the backend.

```npm install axios```

And we can include it in our signup.vue

```
// signup.vue
import axios from 'axios'
```

And modify the method to create a new user

```
methods: {
    signup: function(){
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password
      }
    }
  }
```
## Axios
Axios is a promise based HTTP request library which allows us to interface with REST APIs.

### Axios v Fetch

* Fetch's body = Axios' data
* Fetch's body has to be stringified, Axios' data contains the object
* Fetch has no url in request object, Axios has url in request object
* Fetch request function includes the url as parameter, Axios request function does not include the url as parameter.
* Fetch request is ok when response object contains the ok property, Axios request is ok when status is 200 and statusText is 'OK'
* To get the json object response: in fetch call the json() function on the response object, in Axios get data property of the response object.

We will now use axios to send the data to the backend. Post requires the URL as the first parameter and data to be passed as the second.

```
axios.post('http://localhost:3000/signup', newUser)
```
Lets check if the data is sent to the backend.

```
// server.js
app.post('/signup', (req, res) =>{
  console.log(req.body) <!--added-->
})

```

Doing this alone with run into a cors issue. Let us resolve this now by
``` npm install cors```

```
// server.js
const cors = require('cors')
app.use(cors())
```

When submitting form you should now see the data on the displayed in your terminal screen.

### Mongoose

Now that we can access our front end data and send it to the backend lets look into creating our mongoose model.

In terms of Node.js, mongodb is the native driver for interacting with a mongodb instance and mongoose is an Object modeling tool for MongoDB. Using Mongoose, a user can define the schema for the documents in a particular collection. It provides a lot of convenience in the creation and management of data in MongoDB.

``` 
terminal - server folder
npm install mongoose
mkdir models
touch models/User.js
```

First we will grab mongoose by requiring it in and creating our Schema. We will set the email to unique so that only one account can have one email.

```
// User.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  name: String,
  email: {
    unique: true,
    type: String
    },
  password: String
})
```
Mongoose's inbuild validators are when we add a criteria to the data we want to persist. Another example is `required: true`, `minLength: 2`, `maxLength: 6`, `enums`.
We can also make custom validators by adding logic. 

Then we will set a collection for where this schema will be sent to. 

```
const User = mongoose.model('User', userSchema)

module.exports = User
```

Then require the User into the server.js

```
// server.js
const User = require('./models/User')
```

```
app.post('/signup', (req,res) =>{
  let newUser = new User({
    email: req.body.email
    name: req.body.name
  })
})
```
We will decrypt our password by using bcrypt.

`npm i bcrypt`

```
// server.js
const bcrypt = require('bcrypt')
```

Then we should use bcrypt when storing our password

```
app.post('/signup', (req,res) =>{
  let newUser = new User({
    email: req.body.email
    name: req.body.name
    password: bcrypt.hashSync(req.body.password, 10)<!--added-->
  })
  console.log(newUser) <!--added-->
})
```
We should have our schema model in the terminal. You may have to restart server to get the password to decrypt. 

Lets start mongod

```
// terminal
mongod
```
After that we should point our mongoose to our localhost.

```
// server.js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/signups')
```

We will now save the new user to the database. First we will set up if there are any errors.

```
// server.js
app.post('/signup', (req,res) =>{
  let newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save(err => { <!--modified-->
	  if(err){
	    return res.status(400).json({
	      title:'error',
	      error:'email in use'
    })
  })
})

```
This would be a status of 400 Bad Request
This response means that server could not understand the request due to invalid syntax. Most likely caused by user entering an email that is already in use.

If there is no error lets return a successful status of 200.

```
// server.js
  newUser.save(err => {
    if(err){
      return res.status(400).json({
        title:'error',
        error:'email in use'
      })
    }
    return res.status(200).json({ <!--added-->
      title:'signup success'
    })
  })
})
``` 

When we try to add multiple names with the same email we should get an error in our console. We should also check MongoDB Compass we should see our new user.

In order to get some feedback from when we add the user.

```
// signup.vue
axios.post('http://localhost:3000/signup', newUser)
        .then(res => { 			<!--added-->
          console.log(res); 
        }, err => {
          console.log(err.response);
        })
```
Lets test this out by adding a new user and you should receive some feedback from the console saying it has been successful. Clicking again with the same email should flag an error saying email is in use.

## Login

In client directory
```
npm install vue-router
```

``` 
touch src/router.js
```

```
// router.js
import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';

Vue.use(Router);

export default new Router({
  routes:[
    {
      path:'/',
      name:'home',
      component: Home
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/signup',
      name:'signup',
      component:Signup
    }
  ]
})

```
```
// main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router'; <!--added-->

Vue.config.productionTip = false

new Vue({
  router, <!--added-->
  render: h => h(App),
}).$mount('#app')

```

And change our app.js

```
// app.js
<template>
  <div id="app">
    <router-view/>		<!--modified-->
  </div>
</template>
```

Lets set up our login page.

```
// login.vue
<template lang="html">
  <div>
    Email: <input type="text" v-model="email">
    Password: <input type="text" v-model="password">
    <button>Login</button>
  </div>
</template>

<script>
export default {
  name:'login',
  data(){
    return{
      email:'',
      password:''
    }
  }
}
</script>

<style lang="css" scoped>
input{
  display: block;
  margin:auto
}
</style>
```

We would like to connect to the backend. For which we will use axios.

```
// login.vue
import axios from 'axios'
```
Lets make the click button call a function

```
<button @click="login">Login </button> <!--modified-->
```

```
// login.vue
methods:{
    login: function(){
      let user = {
        email: this.email,
        password: this.password
      }
      axios.post('http://localhost:3000/login', user)
        .then(res => {
          console.log(res);
        })
    }
  }
```

We will send it to the backend and check that we are receiving the data. 

```
app.post('/login', (req, res) => {
  console.log(req.body);
})
```
After attempting to login we should see our email and password in our terminal.

We should then use the mongoose function findOne. Since all of our emails are set up to be unique there should only be one. We will also flag up an error if an email in not found on the front end.

```
// server.js
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
  })
})
```

We will use bcrypt.compareSync method which takes only 2 arguments and returns a boolean value true or false. We will flag up if the password is incorrect.

```
// server.js
if(!user) return res.status(401).json({
      title: 'user not found',
      error: 'invalid creditentials'
    })
    // incorrect Password <!--added-->
    if(!bcrypt.compareSync(req.body.password, user.password)){
      return res.status(401).json({
        title: 'login failed',
        error: 'invalid creditentials'
      })
    }
```

And then only if everything is all good, we will use json web token to verify the user and the credentials. We will send a token back to the frontend for the user to use that token. 

` npm install jsonwebtoken` 

We could also add some visual feedback to incorporate the error messages we have flagged up in our backend by adding them to our signup.vue

> show the error when trying to sign up for same email address and route that it takes to get to error message. Should be err.response.data.title

```
// signup.vue
<template lang="html">
  <div>
    <h1>Signup</h1>
    Name: <input type="text" v-model="name" />
    Email: <input type="text" v-model="email" />
    Password: <input type="password" v-model="password" />
    <button @click="signup">Sign up</button>
    {{ error }} <!--added-->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'signup',
  data(){
    return{
      name:'',
      email:'',
      password:'',
      error:'' <!--added-->
    }
  },
  methods: {
    signup: function(){
      let newUser = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      axios.post('http://localhost:3000/signup', newUser)
        .then(res => {
          console.log(res);
          this.error = '' <!--added-->
        }, err => {
          console.log(err.response);
          this.error = err.response.data.error <!--added-->
        })
    }
  }
}
</script>
```
We can also push this user towards the login page as we know they have signed up successfully.

```
axios.post('http://localhost:3000/signup', newUser)
        .then(res => {
          console.log(res);
          this.feedback = 'Success'
          this.$router.push('/login') <!--added-->
```

If we check with our mongodb compass we should have a new user.

Lets now give some feedback to the login for wrong password.

```
// login.vue
<template lang="html">
  <div>
    Email: <input type="text" v-model="email">
    Password: <input type="password" v-model="password">
    <button @click="login">Login</button>
    {{ error }}			<!--added-->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name:'login',
  data(){
    return{
      email:'',
      password:'',
      error: '' 			<!--added-->
    }
  },
  methods:{
    login: function(){
      let user = {
        email: this.email,
        password: this.password
      }
      axios.post('http://localhost:3000/login', user)
        .then(res => {
          console.log(res);
        }, err => { 					<!--added-->
          console.log(err.response);		<!--added-->
          this.error = err.response.data.error <!--added-->
        })
    }
  }
}
</script>
```

Now lets go back to the backend and if successful send a token to the frontend.

```
// server.js
const jwt = require('jsonwebtoken')
```

In order to generate a web token we use the function .sign(). In the first parameter include a payload and the second parameter include a secret key. We will send the `userId: user_id` as we know by logging out the user we get a `_id`. And we will create a global variable of random letters which can't be hacked. Then we will send this json back to the frontend.

```
// server.js
    let token = jwt.sign({ userId: user._id }, secretkey)
    return res.status(200).json({
      title: 'login successful',
      token: token
})
```
Create a global variable above the function

```
const secrettoken = 'hfdsahgjkhfvsdaljgdisajg23452asgasg'
```

Now lets go back to the frontend and log out our response and it should give us a token.

```
// login.vue
axios.post('http://localhost:3000/login', user)
        .then(res => {
          if (res.status === 200){ <!--added-->
          console.log(res)}
        }, err => {
          console.log(err.response);
          this.error = err.response.data.error
        })
    }
```

If we attempt to login in with a registered email and password we should see in our console that we have now have a token. 

```
data:
title: "login successful"
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDUyN2"
```

Now that we have our token we will store it in our local storage and then push them to our home page.

```
//login.vue
axios.post('http://localhost:3000/login', user)
        .then(res => {
          if (res.status === 200){
          localStorage.setItem('token', res.data.token) <!--modified-->
          this.$router.push('/')
          }
```

This will redirect us to the loading page. Which we will add in some conditional logic to check if the user has been authorised (includes a token in local storage).

```
// home.vue
<script>
export default {
  name:'home',
  created(){ 			<!--added -->
    if(localStorage.getItem('token') === null){
      this.$router.push('/login')
    }
  }
}
</script>
```

Now let us add a logout button to the home page. All we need to do is clear our localStorage.

```
// home.vue
<template lang="html">
<div>
  Home
  <button @click="logout">Logout</button> <!--added-->
</div>
</template>

<script>
export default {
  name:'home',
  created(){
    if(localStorage.getItem('token') === null){
      this.$router.push('/login')
    }
  },
  methods:{	<!--added-->
    logout: function(){
      localStorage.clear();
      this.$router.push('/login')
    }
  }
}
</script>
```

## User Details

Since we know the user is logged in we can personallise the page using the details acquired. We will send the token through the header.

```
// home.vue
mounted(){
    axios.get('http://localhost:3000/user', {
      headers: {
        token: localStorage.getItem('token')
      }
    }).then(res => {
      console.log(res);
    })
  },
```
This will flag up a 404 as we have yet to create this route. Lets do this now in the backend.

We will use jwt.verify() which takes two parameters, first is a token, second is our secret key. We will also provide an error response which we will provide a decoded response. 

```
// server.js
app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretkey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    console.log(decoded);
  })
})

```
There should only be a decoded userId if the user exists in the system. 

```
// server.js
app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretkey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    User.findOne({ _id: decoded.userId }, ( err, user ) => { <!--modified-->
      if (err) return console.log(err);
      console.log(user);
    })
  })
})
```

This should then log out the user details to the console. Since we can now log all of the data we can send all of the data to the frontend. Incidently we will not send back the whole object of user since we don't want to send our password so will only send email and name.

```
// server.js
app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretkey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    User.findOne({ _id: decoded.userId }, ( err, user ) => {
      if (err) return console.log(err);
      return res.status(200).json({ <!--modified-->
        title: 'user grabbed', <!--added-->
        user: {					<!--addded-->
          email: user.email,
          name: user.name
        }
      })
    })
  })
})

```

This should now pop up on our console and we can then use that data to display to the user. 

```
// home.vue
<template lang="html">
<div>
  <h2>Home</h2>
  <p>Hello {{name}}</p> <!--added-->

  <button @click="logout">Logout</button>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name:'home',
  data(){		<!--added-->
    return{
      name:'',
      email:''
    }
  },
  created(){
    if(localStorage.getItem('token') === null){
      this.$router.push('/login')
    }
  },
  mounted(){
    axios.get('http://localhost:3000/user', {
      headers: {
        token: localStorage.getItem('token')
      }
    }).then(res => {			<!--modified-->
      // console.log(res);
      this.name = res.data.user.name
      this.email = res.data.user.email
    })
  },
  methods:{
    logout: function(){
      localStorage.clear();
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="css" scoped>
</style>

```

### Summary

We now know how to use axios to make get and post requests.

Can make Schema and use the methods in build to mongoose to 
- Know how to use axios, jsonwebtoken and mongoose
- Understand how to verify user
- Be able to make a basic authenication app.










