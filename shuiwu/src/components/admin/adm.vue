<template>
  <div id="app">
    <div class="app_header">
      <data-header></data-header>
    </div>
    <div class="app_content">
      <div class="app_nav">
        <side-nav></side-nav>
      </div>
      <div class="app_right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import DataHeader from './adminHeader'
import SideNav from './adminSlidenav'
import global from '../../global/global'

export default {
  name: 'app',
  created () {
    if (!global.getToken()) {
      this.$router.push('/admin')
    }
  },
  components: {
    DataHeader,
    SideNav
  },
  watch: {
    '$route': function () {
      this.pathName = this.$route.name
    }
  }
}
</script>

<style>

  #app{
    height: 100%;
    margin: 0;
    display: flex;
    flex-flow: column;
  }
  .lh .el-dialog__headerbtn{
    line-height: 0!important;
  }
  .app_header{
    position: relative;
    flex: 0 0 auto;
    z-index: 2;
  }
  .app_header .title{
    margin-left: 16px;
    color: #fff;
  }
  .app_content{
    flex: 1;
    display: flex;
    flex-flow: row;
  }
  .app_nav{
    position: relative;
    flex: 0 0 280px;
    background: #EFF2F7;
  }
  .app_right{
    flex: 1;
    overflow: auto;
    padding: 20px;
  }
  .breadcrumb{
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
  }
  .header-wraper{
    border-bottom: 1px solid #1487ca;
  }
</style>
