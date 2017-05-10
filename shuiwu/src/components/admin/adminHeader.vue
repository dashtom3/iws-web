<template>
<div class="header-wraper">
    <el-menu default-active="1" class="el-menu-demo over" mode="horizontal">
        <li class="title">
            <i class="iconLogin"></i>
            <!-- <div class="">
              <span>安徽省舜禹水务股份有限公司</span><br>
              <span>ANHUI  SHUNYU  WATER  AFFAIRS  CO.,LTD.</span>
            </div> -->
        </li>
        <li class="admTitle">后台管理系统</li>
        <li class="user">
          <!-- <span>安全退出</span> -->
            <el-dropdown trigger="click">
                <span class="el-dropdown-link" v-on:click="exit">
                安全退出
              </span>
            </el-dropdown>
        </li>
    </el-menu>
</div>
</template>

<script type="text/javascript">
import global from '../../global/global'
export default {
  methods: {
    exit () {
      global.setToken('')
      global.success(this, '退出成功', '/admin')
    }
  }
}
</script>

<style media="screen">
.header-wraper li {
    float: left;
    margin-right: 20px;
    margin-top: 5px;
}
.title {
    padding: 1em .2em;
}

.title span {
    font-size: 1.4em;
    margin-left: 5px;
}
.el-select-dropdown__list{
  max-height: 187px !important;
}
.admTitle{
  font-size: 24px;
  margin: 20px 0 0 500px;
  position: relative;
  top: 28px;
}
.over{
  overflow: hidden;
}
.option {
    padding-top: 10px;
}
.user .el-dropdown {
    position: absolute;
    right: 20px;
    padding-top: 20px;
    color: #fff !important;
}
.el-dropdown:hover{
  cursor: pointer;
}
.iconLogin{
  display: block;
  width: 329px;
  height: 60px;
  background: url('../../images/admlogin.png') no-repeat;
  margin-top: -5px;
  position: relative;
  top: 8px;
}
.el-menu-demo{
  background-color: #fff;
  /*border-bottom: 1px solid #1487ca;*/
}
.user .el-dropdown{
  color: #000!important;
  right: 50px;
  top: 20px;
}
.user .el-dropdown:after{
  content: '';
  display: block;
  background-color: rgb( 20, 135, 202 );
  transform: rotate(45deg);
  top: 60px;
  left: 35px;
  position: absolute;
  width: 12px;
  height: 9px;
}
.el-dropdown-link{
  font-size: 18px;
}
</style>
