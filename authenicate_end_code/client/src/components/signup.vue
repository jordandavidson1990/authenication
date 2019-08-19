<template lang="html">
  <div>
    <h1>Signup</h1>
    Name: <input type="text" v-model="name" />
    Email: <input type="text" v-model="email" />
    Password: <input type="password" v-model="password" />
    <button @click="signup">Sign up</button>
    {{ feedback }}
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
      feedback:''
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
          this.feedback = 'Success'
          this.$router.push('/login')
        }, err => {
          console.log(err.response);
          this.feedback = err.response.data.error
        })
    }
  }
}
</script>

<style lang="css" scoped>
input{
  display: block;
  margin: auto;
}
</style>
