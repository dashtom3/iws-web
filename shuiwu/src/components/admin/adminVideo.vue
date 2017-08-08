<template>
  <div class="base">
    <div class="addController">
      <el-button type="primary" v-on:click="addBaseAlert = true">添加</el-button>
    </div>
    <!-- 添加设备 -->
    <el-dialog :title="addBaseAlertTitle" v-model="addBaseAlert">
      <div class="addOneVideoWrap">
        <el-form label-position="right" label-width="100px" :model="formLabelAlign" :rules="formLabelAlignRules" ref="formLabelAlign">
          <el-form-item label="名字" prop="name">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="系统" prop="system">
            <template scope='scope'>
              <el-select placeholder="请选择" v-model="formLabelAlign.system" @change="systemChange">
                <el-option  v-for="(system,index) in systems"  :key="system.name"  :label="system.name"  :value="system"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="省区" prop="province">
            <template scope='scope'>
              <el-select placeholder="请选择" v-model="formLabelAlign.province" @change="provinceChange" >
                <el-option  v-for="(province,index) in provinces"  :key="province.name"  :label="province.name"  :value="province"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="市区" prop="city">
            <template scope='scope'>
              <el-select placeholder="请选择" v-model="formLabelAlign.city" @change="cityChange" >
                <el-option  v-for="(city,index) in citys"  :key="city.name"  :label="city.name"  :value="city"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="区域" prop="area">
            <template scope='scope'>
              <el-select placeholder="请选择" v-model="formLabelAlign.area" @change="ariaChange" >
                <el-option  v-for="(aria,index) in arias"  :key="aria.name"  :label="aria.name"  :value="aria"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="地点" prop="last">
            <template scope='scope'>
              <el-select placeholder="请选择" v-model="formLabelAlign.last" @change="lastChange" >
                <el-option  v-for="(last,index) in lasts"  :key="last.name"  :label="last.name"  :value="last"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="ip地址" prop="ip">
            <el-input v-model="formLabelAlign.ip"></el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input v-model="formLabelAlign.port"></el-input>
          </el-form-item>
          <el-form-item label="账户名" prop="admin">
            <el-input v-model="formLabelAlign.admin"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input type="password"  v-model="formLabelAlign.pwd"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button @click="addBaseAlert = false">取 消</el-button>
            <el-button type="primary" @click="addVideoPost('formLabelAlign')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :title="addBaseAlertTitle" v-model="updataVideoAlert">
      <div class="addOneVideoWrap">
        <el-form label-position="right" label-width="100px" :model="updateData" :rules="updateDataRules" ref="updateData">
          <el-form-item label="名字" prop="name">
            <el-input v-model="updateData.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="系统" prop="system">
            <el-input v-model="updateData.system" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="省区" prop="province">
            <el-input v-model="updateData.province" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="市区" prop="city">
            <el-input v-model="updateData.city" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="区域" prop="area">
            <el-input v-model="updateData.area" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="地点" prop="last">
            <el-input v-model="updateData.last" :disabled="true"></el-input>
          </el-form-item> -->
          <el-form-item label="ip地址" prop="ip">
            <el-input v-model="updateData.ip"></el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input v-model="updateData.port"></el-input>
          </el-form-item>
          <el-form-item label="账户名" prop="username">
            <el-input v-model="updateData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password"  v-model="updateData.password"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button @click="updataVideoAlert = false">取 消</el-button>
            <el-button type="primary" @click="updataVideo('updateData')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 视频列表 -->
    <div class="baseTitle baseWidth">
      <span>名称</span>
      <span>地点</span>
      <span>监控地址</span>
      <span>操作</span>
    </div>
    <div class="baseList baseWidth" v-for="(videoList,index) in getAllVideoListData">
      <span>{{videoList.name}}</span>
      <span>{{videoList.provinceName+videoList.cityName+videoList.areaName}}</span>
      <span>{{videoList.ip}}</span>
      <span>
        <i class="controlleredit controllericon" v-on:click="editVideo(videoList.id,index)"></i>
        <i class="controllerdel controllericon" v-on:click="deleteVideoPost(videoList.id,index)"></i>
      </span>
    </div>
    <!-- 分页 -->
    <!-- <div class="block" v-if="videoListArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="videoListArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="videoListArgs.totalPage">
      </el-pagination>
    </div> -->

  </div>
</template>

<script>
import axios from 'axios'
import global from '../../global/global'
export default {
  data () {
    var checkSystem = (rule, value, callback) => {
      if (value) {
        if(!value.name){
          callback(new Error('请选择系统'));
        }else{
          callback();
        }
      } else {
        callback(new Error('请选择系统'));
      }
    };
    var checkProvince = (rule, value, callback) => {
      if (value) {
        if(!value.name){
          callback(new Error('请选择省区'));
        }else{
          callback();
        }
      } else {
        callback(new Error('请选择省区'));
      }
    };
    var checkCity = (rule, value, callback) => {
      if (value) {
        if(!value.name){
          callback(new Error('请选择市区'));
        }else{
          callback();
        }
      } else {
        callback(new Error('请选择市区'));
      }
    };
    var checkLast = (rule, value, callback) => {
      if (value) {
        if(!value.name){
          callback(new Error('请选择地点'));
        }else{
          callback();
        }
      } else {
        callback(new Error('请选择地点'));
      }
    };
    var checkArea = (rule, value, callback) => {
      if (value) {
        if(!value.name){
          callback(new Error('请选择区域'));
        }else{
          callback();
        }
      } else {
        callback(new Error('请选择区域'));
      }
    };
    return {
      updataVideoAlert:false,
      getAllVideoListData:null,
      addOneVideoName:null,
      lastVideoId:null,
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
      videoList:[],
      systems:[],
      provinces:[],
      citys:[],
      arias:[],
      lasts:[],
      formLabelAlign:{
        name:null,
        ip:null,
        port:null,
        admin:null,
        pwd:null,
        system:null,
        province:null,
        city:null,
        area:null,
        last:null
      },
      updateData:{
        name:null,
        ip:null,
        port:null,
        username:null,
        password:null,
        // system:null,
        // province:null,
        // city:null,
        // area:null,
        // last:null
      },
      updateDataRules:{
        name:[{required:true,message: '请输入名字', trigger: 'change'}],
        ip:[{required:true,message: '请输入ip地址', trigger: 'change'}],
        port:[{required:true,message: '请输入端口号', trigger: 'change'}],
        username:[{required:true,message: '请输入账号', trigger: 'change'}],
        password:[{required:true,message: '请输入密码', trigger: 'change'}],
        // system:[{required:true, trigger: 'change'}],
        // province:[{required:true,trigger: 'change'}],
        // city:[{required:true,trigger: 'change'}],
        // area:[{required:true, trigger: 'change'}],
        // last:[{required:true, trigger: 'change'}]
      },
      formLabelAlignRules:{
        name:[{required:true,message: '请输入名字', trigger: 'change'}],
        ip:[{required:true,message: '请输入ip地址', trigger: 'change'}],
        port:[{required:true,message: '请输入端口号', trigger: 'change'}],
        admin:[{required:true,message: '请输入账号', trigger: 'change'}],
        pwd:[{required:true,message: '请输入密码', trigger: 'change'}],
        system:[{required:true,validator:checkSystem, trigger: 'change'}],
        province:[{required:true,validator:checkProvince,trigger: 'change'}],
        city:[{required:true,validator:checkCity,trigger: 'change'}],
        area:[{required:true,validator:checkArea, trigger: 'change'}],
        last:[{required:true,validator:checkLast, trigger: 'change'}]
      },

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
      // provinces: null,
      // citys: null,
      // areas: null,
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
    this.getVideoLists();
    this.getAllVideoList();
  },
  methods: {
    getAllVideoList:function(){
      axios.get(global.baseUrl + 'hikvision/query'+'?token=' + global.getToken())
      .then((res) => {
      this.getAllVideoListData = res.data.data;
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
        this.lastVideoId = last.id;
    },
    getVideoLists () {
      var self = this;
      var obj = {};
      var token = global.getToken()
      console.log(token)
      axios.post(global.baseUrl + 'system/listPack',global.postHttpDataWithToken(obj))
      .then((res) => {
        console.log(res,"getVideoLists")
        if (res.data.callStatus === 'SUCCEED') {
          self.systems = res.data.data;

        }else{
          // self.$alert("网络出错")
        }
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
    editVideo (videoId,index) {
      this.videoInfo.videoId = videoId
      this.addBaseAlertTitle = '修改'
      this.updataVideoAlert = true
      this.updateData = this.getAllVideoListData[index];
      console.log(this.getAllVideoListData[index])
      // axios.get(global.baseUrl + '')
      // .then((res) => {
      //   console.log(res)
      // })
    },
    updataVideo:function(formName){
      var self = this;
      var obj = {};
      self.$refs[formName].validate((valid) => {
        if (valid) {
          obj.id = self.updateData.id;
          obj.ip = self.updateData.ip;
          obj.port = self.updateData.port;
          obj.username = self.updateData.username;
          obj.password = self.updateData.password;
          obj.name = self.updateData.name;

          axios.post(global.baseUrl + 'hikvision/update',global.postHttpDataWithToken(obj))
          .then((res) => {
            console.log(res)
            if (res.data.callStatus === 'SUCCEED') {
              this.$alert('修改成功',  {confirmButtonText: '确定',});
              this.updataVideoAlert = false;
            }else{
              this.$alert('错误',  {confirmButtonText: '确定',});
            }
          })
        } else {
          return false;
        }
      });
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
    addVideoPost (formName) {
      var self = this;
      var obj = {};
      self.$refs[formName].validate((valid) => {
          if (valid) {
            obj.ip = self.formLabelAlign.ip;
            obj.port = self.formLabelAlign.port;
            obj.username = self.formLabelAlign.admin;
            obj.password = self.formLabelAlign.pwd;
            obj.locationId = self.lastVideoId;
            obj.name = self.formLabelAlign.name;
            axios.post(global.baseUrl + 'hikvision/add',global.postHttpDataWithToken(obj))
            .then((res) => {
              console.log(res)
              if (res.data.callStatus === 'SUCCEED') {
                this.$alert('添加成功',  {confirmButtonText: '确定',});
                this.addBaseAlert = false;
              }else{
                this.$alert('错误',  {confirmButtonText: '确定',});
              }
            })
          } else {
            return false;
          }
        });
    },
    // 删除视频
    deleteVideoPost (baseId,index) {
      var self = this
      axios.post(global.baseUrl + 'device/delete?hikvisionId=' + baseId + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '删除成功', '')
          self.getAllVideoListData.splice(index,1);
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
<style >
  .addOneVideoWrap .el-form-item  .el-form-item__content{
    width: 220px ;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addOneVideoWrap{
  margin: auto;
  width: 410px;
}
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
.selectOne{
  text-align: left;
}
.selectOne span{
  display: inline-block;
  width: 68px;
      margin-right: 7px;
      text-align: right;
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
  line-height: 40px;
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
