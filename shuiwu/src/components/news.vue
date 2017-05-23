<template>
  <div class="news">
    <div class="newsbg"></div>
    <div class="newsCon">
      <div class="newsConNav">
        <el-input
          placeholder="请输入搜索内容"
          icon="search"
          v-model="searchVal"
          v-on:keyup.enter.native="searchNews"
          class="searchVal">
        </el-input>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/news/unconfirmed">未确认</el-menu-item>
          <el-menu-item index="/news/myNews">我的消息</el-menu-item>
          <el-menu-item index="/news/newshistory">历史消息</el-menu-item>
          <el-submenu index="3">
             <template slot="title">{{systemName}}</template>
             <el-menu-item
             index="/news/system/0" v-on:click="goSelect">全部系统</el-menu-item>
             <el-menu-item
             :key="system"
             v-for="(system, index) in systems"
             v-on:click="goSelect"
             :index="'/news/system/'+system.id">{{system.name}}</el-menu-item>
           </el-submenu>
        </el-menu>
      </div>
      <div class="newsNavCon">
        <router-view v-bind:args="searchKeyword"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      systems: [],
      activeIndex: this.$route.path,
      systemName: '系统',
      searchVal: '',
      searchKeyword: null,
      selectSystem: ''
    }
  },
  created () {
    var self = this
    axios.post(global.baseUrl + 'system/list', global.postHttpDataWithToken())
    .then((res) => {
      self.systems = res.data.data
    })
  },
  methods: {
    goSelect () {
      location.reload()
    },
    searchNews () {
      this.searchKeyword = this.searchVal
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.newsbg{
  height: 250px;
  background: url('../images/newsbg_02.png') no-repeat top center;
}
.newsCon{
  width: 1280px;
  margin: 20px auto;
  overflow: hidden;
  min-height: 600px;
}
.newsConNav{
  width: 190px;
  height: 320px;
  float: left;
  margin-right: 40px;
  text-align: center;
}
.searchVal{
  width: 150px;
}
.newsConNav .el-menu--horizontal .el-submenu,.newsConNav .el-menu--horizontal .el-menu-item{
  clear: both;
  width: 150px;
  margin: 0 auto;
  float: none;
}
.newsNavCon{
  float: left;
  width: 1050px;
}
</style>
