<template>
  <div class="dataviews" ref="contentHeight" v-loading="loading" element-loading-text="拼命加载中">
    <div class="dataviewsHeader">
      <div class="dataviewNavbar">
        <ul class="kinds">
          <li class="active" v-on:click="table($event)">表格显示</li>
          <!-- <li v-on:click="chart($event)">图表显示</li> -->
        </ul>
      </div>
    </div>
    <div class="select">
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">系统：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="systemId" @change="selectSystem">
              <el-radio-button label="0">全部</el-radio-button>
               <el-radio-button :label="systemList.id"
               :key="systemList.id"
               v-for="(systemList, index) in systemLists">{{systemList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect" v-if="contentProvince">
        <mu-select-field v-model="selectProvince"  label="请选择省份" @change="province">
          <mu-menu-item v-for="province in provinces" :key="province.id" :value="province" :title="province.name" />
        </mu-select-field>
        <mu-select-field v-model="selectCity"  label="请选择城市" @change="city">
          <mu-menu-item v-for="city in citys" :key="city.id" :value="city" :title="city.name" />
        </mu-select-field>
        <mu-select-field v-model="selectArea"  label="请选择地区" @change="area">
          <mu-menu-item v-for="area in areas" :key="area.id" :value="area" :title="area.name" />
        </mu-select-field>
      </div>
      <div class="systemSelect" v-if="contentLocation">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">小区：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectLocation" @change="location">
              <el-radio-button label="0">全部</el-radio-button>
               <el-radio-button :label="location.id"
               :key="location.id"
               v-for="(location, index) in locations">{{location.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <!-- 所有地点 -->
      <div class="systemSelect" v-if="contentRoom">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">泵房：</span></el-col>
          <el-col :span="22">
            <el-radio-group  v-model="selectRoom" @change="room">
              <el-radio-button label="0">全部</el-radio-button>
               <el-radio-button
               :key="room.id"
               v-for="(room, index) in rooms" :label="room.id">{{room.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <!-- 控制器组列表 -->
      <div class="systemSelect" v-if="contentDevice">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">设备：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="deviceTermId" @change="selectControllerId">
              <el-radio-button label="0">全部</el-radio-button>
               <el-radio-button
               :key="controllerList.id"
               v-for="controllerList in controllerLists"
               :label="controllerList.groupId"
               >{{controllerList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <!-- 控制器 -->
      <div class="systemSelect" v-if="contentController">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">控制器：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="controllerInfo" @change="controllerSelect">
              <el-radio-button label="0">全部</el-radio-button>
               <el-radio-button
               :key="controllerList.id"
               v-for="controllerList in deviceTermLists"
               :label="controllerList.id"
               >{{controllerList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <div class="systemSelect" v-if="contentTime">
        <el-row :gutter="20">
        <el-col :span="2"><span class="title">时间：</span></el-col>
        <el-col :span="2">
          <el-button type="primary" @click="timeAll">不限</el-button>
        </el-col>
        <el-col :span="20">
        <el-date-picker
           v-model="startTime"
           type="datetime"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-date-picker
           v-model="endTime"
           type="datetime"
           placeholder="选择日期"
           @change="endTimeSelect">
         </el-date-picker>

       </el-col>
        </el-row>
         <!-- <span> —— </span>
         <el-button type="primary">不限</el-button> -->
         <!-- <el-select v-model="dateQuery.timeStep" placeholder="请选择时间间隔">
             <el-option
               :key="time"
               v-for="(time, index) in times"
               :label=time.date
               :value=time.seconds>
             </el-option>
          </el-select> -->
      </div>
      <!-- <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <ul class="multiSelect">
              <li v-for="(multiSelect, index) in multiSelects" :value=index v-on:click="showActive($event)" >{{multiSelect.name}}</li>
            </ul>
          </el-col>
        </el-row>
      </div> -->
      <div v-show="tableShow">
        <div class="systemSelect" style="text-align:center;">
            <el-button type="primary" @click="dateQueryClick">确定</el-button>
        </div>
        <table cellspacing="0" cellpadding="0" class="dateTable" v-if="dateContent">
          <tr class="bgth">
            <th>报警名称</th>
            <th>设备名称</th>
            <th>所属小区</th>
            <th>所属泵房</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>描述</th>
            <th>状态</th>
          </tr>
          <tr v-for="(dateTable, index) in dateTables" class="bgtr">
            <td>{{dateTable.name}}</td>
            <td>{{dateTable.groupName}}</td>
            <td>{{dateTable.locationName}}</td>
            <td>{{dateTable.roomName}}</td>
            <td>{{dateTable.startTime | time}}</td>
            <td>{{dateTable.endTime | time}}</td>
            <td>{{dateTable.describes}}</td>
            <td>{{alarmStatus[dateTable.confirm-1]}}</td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:40px;" v-if="dateTables.length > 0">
          <el-button type="primary" @click="moreData = true">查看更多数据</el-button>
          <!-- <el-button type="primary" @click="printExcel">导出EXCEl表格</el-button> -->
        </div>
        <div style="text-align:center;margin-top:40px;" v-if="dateTables.length == 0 && dateContent == true">
          <el-button type="primary">暂无数据</el-button>
          <!-- <el-button type="primary" @click="printExcel">导出EXCEl表格</el-button> -->
        </div>
      </div>
      <el-dialog title="更多数据" v-model="moreData" size="large" class="MoreData">
        <table cellspacing="0" cellpadding="0" class="dateTable">
          <tr class="bgth">
            <th>报警名称</th>
            <th>设备名称</th>
            <th>所属小区</th>
            <th>所属泵房</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>描述</th>
            <th>状态</th>
          </tr>
          <tr v-for="(dateTable, index) in dateTables" class="bgtr">
            <td>{{dateTable.name}}</td>
            <td>{{dateTable.groupName}}</td>
            <td>{{dateTable.locationName}}</td>
            <td>{{dateTable.roomName}}</td>
            <td>{{dateTable.startTime | time}}</td>
            <td>{{dateTable.endTime | time}}</td>
            <td>{{dateTable.describes}}</td>
            <td>{{alarmStatus[dateTable.status]}}</td>
          </tr>
        </table>
        <!-- 分页 -->
        <div class="block" v-if="dateQuery.totalPage > 1">
          <el-pagination
            layout="prev, pager, next"
            @current-change="currentPageChange"
            :current-page.sync="dateQuery.currentPage"
            :page-count="dateQuery.totalPage">
          </el-pagination>
        </div>
      </el-dialog>
      </div>

  </div>
</template>

<script>
import global from '../global/global'
import axios from 'axios'
// import Vue from 'vue'
// import ECharts from 'vue-echarts3'
// Vue.component('chart', ECharts)
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableShow: true,
      chartShow: false,
      echart: false,
      systemId: '0',
      groupId: '0',
      loading: false,
      moreData: false,
      contentProvince: false,
      contentLocation: false,
      contentRoom: false,
      contentDevice: false,
      contentController: false,
      contentTime: true,
      contentMultiple: false,
      dateContent: false,
      times: [
        { date: '1秒', seconds: '1' },
        { date: '1分钟', seconds: '60' },
        { date: '1小时', seconds: '3600' },
        { date: '1天', seconds: '86400' }
      ],
      deviceTermId: '0',
      controllerInfo: '0',
      deviceTermLists: [],
      alarmStatus: ['已确认', '未确认'],
      selectProvince: null,
      provinces: [],
      citys: [],
      selectCity: null,
      selectArea: null,
      areas: [],
      locations: [],
      selectLocation: '0',
      rooms: [],
      selectRoom: '0',
      selectController: null,
      multiSelects: [],
      tagShow: false,
      tags: [],
      systemLists: [],
      controllerLists: [],
      startTime: null,
      endTime: null,
      dateQuery: {
        systemId: null,
        provinceId: null,
        cityId: null,
        areaId: null,
        locationId: null,
        roomId: null,
        groupId: null,
        deviceId: null,
        startTime: null,
        endTime: null,
        timeStep: null,
        numberPerPage: '10',
        currentPage: '1',
        totalPage: '-1',
        token: global.getToken()
      },
      tables: [],
      dateTables: []
    }
  },
  methods: {
    timeAll() {
      this.startTime = null;
      this.endTime = null;
      this.dateQuery.startTime = null;
      this.dateQuery.endTime = null;
    },
    table (obj) {
      this.tableShow = true
      this.chartShow = false
      document.querySelectorAll('.kinds li')[1].setAttribute('class', '')
      obj.target.setAttribute('class', 'active')
    },
    chart (obj) {
      this.tableShow = false
      this.chartShow = true
      document.querySelectorAll('.kinds li')[0].setAttribute('class', '')
      obj.target.setAttribute('class', 'active')
    },
    showActive (obj) {
      if (obj.target.className === 'active') {
        obj.target.setAttribute('class', '')
      } else {
        obj.target.setAttribute('class', 'active')
      }
    },
    // 系统筛选
    selectSystem: function () {
      this.selectProvince = null
      var self = this
      self.changeEmpty()
      this.citys = []
      this.areas = []
      if (this.systemId !== '0') {
        global.apiPost(this,global.baseUrl + 'system/detailPack?systemId=' + this.systemId + '&token=' + global.getToken())
        .then((res) => {
          self.changeEmpty()
          self.emptyFooter()
          self.contentLocation = false
          self.contentRoom = false
          self.contentDevice = false
          self.contentController = false
          self.contentTime = true
          self.contentProvince = true
          self.provinces = res.data.data.locationPack
        })
      } else {
        self.provinces = []
        self.contentLocation = false
        self.contentRoom = false
        self.contentDevice = false
        self.contentController = false
        self.contentTime = true
        self.contentProvince = false
        this.dateQuery.systemId = null
        this.dateQuery.provinceId = null
        this.dateQuery.cityId = null
        this.dateQuery.areaId = null
        self.dateQuery.locationId = null
        self.dateQuery.roomId = null
        self.dateQuery.groupId = null
        self.dateQuery.deviceId = null
      }
      this.dateContent = false
      this.selectProvince = null
      this.selectCity = null
      this.selectArea = null
    },
    province (value) {
      this.changeEmpty()
      this.dateContent = false
      var self = this
      if (value) {
        this.changeEmpty()
        this.dateQuery.provinceId = value.provinceId
        this.citys = value.city
      } else {
        this.citys = []
        this.areas = []
        this.selectCity = null
        this.areas = null
        this.dateQuery.provinceId = null
        this.dateQuery.cityId = null
        this.dateQuery.areaId = null
        self.dateQuery.locationId = null
        self.dateQuery.roomId = null
        self.dateQuery.groupId = null
        self.dateQuery.deviceId = null
      }
      this.contentLocation = false
      this.contentRoom = false
      this.contentDevice = false
      this.contentController = false
      this.contentTime = true
      this.contentMultiple = false
    },
    city (value) {
      this.dateContent = false
      var self = this
      this.selectArea = null
      if (value) {
        this.changeEmpty()
        this.dateQuery.cityId = value.cityId
        this.areas = value.area
      } else {
        this.areas = []
        this.dateQuery.cityId = null
        this.dateQuery.areaId = null
        self.dateQuery.locationId = null
        self.dateQuery.roomId = null
        self.dateQuery.groupId = null
        self.dateQuery.deviceId = null
      }
      this.contentLocation = false
      this.contentRoom = false
      this.contentDevice = false
      this.contentController = false
      this.contentTime = true
      this.contentMultiple = false
    },
    area (value) {
      this.dateContent = false
      var self = this
      this.changeEmpty()
      if (value) {
        this.contentLocation = true
        this.emptyFooter()
        this.dateQuery.areaId = value.areaId
        this.rooms = []
        this.locations = value.location
      } else {
        self.dateQuery.areaId = null
        self.dateQuery.locationId = null
        self.dateQuery.roomId = null
        self.dateQuery.groupId = null
        this.contentLocation = false
      }
      this.contentRoom = false
      this.contentDevice = false
      this.contentController = false
      this.contentTime = true
      this.contentMultiple = false
    },
    // 初始化函数
    empty () {
      this.systemId = '0'
      this.selectLocation = '0'
      this.selectRoom = '0'
      this.deviceTermId = '0'
      this.controllerInfo = '0'
      this.locations = []
      this.rooms = []
      this.controllerLists = []
      this.deviceTermLists = []
      this.multiSelects = []
    },
    changeEmpty () {
      this.selectRoom = '0'
      this.deviceTermId = '0'
      this.controllerInfo = '0'
      this.controllerLists = []
      this.deviceTermLists = []
    },
    // 获取房间
    location () {
      this.dateContent = false
      var self = this
      if (this.selectLocation !== '0') {
        self.dateQuery.locationId = self.selectLocation
        global.apiPost(this,global.baseUrl + 'location/detail?locationId=' + this.selectLocation + '&token=' + global.getToken())
        .then((res) => {
          self.contentRoom = true
          self.contentDevice = false
          self.selectRoom = '0'
          self.deviceTermId = '0'
          self.controllerInfo = '0'
          self.contentController = false
          self.contentDevice = false
          self.emptyFooter()
          self.rooms = res.data.data.room
        })
      } else {
        self.dateQuery.locationId = null
        self.dateQuery.roomId = null
        self.dateQuery.groupId = null
        self.dateQuery.deviceId = null
        this.contentRoom = false
        this.contentController = false
        this.contentDevice = false
        this.changeEmpty()
      }
    },
    // 泵房选择
    room () {
      this.dateContent = false
      var roomMsg = {
        roomId: this.selectRoom,
        token: global.getToken()
      }
      var self = this
      if (this.selectRoom !== '0') {
        self.dateQuery.roomId = self.selectRoom
        global.apiGet(this,global.baseUrl + 'room/groupList?' + global.getHttpData(roomMsg))
        .then((res) => {
          self.contentDevice = true
          self.deviceTermId = '0'
          self.contentController = false
          self.emptyFooter()
          self.controllerLists = res.data.data
        })
      } else {
        self.contentDevice = false
        self.contentController = false
        self.contentTime = true
        self.dateQuery.roomId = null
        self.dateQuery.deviceId = null
        self.dateQuery.groupId = null
        this.changeEmpty()
      }
    },
    // 选择控制器组
    selectControllerId () {
      this.dateContent = false
      var self = this
      if (this.deviceTermId !== '0') {
        self.dateQuery.groupId = self.deviceTermId
        global.apiGet(this,global.baseUrl + 'room/groupDetail?groupId=' + this.deviceTermId + '&token=' + global.getToken())
        .then((res) => {
          self.emptyFooter()
          self.contentController = true
          self.deviceTermLists = res.data.data.devices
        })
      } else {
        this.dateQuery.groupId = null
        this.dateQuery.deviceId = null
        this.contentController = false
        // console.log(this.dateQuery)
        this.contentTime = true
      }
    },
    // 控制器
    controllerSelect () {
      this.dateContent = false
      var self = this
      if (this.controllerInfo !== '0') {
        this.dateQuery.deviceId = this.controllerInfo.id
        self.contentTime = true
        self.contentMultiple = false
        self.dateQuery.timeStep = null
      } else {
        self.dateQuery.deviceId = null
        this.contentTime = true
      }
    },
    endTimeSelect () {
      this.contentMultiple = true
    },
    emptyFooter () {
      this.contentTime = true
      this.contentMultiple = false
      this.controllerInfo = '0'
      this.dateQuery.timeStep = null
    },
    timeFilter (value) {
      var month = value.getMonth() + 1
      var date = value.getDate()
      var hour = value.getHours()
      var minutes = value.getMinutes()
      var seconds = value.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      return value.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds
    },
    // 查询数据
    dateQueryClick () {
      // this.empy(this.dateQuery)
      if (this.systemId !== '0') {
        this.dateQuery.systemId = this.systemId
      }
      if (this.selectRoom !== '0') {
        this.dateQuery.locationId = this.selectRoom
      }
      if (this.controllerInfo !== '0') {
        this.dateQuery.deviceId = this.controllerInfo
      }
      if (this.startTime) {
        this.dateQuery.startTime = this.timeFilter(this.startTime)
      }
      if (this.endTime) {
        this.dateQuery.endTime = this.timeFilter(this.endTime)
      }
      this.dateQuery.currentPage = '1'
      this.getAlarmInfo(this.dateQuery)
    },
    empy (value) {
      for (let i in value) {
        value[i] = null
      }
      value.token = global.getToken()
      return value
    },
    // 增加标签
    addTags () {
      this.tags = []
      var lis = document.querySelectorAll('.multiSelect li.active')
      for (var i in lis) {
        if (lis[i].innerHTML !== undefined) {
          this.tags.push(lis[i].innerHTML)
        }
      }
    },
    // 删除标签
    closeTag (index) {
      this.tags.splice(index, 1)
    },
    // 获取报警信息的列表
    getAlarmInfo (args) {
      // console.log(args)
      var self = this
      this.loading = true
      global.apiGet(this,global.baseUrl + 'alarm/list?' + global.getHttpData(args))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          this.loading = false
          if (res.data) {
            self.dateContent = true
            self.dateTables = res.data.data
            self.dateQuery.currentPage = res.data.currentPage
            self.dateQuery.totalPage = res.data.totalPage
          } else {
            alert('该筛选条件没有数据')
          }
        }
      })
    },
    // 分页
    currentPageChange (value) {
      this.dateQuery.currentPage = value
      this.getAlarmInfo(this.dateQuery)
    }
    // 导出excel
    // printExcel () {
    //   global.apiGet(this,global.baseUrl + 'data/outputExcel?' + global.getHttpData(this.dateQuery))
    //   .then((res) => {
    //     console.log(res)
    //   })
    // }
  },
  created () {
    var self = this
    // 系统列表
    global.apiPost(this,global.baseUrl + 'system/list', global.postHttpDataWithToken())
    .then((res) => {
      self.systemLists = res.data.data
    })
    // 全部地点
    var systemMsg = {
      systemId: 0
    }
    global.apiPost(this,global.baseUrl + 'location/list', global.postHttpDataWithToken(systemMsg))
    .then((res) => {
      if (res.data.callStatus === 'SUCCEED') {
        // self.provinces = res.data.
        // console.log(res)
      }
    })
    // this.getAlarmInfo(this.dateQuery)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dataviewsHeader{
  width: 1280px;
  margin: 0 auto;
  height: 71px;
  line-height: 71px;
  border-bottom: 1px solid rgb(20,135,202);
}
.bgtr td:nth-child(1){
  border-left: 1px solid rgb( 220, 220, 220 );
}
.bgtr td{
  border-right: 1px solid rgb( 220, 220, 220 );
  border-bottom: 1px solid rgb( 220, 220, 220 );
}
.dateTable{
  width: 100%;
  text-align: center;
}
.dateTable tr th:nth-child(1),.dateTable tr td:nth-child(1){
  width: 10%
}
.dateTable tr th:nth-child(2),.dateTable tr td:nth-child(2){
  width: 10%
}
.dateTable tr th:nth-child(3),.dateTable tr td:nth-child(3){
  width: 10%
}
.dateTable tr th:nth-child(4),.dateTable tr td:nth-child(4){
  width: 10%
}
.dateTable tr th:nth-child(5),.dateTable tr td:nth-child(5){
  width: 12%;
}
.dateTable tr th:nth-child(6),.dateTable tr td:nth-child(6){
  width: 12%;
}
.dateTable tr th:last-child,.dateTable tr td:last-child{
  width: 10%;
}
.dateTable tr th,.dateTable tr td{
  height: 40px;
}
.bgth{
  color: #fff;
  border-radius: 6px;
  background-color: rgb( 20, 135, 202 );
}
.dataviewLogin,.dataviewNavbar ul li{
  float: left;
}
.dataviewNavbar{
  float: right;
}
.dataviewNavbar ul li{
  font-size: 18px;
  width: 151px;
  text-align: center;
  margin:0 40px;
  position: relative;
  overflow: hidden;
}
.dataviewNavbar ul li:hover{
  cursor: pointer;
}
.dataviewNavbar ul li.active{
  color: rgb(20,135,202);
  /*border-bottom: 4px solid;*/
}
.dataviewNavbar ul li.active:after{
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background: rgb(20,135,202);
  transform: rotate(45deg);
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0 auto;
  bottom: -8px;
}
.select{
  margin: 20px auto;
  width: 1280px;
}
.echarts{
  width: 900px;
  height: 360px;
  margin: 50px auto 0;
}
.systemSelect{
  clear: both;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #d2d1d1;
}
.systemSelect span.title{
  font-size: 16px;
}
.multiSelect{
  overflow: hidden;
}
.multiSelect li{
  float: left;
  padding: 8px 10px;
  font-size: 14px;
  border-radius: 8px;
  margin: 4px;
}
.multiSelect li:hover{
  cursor: pointer;
}
.multiSelect li.active{
  background: #20a0ff;
  color: #fff;
}
.el-radio-button{
  margin: 0 5px;
  border: none!important;
}
.addTags{
  clear: both;
}
.bgtr td{
  font-size: 14px!important;
}
</style>
