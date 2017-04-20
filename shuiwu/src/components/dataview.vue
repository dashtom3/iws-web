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
            <el-radio-group v-model="dateQuery.deviceId">
               <el-radio-button label="0"
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
           v-model="dateQuery.startTime"
           type="datetime"
           placeholder="选择日期"
           @change="selectTimeStart">
         </el-date-picker>
         <span> —— </span>
         <el-date-picker
           v-model="dateQuery.endTime"
           type="datetime"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-button type="primary">不限</el-button>
         <el-select v-model="dateQuery.timeStep" placeholder="请选择时间间隔" @change="selcetTime">
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
              <li v-for="(multiSelect, index) in multiSelects" :value=index v-on:click="showActive($event)" >{{multiSelect}}</li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div v-show="tableShow">
        <div class="systemSelect" style="text-align:center;">
            <el-button type="primary" @click="dateQueryClick">确定</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="address"
            label="其他故障">
          </el-table-column>
          <el-table-column
            prop="address"
            label="其他故障">
          </el-table-column>
          <el-table-column
            prop="address"
            label="其他故障">
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:40px;">
          <el-button type="primary" @click="moreData = true">查看更多数据</el-button>
        </div>
      </div>
      <el-dialog title="更多数据" v-model="moreData">
        <el-table :data="tableData">
          <el-table-column property="date" label="日期" width="150"></el-table-column>
          <el-table-column property="name" label="姓名" width="200"></el-table-column>
          <el-table-column property="address" label="其他故障"></el-table-column>
        </el-table>
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
            v-show="tagShow"
            v-for="tag in tags"
            :closable="true"
          >
          {{tag}}
          </el-tag>
          <div class="echarts">
             <IEcharts :option="option" :legendShow="option.legend.data" type="line" ></IEcharts>
           </div>
        </div>
      </div>

  </div>
</template>

<script>
import global from '../global/global'
import axios from 'axios'
import Echarts from 'vue-echarts3'
import Vue from 'vue'
// import IEcharts from 'vue-echarts-v3'
Vue.component('IEcharts', Echarts)
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
      multiSelects: ['泵前压力', '泵后压力', '1#泵状态', '2#泵状态', '3#泵状态', '4#泵状态', '5#泵状态', '6#泵状态', '7#泵状态', '8#泵状态', '其他故障信号', '电机电流Ia', '电机电流Ib', '电机电流Ic', '电机电压Ua', '电机电压Ub', '电机电压Uc', '1#变频器频率', '2#变频器频率', '3#变频器频率', '4#变频器频率', '5#变频器频率', '6#变频器频率', '7#变频器频率', '8#变频器频率', '水箱水位', '出口流量', '累积流量低位', '累计流量高位', '累计电量低位', '累计电量高位', '远程切换自动/手动(手动时可以远程启停水泵)', '远程启停水泵1#', '远程启停水泵2#', '远程启停水泵3#', '远程启停水泵4#', '远程启停水泵5#', '远程启停水泵6#', '远程启停水泵7#', '远程启停水泵8#', '远程开灯'],
      tableData: [{
        date: '2016-05-02',
        name: '1',
        address: '不知道'
      }, {
        date: '2016-05-04',
        name: '2',
        address: '不知道'
      }, {
        date: '2016-05-01',
        name: '3',
        address: '不知道'
      }, {
        date: '2016-05-03',
        name: '4',
        address: '不知道'
      }],
      tagShow: false,
      tags: [],
      option: {
        legend: {
          data: []
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        },
        series: []
      },
      systemLists: [],
      controllerLists: [],
      dateQuery: {
        deviceId: null,
        startTime: null,
        endTime: null,
        timeStep: null,
        token: localStorage.token
      }
    }
  },
  methods: {
    table (obj) {
      this.tableShow = true
      this.chartShow = false
      document.querySelectorAll('.kinds li')[1].setAttribute('class', '')
      obj.target.setAttribute('class', 'active')
    },
    timeBegin () {
      console.log(this.startTime)
    },
    selcetTime () {
      console.log(this.timeInterval)
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
      axios.post(global.baseUrl + 'customer/system/detailPack?systemId=' + this.systemId + '&token=' + localStorage.token)
      .then((res) => {
        console.log(res)
        self.provinces = res.data.data.locationPack
      })
    },
    province () {
      console.log(this.selectProvince.city)
      this.citys = this.selectProvince.city
    },
    city () {
      this.selectArea = null
      this.areas = this.selectCity.area
    },
    area () {
      // console.log(this.selectArea)
      this.locations = this.selectArea.location
    },
    location () {
      console.log(this.selectLocation)
      var self = this
      axios.post(global.baseUrl + 'location/detail?locationId=' + this.selectLocation + '&token=' + localStorage.token)
      .then((res) => {
        // console.log(res)
        self.rooms = res.data.data.room
      })
      // this.rooms = this.selctLocation.room
    },
    selectTimeStart () {
      console.log(this.timeFilter(this.dateQuery.startTime))
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
      console.log(123)
      this.dateQuery.startTime = this.timeFilter(this.dateQuery.startTime)
      this.dateQuery.endTime = this.timeFilter(this.dateQuery.endTime)
      axios.get(global.baseUrl + 'data/query?' + global.getHttpData(this.dateQuery))
      .then((res) => {
        console.log(res)
      })
    },
    addTags () {
      // var lis = document.querySelectorAll('.tableMulits li')
      // console.log(lis)
      this.tags = []
      // this.data.series = []
      // {
      //   name: '泵前压力',
      //   type: 'line',
      //   areaStyle: { normal: {} },
      //   data: [ 320, 332, 301, 334, 390, 330, 2 ]
      // },
      // var data0 = this.option.series
      // var data1 = this.option.legend.data
      // for (let i = 0; i < lis.length; i++) {
      //   if (lis[i].getAttribute('class') === 'active') {
      //     this.tags.push(lis[i].innerHTML)
      //     data1.push(lis[i].innerHTML)
      //     var obj = {
      //       name: lis[i].innerHTML,
      //       type: 'line',
      //       areaStyle: { normal: {} },
      //       data: [ 200, 50, 401, 502, 602, 0, 15 ]
      //     }
      //     data0.push(obj)
      //   }
      // }
      const that = this
      let data = []
      for (let i = 0, min = 5, max = 99; i < 7; i++) {
        data.push(Math.floor(Math.random() * (max + 1 - min) + min))
      }
      var obj = {
        name: '价格',
        type: 'line',
        data: data
      }
      that.option.series.push(obj)
      that.option.legend.data.push(obj.name)
      // if (this.tags.length !== 0) {
      //   this.tagShow = true
      //   this.echart = true
      // }
    }
  },
  created () {
    var self = this
    // 系统列表
    axios.post(global.baseUrl + 'customer/system/list')
    .then((res) => {
      console.log(res)
      self.systemLists = res.data.data
    })
    // 控制器列表
    axios.post(global.baseUrl + 'deviceTerm/list?token=' + localStorage.token)
    .then((res) => {
      console.log(res)
      self.controllerLists = res.data.data
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
  margin: 0 auto;
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
