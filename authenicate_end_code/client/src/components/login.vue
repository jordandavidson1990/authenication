<template lang="html">
  <div>
    Email: <input type="text" v-model="email">
    Password: <input type="password" v-model="password">
    <button @click="login">Login</button>
    {{ error }}
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
      error: ''
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
          if (res.status === 200){
          localStorage.setItem('token', res.data.token);
          this.$router.push('/')
        }
        }, err => {
          console.log(err.response);
          this.error = err.response.data.error
        })
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
