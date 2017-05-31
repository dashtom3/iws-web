<template>
  <div class="base">
    <div class="addController">
      <el-button type="primary" v-on:click="addBaseAlert = true">添加</el-button>
    </div>

    <!-- 添加设备 -->
    <el-dialog :title="addBaseAlertTitle" v-model="addBaseAlert">
      <el-form ref="addVideoMsg" :model="addVideoMsg" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="addVideoMsg.name" placeholder="请编辑"></el-input>
        </el-form-item>
        <el-form-item label="地点">
          <el-select v-model="addVideoMsg.provinceId" placeholder="选择省份">
            <el-option
            :key="province"
            v-for="province in provinces"
            :label="province.name" :value="province"></el-option>
          </el-select>
          <el-select v-model="addVideoMsg.cityId" placeholder="选择市">
            <el-option
            :key="city"
            v-for="city in citys"
            :label="city.name" :value="city"></el-option>
          </el-select>
          <el-select v-model="addVideoMsg.areaId" placeholder="选择区域">
            <el-option
            :key="area"
            v-for="area in areas"
            :label="area.name" :value="area"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控IP地址">
          <el-input v-model="addVideoMsg.ip" placeholder="请编辑"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBaseAlert = false">取 消</el-button>
        <el-button type="primary" v-on:click="addVideoPost">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 视频列表 -->
    <div class="baseTitle baseWidth">
      <span>名称</span>
      <span>地点</span>
      <span>监控地址</span>
      <span>操作</span>
    </div>
    <div class="baseList baseWidth" v-for="videoList in videoLists">
      <span>{{videoList.name}}</span>
      <span>{{videoList.videoAddress}}</span>
      <span>{{videoList.ip}}</span>
      <span>
        <i class="controlleredit controllericon" v-on:click="editVideo(videoList.id)"></i>
        <i class="controllerdel controllericon" v-on:click="deleteVideoPost(videoList.id)"></i>
      </span>
    </div>
    <!-- 分页 -->
    <div class="block" v-if="videoListArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="videoListArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="videoListArgs.totalPage">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import global from '../../global/global'
export default {
  data () {
    return {
      addBaseAlert: false,
      addBaseAlertTitle: '添加',
      addVideoMsg: {
        name: null,
        videoAddress: null,
        provinceId: null,
        cityId: null,
        areaId: null,
        ip: null,
        port: null,
        username: null,
        password: null,
        protocol: null,
        streamType: null,
        channelID: null,
        zeroChannel: null,
        positionX: null,
        positionY: null,
        describes: null
      },
      provinces: null,
      citys: null,
      areas: null,
      videoLists: [],
      videoInfo: {
        videoId: null
      },
      videoListArgs: {
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1,
        token: global.getToken()
      }
    }
  },
  created () {
    // this.getVideoList(this.videoListArgs)
    this.getProvinces()
  },
  methods: {
    // 获取视频列表
    getVideoList (args) {
      var self = this
      axios.get(global.baseUrl + 'hikvision/list?' + global.getHttpData(args))
      .then((res) => {
        console.log(res)
        // self.videoLists = res.data.data
        // self.videoListArgs.currentPage = res.data.currentPage
        // self.videoListArgs.totalPage = res.data.totalPage
      })
    },
    getProvinces () {
      var self = this
      axios.post(global.baseUrl + 'area/areas')
      .then((res) => {
        // console.log(res)
        self.provinces = res.data.data
      })
    },
    // 修改设备
    editVideo (videoId) {
      this.videoInfo.videoId = videoId
      this.addBaseAlertTitle = '修改'
      this.addBaseAlert = true
      // axios.get(global.baseUrl + '')
      // .then((res) => {
      //   console.log(res)
      // })
    },
    editVideoPost () {
      var self = this
      axios.post(global.baseUrl + 'device/update?id=' + this.editVideoMsg.id + '&name=' + this.editVideoMsg.name + '&token=' + global.getToken())
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.editVideoAlert = false
          global.success(self, '修改成功', '')
          self.getVideoList(self.videoListArgs)
        }
      })
    },
    // 添加设备
    addVideoPost () {
      // var self = this
      // axios.post(global.baseUrl + '', global.postHttpDataWithToken(this.addVideoMsg))
      // .then((res) => {
      //   console.log(res)
      // })
    },
    // 删除视频
    deleteVideoPost (baseId) {
      var self = this
      axios.post(global.baseUrl + 'device/delete?groupId=' + baseId + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '删除成功', '')
          self.getVideoList(self.videoListArgs)
        }
      })
    },
    // 分页
    currentPageChange (value) {
      this.videoListArgs.currentPage = value
      this.getVideoList(this.videoListArgs)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.base{
  text-align: center;
}
.addController{
  text-align: right;
  margin-bottom: 20px;
}
.controllerMargin{
  margin:3px 0;
}
.addController button{
  border-radius: 3px;
  background-color: rgb( 20, 135, 202 );
  width: 201px;
  height: 41px;
}
.left15{
  margin:0 15px;
}
.baseTitle{
  border-radius: 6px;
  background-color: rgb( 229, 229, 229 );
}
.baseWidth span{
  margin-right: -3px;
  display: inline-block;
  min-height: 40px;
  text-align: center;
  font-size: 14px;
  width: 35%;
  vertical-align: middle;
}
.controllericon{
  display: inline-block;
  cursor: pointer;
  margin-right: 20px;
}
.controlleredit{
  width: 22px;
  height: 20px;
  background: url('../../images/controlleredit.png');
}
.controllerdel{
  width: 19px;
  height: 22px;
  background: url('../../images/controllerdel.png');
  margin-right: 0;
}
.baseTitle span{
  line-height: 40px;
}
.baseList span{
  border-bottom: 1px solid rgb( 229, 229, 229 );
    border-right: 1px solid rgb( 229, 229, 229 );
    /* box-sizing: content-box; */
    box-sizing: border-box;
    height: 40px;
}
.baseList span:nth-child(1){
  border-left: 1px solid rgb(229,229,299);
}
.baseWidth span:nth-child(1){
  width: 15%;
}
.baseWidth span:last-child{
  width: 15%;
}
</style>
