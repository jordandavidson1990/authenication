<template>
  <div id="app">
    <signup />
  </div>
</template>

<script>
import Signup from './components/signup'
export default {
  name: 'app',
  components: {
    "signup":Signup
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
