<template>
  <div class="dataviews">
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
      <div class="systemSelect">
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
      <div class="systemSelect">
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
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <el-radio-group  v-model="selectRoom">
               <el-radio-button
               :key="room"
               v-for="(room, index) in rooms" :label="room.id">{{room.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">控制器：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="dateQuery.deviceId" @change="selectControllerId">
               <el-radio-button
               :key="controllerList"
               v-for="controllerList in controllerLists"
               :label="controllerList.id"
               >{{controllerList.name}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
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
         <el-button type="primary">不限</el-button>
         <el-select v-model="dateQuery.timeStep" placeholder="请选择时间间隔">
             <el-option
               :key="time"
               v-for="(time, index) in times"
               :label=time.date
               :value=time.seconds>
             </el-option>
          </el-select>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <ul class="multiSelect">
              <li v-for="(multiSelect, index) in multiSelects" :value=index v-on:click="showActive($event)" >{{multiSelect.name}}</li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div v-show="tableShow">
        <div class="systemSelect" style="text-align:center;">
            <el-button type="primary" @click="dateQueryClick">确定</el-button>
        </div>
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
        <div style="text-align:center;margin-top:40px;">
          <el-button type="primary" @click="moreData = true">查看更多数据</el-button>
          <el-button type="primary" >导出EXCEl表格</el-button>
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
      </el-dialog>
      </div>

      <!-- 图标添加 -->
      <div v-show="chartShow" style="width:1280px;margin:0 auto;">
        <div class="systemSelect">
          <el-row :gutter="20">
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="22">
              <el-button type="primary" class="addTags" v-on:click="addTags">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="systemSelect">
          <el-tag
            :key="tag"
            v-for="(tag, index) in tags"
            :closable="true"
            @close="closeTag(index)"
          >
          {{tag}}
          </el-tag>
          <div class="echarts">
            <echarts
                :title="{'text':'标题'}"
                :options="options"
                type="line"
                className="echarts">
            </echarts>
           </div>
        </div>
      </div>

  </div>
</template>

<script>
import global from '../global/global'
import axios from 'axios'
import Vue from 'vue'
import Echarts from 'vue-echarts3'
Vue.component('chart', Echarts)
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableShow: true,
      chartShow: false,
      echart: false,
      systemId: '0',
      system: '0',
      moreData: false,
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
      options: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: []
        // series: [{
        //   name: '邮件营销',
        //   type: 'line',
        //   data: [50, 200, 6, 100, 100, 20]
        // }, {
        //   name: '联盟广告',
        //   type: 'line',
        //   data: [500, 20, 306, 100, 10, 120]
        // }, {
        //   name: '视频广告',
        //   type: 'line',
        //   data: [5, 20, 36, 10, 10, 20]
        // }]
      },
      systemLists: [],
      controllerLists: [],
      startTime: null,
      endTime: null,
      dateQuery: {
        deviceId: null,
        startTime: null,
        endTime: null,
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
      axios.post(global.baseUrl + 'customer/system/detailPack?systemId=' + this.systemId + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        self.provinces = res.data.data.locationPack
      })
    },
    province () {
      if (this.selectProvince) {
        this.citys = this.selectProvince.city
      }
      this.selectCity = null
    },
    city () {
      this.selectArea = null
      if (this.selectCity) {
        this.areas = this.selectCity.area
      }
    },
    area () {
      console.log(this.selectArea)
      if (this.selectArea) {
        this.locations = this.selectArea.location
      }
    },
    // 获取房间
    location () {
      var self = this
      axios.post(global.baseUrl + 'location/detail?locationId=' + this.selectLocation + '&token=' + global.getToken())
      .then((res) => {
        self.rooms = res.data.data.room
      })
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
        console.log(res)
        self.dateTables = res.data.data
      })
    },
    // 选择控制器
    selectControllerId () {
      var self = this
      axios.post(global.baseUrl + 'deviceTerm/detail?deviceTermId=' + this.dateQuery.deviceId + '&token=' + global.getToken())
      .then((res) => {
        self.multiSelects = res.data.data.fields
      })
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
      // console.log(this.tags)
      this.options.series = [
        {
          name: '邮件营销',
          type: 'line',
          data: [50, 200, 6, 100, 100, 20]
        }
      ]
      console.log(this.options)
    },
    // 删除标签
    closeTag (index) {
      this.tags.splice(index, 1)
    }
  },
  created () {
    var self = this
    // 系统列表
    axios.post(global.baseUrl + 'customer/system/list', global.postHttpDataWithToken())
    .then((res) => {
      self.systemLists = res.data.data
    })
    // 控制器列表
    axios.post(global.baseUrl + 'deviceTerm/list', global.postHttpDataWithToken())
    .then((res) => {
      // console.log(res)
      self.controllerLists = res.data.data
    })
    // 城市列表
    axios.post(global.baseUrl + 'area/areas')
    .then((res) => {
      // console.log(res)
      self.provinces = res.data.data
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
</style>
