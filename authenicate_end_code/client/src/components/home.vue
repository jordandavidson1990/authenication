<template lang="html">
<div>
  <h2>Home</h2>
  <p>Hello {{name}}</p>

  <button @click="logout">Logout</button>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name:'home',
  data(){
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
    }).then(res => {
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
