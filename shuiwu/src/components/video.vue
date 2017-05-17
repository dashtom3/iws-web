<template>
  <div class="videoMsg" ref="contentHeight">
    <ul>
      <li v-for="videoList in videoLists"><video :src="videoList.src" autoplay poster="" controls></video></li>
      <li class="addVideo"><i class="el-icon-plus" v-on:click="videoListAlert = true" style="color:#aaaaaa;"></i></li>
    </ul>
    <el-dialog title="视频列表" v-model="videoListAlert">
      <!-- <el-table :data="videoTableData">
        <el-table-column property="date" label="名称" width="150"></el-table-column>
        <el-table-column property="name" label="地址" width="200"></el-table-column>
        <el-table-column property="address" label="监控地址"></el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template scope="scope">
            <el-button type="text" size="small">添加</el-button>
          </template>
      </el-table> -->
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
// import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      videoListAlert: false,
      videoLists: [
        { src: 'https://misc.rrcimg.com/pc/two_anniversary.mp4' },
        { src: 'https://misc.rrcimg.com/pc/two_anniversary.mp4' },
        { src: 'https://misc.rrcimg.com/pc/two_anniversary.mp4' }
      ],
      videoTableData: null
    }
  },
  created () {
    // axios.get(global.baseUrl + '')
  },
  mounted () {
    var login = this.$refs.contentHeight
    global.setNavHeight(login)
    if (!global.getToken()) {
      this.$router.push('/login')
    }
  }
}
</script>
<style media="screen">
.videoMsg{
  width: 1280px;
  margin: 0 auto;
}
.videoMsg ul{
  overflow: hidden;
  width: 100%;
}
.videoMsg ul li{
  width: 640px;
  height: 400px;
  float: left;
  text-align: center;
  border-width: 3px;
  border-color: rgb( 15, 21, 11 );
  border-style: solid;
  box-sizing: border-box;
}
.videoMsg ul li video{
  max-width: 100%;
  height: 100%;
}
.addVideo i{
  font-size: 80px;
  line-height: 400px;
  text-align: center;
  cursor: pointer;
}
</style>
