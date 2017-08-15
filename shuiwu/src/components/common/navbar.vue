<template>
  <div class="hello">
    <v-header></v-header>
    <div class="main">
    <div class="indexHeader">
      <div class="indexLog">
        <a href="/index"><img src="../../images/login_03.png" alt=""></a>
      </div>
      <div class="indexNav">
        <el-menu :default-active="activeIndex" class="el-menu-demo navbar" mode="horizontal" router>
          <el-menu-item index='/personal'>个人中心</el-menu-item>
          <el-menu-item index='/video'>视频监控</el-menu-item>
          <el-menu-item index="/news/unconfirmed">消息</el-menu-item>
          <el-menu-item index="/alarminfo">报警信息</el-menu-item>
          <el-menu-item index="/dataview">数据查看</el-menu-item>
          <el-menu-item index="/index">首页</el-menu-item>
        </el-menu>
      </div>
    </div>
    <router-view></router-view>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import header from './header'
import footer from './footer'
// import Vue from 'vue'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      activeIndex: this.$route.path
    }
  },
  created () {
    var self = this
    this.$nextTick(function () {
      self.activeIndex = self.$route.path
    })
  },
  components: {
    'v-header': header,
    'v-footer': footer
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 100%;
  min-width: 1280px;

}
.indexHeader{
  width: 1280px;
  height: 71px;
  line-height: 71px;
  margin: 0 auto 10px;
}
.indexLog{
  float: left;
}
.leftNav{
  width: 320px;
  margin-right: 10px;
  float: left;
}
.main {
  min-height: 100vh;
}
.navbar{
  background-color: #fff!important;
  float: right;
  height: 71px;
  line-height: 71px;
}
.navbar li{
  float: right;
  font-size: 18px;
  width: 120px;
  text-align: center;
  margin:0 40px;
}
.navbar li:hover{
  cursor: pointer;
}
.navbar li.active{
  color: rgb(20,135,202);
  border-bottom: 4px solid;
}
.el-menu--horizontal .el-menu-item{
  height: 71px!important;
  line-height: 71px!important;
}
.el-menu-item.is-active{
  border-bottom: 4px solid rgb( 20, 135, 202 );
  color:rgb(20,135,202);
}
.el-menu-item:hover{
  border-bottom: 4px solid rgb( 20, 135, 202 )!important;
  background-color: none!important;
}
</style>
