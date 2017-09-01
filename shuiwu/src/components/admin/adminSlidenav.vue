<template>
    <el-menu class="el-menu-vertical-demo navbg" :default-active=defaultActive router ref="contentHeight">
    <el-menu-item index="/admin/user"><i class="userbg"></i><span>用户管理</span></el-menu-item>
    <el-menu-item index="/admin/roles"><i class="qxbg"></i><span>角色权限管理</span></el-menu-item>
    <el-menu-item index="/admin/system"><i class="systembg"></i><span>系统管理</span></el-menu-item>
    <el-menu-item index="/admin/controller"><i class="kzbg"></i><span>控制器管理</span></el-menu-item>
    <el-menu-item index="/admin/base"><i class="jbbg"></i><span>基本设备管理</span></el-menu-item>
    <el-menu-item index="/admin/video"><i class="jbbg"></i><span>视频监控管理</span></el-menu-item>
    <!-- <el-menu-item index="/admActive"><i class="busbg"></i><span>GPS维修车管理</span></el-menu-item> -->
  </el-menu>
  </el-col>
</template>

<script>
// import global from '../../global/global'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      defaultActive: this.$route.path
    }
  },
  mounted () {
    var login = this.$refs.contentHeight
    var wh = document.body.scrollHeight
    login.$el.style.minHeight = wh - 84 + 'px'
    login.$el.style.height = '100%'
  }
}
</script>
<style media="screen">
.userbg,.qxbg,.systembg,.jbbg,.kzbg,.busbg{
  display: inline-block;
  width: 38px;
  height: 38px;
  position: relative;
  top: 15px;
  left: 15px;
  margin: 0 20px 0 30px;
}
.userbg{
  background: url('../../images/women.png') no-repeat;
}
.qxbg{
  background: url('../../images/man.png') no-repeat;
}
.systembg{
  background: url('../../images/set.png') no-repeat;
}
.areaName:hover{
  cursor: pointer;
}
.jbbg{
  background: url('../../images/imager.png') no-repeat;
}
.kzbg{
  background: url('../../images/controller.png') no-repeat;
  left: 20px;
  top: 18px;
}
.busbg{
  background: url('../../images/install.png') no-repeat;
}
.navbg{
  background-color: #092138;
  text-align: left;
}
.navbg li span{
  position: relative;
  top: -5px;
}
.navbg li{
  color: #fff;
  font-size: 14px;
}
.navbg li:hover{
  background: none;
}
.navbg li.is-active{
  background-color: #1487ca!important;
  color: #fff;
}
</style>
