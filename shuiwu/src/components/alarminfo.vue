<template>
  <div class="dataviews">
    <!-- <v-header></v-header>
    <v-navbar></v-navbar> -->
    <div class="dataviewsHeader">
      <!-- <div class="dataviewLogin">
        <a href="javascript:;"><img src="../images/login_03.png" alt=""></a>
      </div> -->
      <div class="dataviewNavbar">
        <ul class="kinds">
          <li class="active" v-on:click="table($event)">表格显示</li>
          <li v-on:click="chart($event)">图表显示</li>
        </ul>
      </div>
    </div>
    <div class="select" v-show="tableShow">
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">系统：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectSystem">
               <el-radio-button label="9">全部</el-radio-button>
               <el-radio-button label="0">水厂监测</el-radio-button>
               <el-radio-button label="1">二次供水</el-radio-button>
               <el-radio-button label="2">加压泵站</el-radio-button>
               <el-radio-button label="3">管网检测</el-radio-button>
               <el-radio-button label="4">污水处理</el-radio-button>
               <el-radio-button label="5">生产调度</el-radio-button>
               <el-radio-button label="6">水利模型</el-radio-button>
               <el-radio-button label="7">数据分析</el-radio-button>
               <el-radio-button label="8">报警记录</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-select v-model="selectProvince" placeholder="请选择省份" @change="province">
          <el-option
            :key="province"
            v-for="province in provinces"
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
            <el-radio-group v-model="system">
               <el-radio-button label="0" style="border:none">小区0</el-radio-button>
               <el-radio-button label="1">小区1</el-radio-button>
               <el-radio-button label="2">小区2</el-radio-button>
               <el-radio-button label="3">小区3</el-radio-button>
               <el-radio-button label="4">小区4</el-radio-button>
               <el-radio-button label="5">小区5</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectRoom">
               <el-radio-button
               :key="room"
               v-for="(room, index) in rooms" :label="index">{{room}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">控制器：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectController">
               <el-radio-button label="4">全部</el-radio-button>
               <el-radio-button label="0">管网叠压</el-radio-button>
               <el-radio-button label="1">户外叠压</el-radio-button>
               <el-radio-button label="2">水箱变频</el-radio-button>
               <el-radio-button label="3">箱式叠压</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-date-picker
           v-model="startTime"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-date-picker
           v-model="beginTime"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-button type="primary">不限</el-button>
         <el-select v-model="timeInterval" placeholder="请选择时间间隔">
             <el-option
               :key="time"
               v-for="(time, index) in times"
               :label=time
               :value=index>
             </el-option>
          </el-select>
      </div>
      <!-- <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <ul class="multiSelect">
              <li v-for="(multiSelect, index) in multiSelects" :value=index v-on:click="showActive($event)" >{{multiSelect}}</li>
            </ul>
          </el-col>
        </el-row>
      </div> -->
      <div class="systemSelect" style="text-align:center">
          <el-button type="primary">确定</el-button>
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
    <!-- 图表显示 -->
    <div class="select" v-show="chartShow">
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">系统：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectSystem"
               <el-radio-button label="9">全部</el-radio-button>
               <el-radio-button label="0">水厂监测</el-radio-button>
               <el-radio-button label="1">二次供水</el-radio-button>
               <el-radio-button label="2">加压泵站</el-radio-button>
               <el-radio-button label="3">管网检测</el-radio-button>
               <el-radio-button label="4">污水处理</el-radio-button>
               <el-radio-button label="5">生产调度</el-radio-button>
               <el-radio-button label="6">水利模型</el-radio-button>
               <el-radio-button label="7">数据分析</el-radio-button>
               <el-radio-button label="8">报警记录</el-radio-button>
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
        <el-select v-model="selectArea" placeholder="请选择地区">
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
            <el-radio-group v-model="system">
               <el-radio-button label="0">小区0</el-radio-button>
               <el-radio-button label="1">小区1</el-radio-button>
               <el-radio-button label="2">小区2</el-radio-button>
               <el-radio-button label="3">小区3</el-radio-button>
               <el-radio-button label="4">小区4</el-radio-button>
               <el-radio-button label="5">小区5</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectRoom">
               <el-radio-button
               :key="room"
               v-for="(room, index) in rooms" :label="index">{{room}}</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2"><span class="title">控制器：</span></el-col>
          <el-col :span="22">
            <el-radio-group v-model="selectController">
               <el-radio-button label="4">全部</el-radio-button>
               <el-radio-button label="0">管网叠压</el-radio-button>
               <el-radio-button label="1">户外叠压</el-radio-button>
               <el-radio-button label="2">水箱变频</el-radio-button>
               <el-radio-button label="3">箱式叠压</el-radio-button>
             </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div class="systemSelect">
        <el-date-picker
           v-model="startTime"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-date-picker
           v-model="beginTime"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
         <span> —— </span>
         <el-button type="primary">不限</el-button>
         <el-select v-model="timeInterval" placeholder="请选择时间间隔">
            <el-option
              :key="time"
              v-for="(time, index) in times"
              :label=time
              :value=index>
            </el-option>
          </el-select>
      </div>
      <div class="systemSelect">
        <el-row :gutter="20">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22">
            <!-- <ul class="multiSelect tableMulits">
              <li v-for="(multiSelect, index) in multiSelects" :value=index v-on:click="showActive($event)" >{{multiSelect}}</li>
            </ul> -->
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
          <echarts
              :options="option"
              :legendShow=multiSelects
              type="line"
              className="first-echarts">
          </echarts>
        </div>
      </div>
    </div>
    <!-- <v-footer></v-footer> -->
  </div>
</template>

<script>
// import header from './common/header'
// import footer from './common/footer'
// import navbar from './common/navbar'
import Echarts from 'vue-echarts3'
import Vue from 'vue'
import global from '../global/global'
import axios from 'axios'
Vue.component('echarts', Echarts)
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableShow: true,
      chartShow: false,
      echart: false,
      selectSystem: '0',
      system: '0',
      startTime: '',
      beginTime: '',
      timeInterval: '',
      moreData: false,
      times: ['1秒', '1分钟', '1小时', '1天'],
      selectProvince: '',
      provinces: [],
      selectArea: '',
      citys: [],
      selectCity: '',
      selectRoom: '',
      rooms: ['101', '102', '103', '104', '105'],
      selectController: '',
      areas: '',
      multiSelects: ['全部', '泵前压力', '泵后压力', '1#泵状态', '2#泵状态', '3#泵状态', '4#泵状态', '5#泵状态', '6#泵状态', '7#泵状态', '8#泵状态', '其他故障信号', '电机电流Ia', '电机电流Ib', '电机电流Ic', '电机电压Ua', '电机电压Ub', '电机电压Uc', '1#变频器频率', '2#变频器频率', '3#变频器频率', '4#变频器频率', '5#变频器频率', '6#变频器频率', '7#变频器频率', '8#变频器频率', '水箱水位', '出口流量', '累积流量低位', '累计流量高位', '累计电量低位', '累计电量高位', '远程切换自动/手动(手动时可以远程启停水泵)', '远程启停水泵1#', '远程启停水泵2#', '远程启停水泵3#', '远程启停水泵4#', '远程启停水泵5#', '远程启停水泵6#', '远程启停水泵7#', '远程启停水泵8#', '远程开灯'],
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
          data: ['邮件营销']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
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
    selectSystem: function () {
      console.log(this.selectSystem)
    },
    province: function () {
      global.province(this)
    },
    city () {
      global.city(this)
    },
    area: function () {
      global.area(this)
    },
    addTags () {
      var lis = document.querySelectorAll('.tableMulits li')
      this.tags = []
      var data0 = this.option.series
      var data1 = this.option.legend.data
      for (let i = 0; i < lis.length; i++) {
        if (lis[i].getAttribute('class') === 'active') {
          this.tags.push(lis[i].innerHTML)
          data1.push(lis[i].innerHTML)
          var obj = {
            name: lis[i].innerHTML,
            type: 'line',
            areaStyle: { normal: {} },
            data: [ 200, 50, 401, 502, 602, 0, 15 ]
          }
          data0.push(obj)
        }
      }
      if (this.tags.length !== 0) {
        this.tagShow = true
        this.echart = true
      }
    }
  },
  created () {
    var self = this
    axios.post(global.baseUrl + 'area/provinces')
    .then(function (res) {
      // console.log(res)
      self.provinces = res.data.data
    })
  }
  // components: {
  //   'v-header': header,
  //   'v-footer': footer,
  //   'v-navbar': navbar
  // }
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
