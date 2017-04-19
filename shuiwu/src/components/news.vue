<template>
  <div class="news">
    <div class="newsbg"></div>
    <div class="newsCon">
      <div class="newsConNav">
        <el-input
          placeholder="请输入搜索内容"
          icon="search"
          v-model="searchVal"
          class="searchVal">
        </el-input>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/news/unconfirmed">未确认</el-menu-item>
          <el-menu-item index="/news/newshistory">历史消息</el-menu-item>
          <el-submenu index="">
             <template slot="title">系统</template>
             <el-menu-item
             :key="system"
             v-for="(system, index) in systems"
             :label="system"
             v-on:click="goSelect(index)"
             index="">{{system}}</el-menu-item>
           </el-submenu>
        </el-menu>
      </div>
      <div class="newsNavCon">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      systems: ['水厂监测', '二次供水', '加压泵站', '管网检测', '污水处理', '生产调度', '水利模型', '数据分析', '报警记录'],
      activeIndex: '/news/unconfirmed',
      searchVal: '',
      selectSystem: ''
    }
  },
  methods: {
    goSelect (item) {
      console.log(item)
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
