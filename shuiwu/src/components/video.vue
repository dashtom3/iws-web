<template>
  <div class="videoWrap">
    <div class="addMyVideoBtn">
      <el-button @click="addMyVideoCont()" type="text">添加视频监控</el-button>
      <el-button @click="deleteMyVideoCont()" type="text">删除视频监控</el-button>
    </div>
    <el-dialog title="添加视频监控" :visible.sync="dialogTableVisible" size="large">
      <div class="selectOne">
        <!-- 系统 -->
        <p class="selectTitle">请选择系统</p>
        <el-select placeholder="请选择" v-model="system" @change="systemChange">
          <el-option  v-for="(system,index) in systems"  :key="system.name"  :label="system.name"  :value="system"></el-option>
        </el-select>
      </div>
      <div class="selectOne">
        <!-- 省区 -->
        <p class="selectTitle">请选择省区</p>
        <el-select placeholder="请选择" v-model="province" @change="provinceChange" :disabled="provinces.length==0">
          <el-option  v-for="(province,index) in provinces"  :key="province.name"  :label="province.name"  :value="province"></el-option>
        </el-select>
      </div>
      <div class="selectOne">
        <!-- 市 -->
        <p class="selectTitle">请选择市区</p>
        <el-select placeholder="请选择" v-model="city" @change="cityChange" :disabled="citys.length==0">
          <el-option  v-for="(city,index) in citys"  :key="city.name"  :label="city.name"  :value="city"></el-option>
        </el-select>
      </div>
      <div class="selectOne">
        <!-- 区 -->
        <p class="selectTitle">请选择区域</p>
        <el-select placeholder="请选择" v-model="area" @change="ariaChange" :disabled="arias.length==0">
          <el-option  v-for="(aria,index) in arias"  :key="aria.name"  :label="aria.name"  :value="aria"></el-option>
        </el-select>
      </div>
      <div class="selectOne">
        <!-- last -->
        <p class="selectTitle">请选择地点</p>
        <el-select placeholder="请选择" v-model="last" @change="lastChange" :disabled="lasts.length==0">
          <el-option  v-for="(last,index) in lasts"  :key="last.name"  :label="last.name"  :value="last"></el-option>
        </el-select>
      </div>
      <div  v-if="tableData.length!=0">
        <el-table  :data="tableData"  style="width: 100%">
          <el-table-column  label="位置"    width="180">
            <template scope="scope">
              {{scope.row.provinceName+scope.row.cityName+scope.row.areaName}}
            </template>
          </el-table-column>
          <el-table-column  prop="name"   label="名字"    >  </el-table-column>
          <el-table-column  prop="ip"   label="ip地址"    >  </el-table-column>
          <el-table-column  prop="port"   label="端口"    >  </el-table-column>
          <el-table-column  label="操作"    >
            <template scope="scope">
              <el-button @click="addThisVideoToSelf(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="删除视频监控" :visible.sync="deleMyVideoListWrap" size="large">
        <el-table  :data="videoList"  style="width: 100%">
          <el-table-column  label="位置"    width="180">
            <template scope="scope">
              {{scope.row.provinceName+scope.row.cityName+scope.row.areaName}}
              <div>{{scope.row.locationName}}</div>
            </template>
          </el-table-column>
          <el-table-column  prop="name"   label="名字"    >  </el-table-column>
          <el-table-column  prop="ip"   label="ip地址"    >  </el-table-column>
          <el-table-column  prop="port"   label="端口"    >  </el-table-column>
          <el-table-column  label="操作"    >
            <template scope="scope">
              <el-button type="danger" @click="deleThisVideoToSelf(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
    <div class=""  v-if="showAllVideo">
      <div class="oneIframe" v-for="(video,index) in videoList" :key="video">
        <div class="positionInfo">
          <span>{{video.provinceName}}&nbsp;</span><span>{{video.cityName}}&nbsp;</span><span>{{video.areaName}}&nbsp;</span><span>{{video.locationName}}&nbsp;</span>
        </div>
        <iframe  :src="'static/demo/cn/demo.html?ip='+video.ip+'&&port='+video.port+'&&user='+video.username+'&&pwd='+video.password" style="width:100%;height:100%;border:none" name="myIfram"  scrolling="yes"></iframe>
      </div>
      <div style="clear:both"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
import global from '../global/global'
import axios from 'axios'
export default {
  data () {
    return {
      plugInde:false,
      deleMyVideoListWrap:false,
      showAllVideo:true,
      system:"",
      systemIndex:null,
      province:"",
      provinceIndex:null,
      city:"",
      cityIndex:null,
      area:"",
      areaIndex:null,
      last:"",
      lastIndex:null,
      dialogTableVisible:false,
      videoList:[],
      systems:[],
      provinces:[],
      citys:[],
      arias:[],
      lasts:[],
      tableData:[],
    }
  },
  created () {
    this.getVideoLists()
    this.getSelfVideoList()
    // if(sessionStorage.getItem("alertOnec")){
    //   this.plugInde = false;
    // }else{
    //   this.plugInde = true;
    // }
  },
  watch:{
    dialogTableVisible:function(){
      this.showAllVideo = !this.dialogTableVisible;
    },
  },
  methods: {
    getSelfVideoList:function(){
      var that = this;
      global.apiGet(this,global.baseUrl + 'hikvision/list?token=' + global.getToken())
      .then((res) => {
        console.log(res,"getSelfVideoList")
        that.videoList = res.data.data;
      })
    },
    deleThisVideoToSelf:function(index,row){
       var that = this;
      var obj = {
        hikId:row.id
      };
      global.apiPost(this,global.baseUrl + 'hikvision/deleteHikFromUser',global.postHttpDataWithToken(obj))
      .then((res) => {
        console.log(res,"deleThisVideoToSelf232222222222")
        if (res.data.callStatus === 'SUCCEED') {
          this.$alert('添加成功',  {confirmButtonText: '确定',});
          this.dialogTableVisible = false;
          this.getSelfVideoList();
        }else{
          this.$alert('失败',  {confirmButtonText: '确定',});
        }
      })
    },
    addThisVideoToSelf:function(index,row){
      var that = this;
      var obj = {
        hikId:row.id
      };
      global.apiPost(this,global.baseUrl + 'hikvision/addHikToUser',global.postHttpDataWithToken(obj))
      .then((res) => {
        console.log(res,"addThisVideoToSelf1111111111111111111")
        if (res.data.callStatus === 'SUCCEED') {
          this.$alert('添加成功',  {confirmButtonText: '确定',});
          this.dialogTableVisible = false;
          this.getSelfVideoList();
        }else{
          this.$alert('添加失败',  {confirmButtonText: '确定',});
        }
      })
    },
    systemChange:function(system){
      this.provinces = system.locationPack;
    },
    provinceChange:function (province) {
      this.citys = province.city;
    },
    cityChange:function(city){
      this.arias = city.area;
    },
    ariaChange:function(aria){
      this.lasts = aria.location;
    },
    lastChange:function(last){
      global.apiGet(this,global.baseUrl + 'hikvision/query?locationId='+last.id+'&token=' + global.getToken())
      .then((res) => {
        console.log(res)
        this.tableData = res.data.data
      })
    },
    deleteMyVideoCont:function(){
      this.deleMyVideoListWrap = true;
    },
    addMyVideoCont:function(){
      var that = this;
      that.dialogTableVisible = true;
    },
    getVideoLists () {
      var self = this;
      var obj = {};
      var token = global.getToken()
      console.log(token)
      global.apiPost(this,global.baseUrl + 'system/listPack',global.postHttpDataWithToken(obj))
      .then((res) => {
        console.log(res,"getVideoLists")
        if (res.data.callStatus === 'SUCCEED') {
          self.systems = res.data.data;
        }else{
          // self.$alert("网络出错")
        }
      })
    }

  }
}
</script>
<style media="screen">
li{
  line-height: 40px;
  cursor: pointer;
}
.addMyVideoBtn{
  text-align: right;
  padding-right: 20px;
}
.videoWrap{
  border: 1px solid #0f150b;
  border-bottom: none;
  width: 1200px;
  margin: auto;
}
.selectOne{
  margin:  20px;
  /*margin-bottom: 0;*/
  width: 210px;
  float: left;
}
.selectOne .selectTitle{
  line-height: 30px;
}
.oneIframe{
  width: 399px;
  height: 300px;
  float: left;
  margin-bottom: 1px;
  overflow: hidden;
  position: relative;
}
.oneIframe .positionInfo{
  position: absolute;
  right: 10px;
  border-bottom: 10px;
  z-index: 1000;
}
.oneIframe .left .plugin{
  margin-left: 20px;
}
.oneIframe:nth-child(2n+1){
}
.oneIframe:nth-child(1){
  /*margin-left: -18px;*/
}
</style>
