<template>
  <div class="head">
    <div class="headCon">
      <div class="headLeft">
        <a href="javascript:;">欢迎来到舜禹水务</a>
      </div>
      <div class="headRight">
        <span v-show="isShow"><a href="javascript:;" v-on:click="goLogin">登录</a></span>
        <span v-show="isShow"><a href="javascript:;">|</a></span>
        <span v-show="isShow"><a href="javascript:;" v-on:click="goRegister">注册</a></span>
        <span v-show="isLogin" class="use">{{username}}</span>
        <span v-show="isLogin" class="use" v-on:click="exit">退出</span>
        <span><a href="/aboutUs" class="about">关于我们</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import global from '../../global/global'
export default {
  name: 'head',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      isShow: true,
      isLogin: false,
      username: ''
    }
  },
  created () {
    if (localStorage.time !== '') {
      var time = (Date.parse(new Date()) / 1000)
      if (time > localStorage.time) {
        global.timeout(this, '登录已过期', '/login')
      }
      if (localStorage.token !== '') {
        this.isShow = false
        this.isLogin = true
        // console.log(global.userMsg)
        this.username = localStorage.username
      } else {
        this.isShow = true
        this.isLogin = false
      }
    }
  },
  methods: {
    goLogin () {
      this.$router.push('/login')
    },
    goRegister () {
      this.$router.push('/register')
    },
    exit () {
      localStorage.token = ''
      localStorage.time = ''
      localStorage.username = ''
      this.isShow = true
      this.isLogin = false
      global.success(this, '退出成功', '/index')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head{
  background-color: rgb( 0, 0, 0 );
  height: 40px;
  line-height: 40px;
}
.headCon{
  width: 1280px;
  margin: 0 auto;
}
.headCon a{
  color: #fff;
}
.headLeft{
  float: left;
}
.headRight{
  float: right;
}
.about{
  margin-left: 50px;
}
.use{
  color: #fff;
  margin-right: 10px;
}
.use:hover{
  cursor: pointer;
}
</style>
