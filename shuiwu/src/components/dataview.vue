<template>
  <div class="dataviews" ref="contentHeight" v-loading="loading" element-loading-text="拼命加载中">
    <div class="dataviewsHeader">
      <div class="dataviewNavbar">
        <ul class="kinds">
          <li class="active" v-on:click="table($event)">表格显示</li>
          <li v-on:click="chart($event)">图表显示</li>
        </ul>
      </div>
    </div>
    <div class="select">
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">系统：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="systemId" @change="selectSystem">
               <el-radio-button :label="systemList.id"
               :key="systemList"
               v-for="(systemList, index) in systemLists">{{systemList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect" v-if="contentProvince">
        <el-select v-model="selectProvince" placeholder="请选择省份" @change="province">
          <el-option
            :key="province"
            v-for="(province, index) in provinces"
            :label="province.name"
            :value="province">
          </el-option>
        </el-select>
        <el-select v-model="selectCity" placeholder="请选择市" @change="city">
          <el-option
            :key="city"
            v-for="(city, index) in citys"
            :label="city.name"
            :value="city">
          </el-option>
        </el-select>
        <el-select v-model="selectArea" placeholder="请选择地区" @change="area">
          <el-option
            :key="area"
            v-for="(area, index) in areas"
            :label="area.name"
            :value="area">
          </el-option>
        </el-select>
      </div>

      <!-- 小区 -->
      <div class="systemSelect" v-if="contentLocation">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">小区：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectLocation" @change="location">
               <el-radio-button :label="location.id"
               :key="location"
               v-for="(location, index) in locations">{{location.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect" v-if="contentRoom">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">泵房：</span></el-col>
          <el-col :span="22">
            <el-radio-group  v-model="selectRoom" @change="room">
               <el-radio-button
               :key="room"
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
               <el-radio-button
               :key="controllerList"
               v-for="controllerList in controllerLists"
               :label="controllerList.groupId"
               >{{controllerList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <!-- 控制器列表 -->
      <div class="systemSelect" v-if="contentController">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">控制器：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="controllerInfo" @change="controllerSelect">
               <el-radio-button
               :key="controllerList"
               v-for="controllerList in deviceTermLists"
               :label="controllerList"
               >{{controllerList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <div class="systemSelect" v-if="contentMultiple">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <ul class="multiSelect">
              <li v-for="(multiSelect, index) in multiSelects" :value=index v-on:click="showActive($event)" >{{multiSelect.name}}</li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect" v-if="contentTime">
        <el-date-picker
           v-model="startTime"
           type="datetime"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-date-picker
           v-model="endTime"
           type="datetime"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <!-- <el-button type="primary">不限</el-button> -->
         <el-select v-model="dateQuery.timeStep" placeholder="请选择时间间隔">
             <el-option
               :key="time"
               v-for="(time, index) in times"
               :label=time.date
               :value=time.seconds>
             </el-option>
          </el-select>
      </div>
      <div v-if="tableShow">
        <div class="systemSelect" style="text-align:center;" v-if="contentMultiple">
            <el-button type="primary" @click="dateQueryClick">确定</el-button>
        </div>
        <table cellspacing="0" cellpadding="0" class="dateTable" v-if="tableDataShow">
          <tr class="bgth">
            <th>日期</th>
            <th>省市区</th>
            <th>小区</th>
            <th>房间名</th>
            <th v-for="table in tables">{{table.name}}</th>
          </tr>
          <tr v-for="(dateTable, index) in dateTables" class="bgtr">
            <td>{{dateTable.time | time}}</td>
            <td>{{dateTable.addressName}}</td>
            <td>{{dateTable.locationName}}</td>
            <td>{{dateTable.roomName}}</td>
            <td v-for="table in tables">{{dateTable.data[table.number].data}}</td>
          </tr>
        </table>
        <div style="text-align:center;margin-top:40px;" v-if="tableDataShow">
          <el-button type="primary" @click="moreData = true">查看更多数据</el-button>
          <el-button type="primary" @click="tableDatePrint">导出EXCEl表格</el-button>
        </div>
      </div>
      <el-dialog title="更多数据" v-model="moreData">
        <table cellspacing="0" cellpadding="0" class="dateTable">
          <tr class="bgth">
            <th>日期</th>
            <th>省市区</th>
            <th>小区</th>
            <th>房间名</th>
            <th v-for="table in tables">{{table.name}}</th>
          </tr>
          <tr v-for="(dateTable, index) in dateTables" class="bgtr">
            <td>{{dateTable.time | time}}</td>
            <td>{{dateTable.addressName}}</td>
            <td>{{dateTable.locationName}}</td>
            <td>{{dateTable.roomName}}</td>
            <td v-for="table in tables">{{dateTable.data[table.number].data}}</td>
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

      <!-- 图标添加 -->
      <div v-if="chartShow" style="width:1280px;margin:0 auto;">
        <div class="systemSelect" v-if="contentMultiple">
          <el-row :gutter="20">
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="22">
              <el-button type="primary" class="addTags" v-on:click="addTags">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="systemSelect" v-if="chartDate">
          <el-tag
            :key="tag"
            v-for="(tag, index) in tags"
            :closable="true"
            @close="closeTag(index)"
          >
          {{tag}}
          </el-tag>
          <div class="echarts">
            <IEcharts :option="bar" class="echarts" id="main"></IEcharts>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import global from '../global/global'
import axios from 'axios'
import Vue from 'vue'
import IEcharts from 'vue-echarts-v3'
var echarts = require('echarts')
Vue.component('IEcharts', IEcharts)
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableShow: true,
      chartShow: false,
      echart: false,
      tableDataShow: false,
      loading:false,
      contentProvince: false,
      contentLocation: false,
      contentRoom: false,
      contentDevice: false,
      contentController: false,
      contentTime: false,
      contentMultiple: false,
      chartDate: false,
      systemId: '0',
      system: '0',
      moreData: false,
      deviceTermId: null,
      deviceTermLists: [],
      times: [
        { date: '1秒', seconds: '1' },
        { date: '1分钟', seconds: '60' },
        { date: '1小时', seconds: '3600' },
        { date: '1天', seconds: '86400' }
      ],
      selectProvince: null,
      provinces: [],
      citys: [],
      selectCity: null,
      selectArea: null,
      areas: [],
      locations: [],
      selectLocation: null,
      rooms: [],
      selectRoom: null,
      selectController: null,
      multiSelects: [],
      tagShow: false,
      tags: [],
      bar: {
        title: {
          text: '图表显示'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        xAxis: {
          boundaryGap: false,
          data: []
        },
        yAxis: {},
        series: []
      },
      systemLists: [],
      controllerLists: [],
      controllerInfo: null,
      startTime: null,
      endTime: null,
      dateQuery: {
        deviceId: null,
        startTime: null,
        endTime: null,
        currentPage: 1,
        totalPage: -1,
        numberPerPage: 10,
        timeStep: null,
        token: global.getToken()
      },
      tables: [],
      dateTables: []
    }
  },
  methods: {
    table (obj) {
      this.tableShow = true
      this.chartShow = false
      document.querySelectorAll('.kinds li')[1].setAttribute('class', '')
      obj.target.setAttribute('class', 'active')
      this.changeEmpty()
      this.emptyFooter()
      this.contentLocation = false
      this.contentRoom = false
      this.contentDevice = false
      this.contentController = false
      this.contentProvince = false
      this.startTime = null
      this.endTime = null
      this.systemId = null
    },
    chart (obj) {
      this.tableShow = false
      this.chartShow = true
      this.systemId = null
      document.querySelectorAll('.kinds li')[0].setAttribute('class', '')
      obj.target.setAttribute('class', 'active')
      this.changeEmpty()
      this.emptyFooter()
      this.contentLocation = false
      this.contentRoom = false
      this.contentDevice = false
      this.contentController = false
      this.contentProvince = false
      this.startTime = null
      this.endTime = null
    },
    showActive (obj) {
      if (obj.target.className === 'active') {
        obj.target.setAttribute('class', '')
      } else {
        obj.target.setAttribute('class', 'active')
      }
    },
    // 系统筛选
    selectSystem () {
      this.selectProvince = null
      this.tableDataShow = false
      var self = this
      if (this.systemId) {
        axios.post(global.baseUrl + 'system/detailPack?systemId=' + this.systemId + '&token=' + global.getToken())
        .then((res) => {
          // console.log(res)
          self.changeEmpty()
          self.emptyFooter()
          self.citys = []
          self.areas = []
          self.contentLocation = false
          self.contentRoom = false
          self.contentDevice = false
          self.contentController = false
          self.contentProvince = true
          self.provinces = res.data.data.locationPack
        })
      }
    },
    changeEmpty () {
      this.selectLocation = null
      this.selectRoom = null
      this.deviceTermId = null
      this.controllerInfo = null
      this.locations = []
      this.rooms = []
      this.controllerLists = []
      this.deviceTermLists = []
      this.multiSelects = []
    },
    province () {
      this.tableDataShow = false
      if (this.selectProvince) {
        this.changeEmpty()
        this.areas = []
        this.contentLocation = false
        this.contentRoom = false
        this.contentDevice = false
        this.contentController = false
        this.contentTime = false
        this.contentMultiple = false
        this.citys = this.selectProvince.city
      }
      this.selectCity = null
      this.areas = []
      this.contentLocation = false
      this.contentRoom = false
      this.contentDevice = false
      this.contentController = false
      this.contentTime = false
      this.contentMultiple = false
    },
    city () {
      this.tableDataShow = false
      this.selectArea = null
      if (this.selectCity) {
        this.changeEmpty()
        this.areas = []
        this.contentLocation = false
        this.contentRoom = false
        this.contentDevice = false
        this.contentController = false
        this.contentTime = false
        this.contentMultiple = false
        this.areas = this.selectCity.area
      } else {
        this.areas = []
        this.contentLocation = false
        this.contentRoom = false
        this.contentDevice = false
        this.contentController = false
        this.contentTime = false
        this.contentMultiple = false
      }
    },
    area () {
      this.tableDataShow = false
      if (this.selectArea) {
        this.changeEmpty()
        this.contentLocation = true
        this.contentRoom = false
        this.contentDevice = false
        this.contentController = false
        this.contentTime = false
        this.contentMultiple = false
        this.emptyFooter()
        this.rooms = []
        this.locations = this.selectArea.location
      }
    },
    // 获取房间
    location () {
      this.tableDataShow = false
      var self = this
      this.rooms = []
      if (this.selectLocation) {
        axios.post(global.baseUrl + 'location/detail?locationId=' + this.selectLocation + '&token=' + global.getToken())
        .then((res) => {
          self.contentRoom = true
          self.contentDevice = false
          self.selectRoom = null
          self.deviceTermId = null
          self.contentController = false
          self.emptyFooter()
          self.rooms = res.data.data.room
        })
      }
    },
    // 泵房选择
    room () {
      this.tableDataShow = false
      var roomMsg = {
        roomId: this.selectRoom,
        token: global.getToken()
      }
      var self = this
      if (this.selectRoom) {
        axios.get(global.baseUrl + 'room/groupList?' + global.getHttpData(roomMsg))
        .then((res) => {
          self.contentDevice = true
          self.deviceTermId = null
          self.contentController = false
          self.emptyFooter()
          self.controllerLists = res.data.data
        })
      }
    },
    emptyFooter () {
      this.contentTime = false
      this.contentMultiple = false
      this.controllerInfo = null
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
      this.tables = []
      this.loading = true
      if (this.startTime && this.endTime) {
        var actives = document.querySelectorAll('.multiSelect li.active')
        for (var i in actives) {
          if (actives[i].innerHTML !== undefined) {
            var tableObj = {
              name: actives[i].innerHTML,
              number: actives[i].getAttribute('value')
            }
            this.tables.push(tableObj)
          }
        }
        this.dateQuery.startTime = this.timeFilter(this.startTime)
        this.dateQuery.endTime = this.timeFilter(this.endTime)
        var self = this
        axios.get(global.baseUrl + 'data/query?' + global.getHttpData(this.dateQuery))
        .then((res) => {
          if (res.data.callStatus === 'SUCCEED') {
            this.loading = false
            if (res.data.data.length) {
              self.tableDataShow = true
              self.dateTables = res.data.data
              self.dateQuery.totalPage = res.data.totalPage
              self.dateQuery.currentPage = res.data.currentPage
            } else {
              alert('该时间段没有数据,重新输入时间')
              self.startTime = null
              self.endTime = null
            }
          }
        })
      } else {
        alert('请选择时间')
        this.loading = false
      }
    },
    // 导出excel
    tableDatePrint () {
      this.tables = []
      var actives = document.querySelectorAll('.multiSelect li.active')
      for (var i in actives) {
        if (actives[i].innerHTML !== undefined) {
          var tableObj = {
            name: actives[i].innerHTML,
            number: actives[i].getAttribute('value')
          }
          this.tables.push(tableObj)
        }
      }
      this.dateQuery.startTime = this.timeFilter(this.startTime)
      this.dateQuery.endTime = this.timeFilter(this.endTime)
      // var self = this
      axios.get(global.baseUrl + 'data/outputExcel?' + global.getHttpData(this.dateQuery))
      .then((res) => {
        window.location.href = res.config.url
      })
    },
    // 选择控制器组
    selectControllerId () {
      this.tableDataShow = false
      var self = this
      if (this.deviceTermId) {
        axios.get(global.baseUrl + 'room/groupDetail?groupId=' + this.deviceTermId + '&token=' + global.getToken())
        .then((res) => {
          self.contentController = true
          self.emptyFooter()
          self.deviceTermLists = res.data.data.devices
        })
      }
    },
    // 选择控制器
    controllerSelect () {
      this.tableDataShow = false
      if (this.controllerInfo) {
        this.dateQuery.deviceId = this.controllerInfo.id
        var self = this
        axios.post(global.baseUrl + 'deviceTerm/detail?deviceTermId=' + this.controllerInfo.termId + '&token=' + global.getToken())
        .then((resource) => {
          if (resource.data.callStatus === 'SUCCEED') {
            self.contentTime = true
            self.contentMultiple = true
            self.multiSelects = resource.data.data.fields
          }
        })
      }
    },
    // 增加标签
    addTags () {
      if (this.startTime && this.endTime) {
        const self = this
        self.bar.legend.data = self.tags
        self.tables = []
        var actives = document.querySelectorAll('.multiSelect li.active')
        for (var n in actives) {
          if (actives[n].innerHTML !== undefined) {
            var tableObj = {
              name: actives[n].innerHTML,
              number: actives[n].getAttribute('value')
            }
            self.tables.push(tableObj)
          }
        }
        this.dateQuery.startTime = this.timeFilter(this.startTime)
        this.dateQuery.endTime = this.timeFilter(this.endTime)
        axios.get(global.baseUrl + 'data/query?' + global.getHttpData(this.dateQuery))
        .then((res) => {
          if (res.data.data.length) {
            self.changeEmpty()
            self.emptyFooter()
            self.contentLocation = false
            self.contentRoom = false
            self.contentDevice = false
            self.contentController = false
            self.contentProvince = false
            self.chartDate = true
            // 横坐标时间
            if (self.bar.xAxis.data.length === 0) {
              for (let timeIndex in res.data.data) {
                self.bar.xAxis.data.push(self.timeFilter(new Date(res.data.data[timeIndex].time)))
              }
            }
            self.empty()
            for (let m in self.tables) {
              var obj = {
                name: '',
                type: 'line',
                data: []
              }
              for (let index in res.data.data) {
                obj.name = res.data.data[0].roomName + self.tables[m].name
                obj.data.push(res.data.data[index].data[self.tables[m].number].value)
              }
              self.tags.push(obj.name)
              self.bar.series.push(obj)
              // console.log(self.bar.series)
            }
            var myChart = echarts.init(document.getElementById('main'))
            myChart.setOption(self.bar)
          } else {
            alert('该时间段没有数据,重新输入时间')
            self.startTime = null
            self.endTime = null
          }
        })
      } else {
        alert('请选择时间')
      }
    },
    // 初始化函数
    empty () {
      this.systemId = null
      this.selectLocation = null
      this.selectRoom = null
      this.deviceTermId = null
      this.controllerInfo = null
      this.locations = []
      this.rooms = []
      this.controllerLists = []
      this.deviceTermLists = []
      this.multiSelects = []
    },
    // 删除标签
    closeTag (index) {
      this.tags.splice(index, 1)
      this.bar.series.splice(index, 1)
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption(this.bar)
    },
    // 分页
    currentPageChange (value) {
      this.dateQuery.currentPage = value
      this.dateQueryClick(this.dateQuery)
    }
  },
  created () {
    var self = this
    // 系统列表
    axios.post(global.baseUrl + 'system/list', global.postHttpDataWithToken())
    .then((res) => {
      self.systemLists = res.data.data
    })
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
.echarts{
  width: 400px;
  height: 400px;
}
.bgtr td:nth-child(1){
  border-left: 1px solid rgb( 220, 220, 220 );
}
.bgtr td{
  border-right: 1px solid rgb( 220, 220, 220 );
  border-bottom: 1px solid rgb( 220, 220, 220 );
  font-size: 14px;
}
.dateTable{
  width: 100%;
  text-align: center;
}
.dateTable tr th:nth-child(1),.dateTable tr td:nth-child(1){
  width: 15%
}
.dateTable tr th:nth-child(2),.dateTable tr td:nth-child(2){
  width: 15%
}
.dateTable tr th:nth-child(3),.dateTable tr td:nth-child(3){
  width: 10%
}
.dateTable tr th:nth-child(4),.dateTable tr td:nth-child(4){
  width: 10%
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
