<template lang="html">
  <div class="">

  <h1>Signup</h1>
  Name: <input type="text" v-model="name" />
  Email: <input type="text" v-model="email" />
  Password: <input type="password" v-model="password"/>
  <button @click="signup">Sign up</button>
</div>
</template>

<script>
export default {
  name: 'signup',
  data(){
    return{
      name:'',
      email:'',
      password:''
    }
  },
  methods:{
    signup: function(){
      console.log('click');
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
