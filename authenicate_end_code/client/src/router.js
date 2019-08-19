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
