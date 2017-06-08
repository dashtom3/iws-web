<template>
  <div class="controllerdetail">
    <v-header></v-header>
    <div class="detailController">
      <div class="baselist">
        <div class="h40"></div>
        <ul class="baseLists">
          <div class="">
            <li v-for="(controllerDetial, index) in controllerDetials" v-on:click="selectBase(index, controllerDetial.groupId)" class="leftH5">
              <span class="controllerDetialbg"></span>
              <span :class="{clickActive: isActive === index}">{{controllerDetial.name}}</span></li>
          </div>
        </ul>
        <div class="baseRight">
          <img src="../images/dataSee.png" alt="">
          <div class="selectController cw">
            <el-select placeholder="控制器" v-model="deviceMsg.deviceId" @change="selectController">
              <el-option
                :key="controller"
                v-for="controller in controllerlists"
                :label="controller.termName"
                :value="controller.id">
              </el-option>
            </el-select>
          </div>
          <div class="controlllerDeailBlock" v-if="showData">
            <div class="dataShow">
              <ul>
                <li v-for="controllerDetailInfo in controllerDetailInfos">
                  <p class="h25">{{controllerDetailInfo.name}}</p>
                  <p class="cH">&nbsp;{{controllerDetailInfo.data}}</p>
                </li>
              </ul>
            </div>
            <!-- <el-carousel trigger="click" height="265px">
              <el-carousel-item v-for="item in Math.ceil(controllerDetailInfos.length/9)" :key="item">
                <div class="controllerDataList" v-for="itemDate in 9" v-if="controllerDetailInfos[(item-1)*9+itemDate-1] != null">
                  <p>{{controllerDetailInfos[(item-1)*9+itemDate-1].name}}</p>
                  <div class="h130"></div>
                  <p>&nbsp;{{controllerDetailInfos[(item-1)*9+itemDate-1].data}}</p>
                </div>
              </el-carousel-item>
            </el-carousel> -->
          </div>
        </div>
      </div>
      <div class="baseImg">
        <div class="baseImgLeft">
          <p><a href="javascript:;" v-on:click="isOperation"><img src="../images/control.png" alt=""><br>远程控制</a></p>
          <ul class="remoteDate" v-if="remoteDate">
            <div class="h20"></div>
            <li v-for="remoteDate in remoteDates">{{remoteDate.name}}&nbsp;&nbsp;&nbsp;<el-button type="primary" size="mini" :disabled="remoteDate.value === 1" @click="openData(remoteDate.number)">开启</el-button><el-button type="primary" size="mini":disabled="remoteDate.value === 0" @click="closeData(remoteDate.number)">关闭</el-button></li>
          </ul>
        </div>
        <div class="baseImgRight">
          <img src="../images/picSee.png" alt="">
          <ul>
            <li><span></span><img src="../images/example.png" alt=""><p class="t20">箱式叠压</p></li>
            <li><span></span><img src="../images/example.png" alt=""><p class="t20">箱式叠压</p></li>
            <li><span></span><img src="../images/example.png" alt=""><p class="t20">箱式叠压</p></li>
            <li><span></span><img src="../images/example.png" alt=""><p class="t20">箱式叠压</p></li>
            <li><span></span><img src="../images/example.png" alt=""><p class="t20">箱式叠压</p></li>
          </ul>
        </div>
      </div>
      <div class="h40"></div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import header from './common/header'
import footer from './common/footer'
import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      controllerDetials: [],
      controllerlists: [],
      controllerId: null,
      remoteDates: [],
      remoteDate: false,
      controllerDetailInfos: null,
      locationMsg: {
        locationId: this.$route.params.id
      },
      deviceMsg: {
        deviceId: null,
        token: global.getToken()
      },
      limitionMsg: {
        systemId: null,
        areaId: null,
        writable: 2,
        token: global.getToken()
      },
      isActive: null,
      showData: false
    }
  },
  created () {
    var self = this
    axios.post(global.baseUrl + 'location/detail', global.postHttpDataWithToken(this.locationMsg))
    .then((res) => {
      self.limitionMsg.systemId = res.data.data.systemId
      self.limitionMsg.areaId = res.data.data.areaId
      self.controllerDetials = res.data.data.room[0].deviceGroups
    })
  },
  methods: {
    selectBase (index, groupId) {
      this.isActive = index
      var groupMsg = {
        groupId: groupId,
        token: global.getToken()
      }
      var self = this
      axios.get(global.baseUrl + 'room/groupDetail?' + global.getHttpData(groupMsg))
      .then((res) => {
        self.controllerlists = res.data.data.devices
        self.showData = false
        self.remoteDate = false
        self.deviceMsg.deviceId = null
        self.controllerId = null
      })
    },
    selectController () {
      if (this.deviceMsg.deviceId) {
        this.getDate(this.deviceMsg)
      }
    },
    getDate (args) {
      var self = this
      axios.get(global.baseUrl + 'data/presentData?' + global.getHttpData(args))
      .then((res) => {
        self.showData = true
        self.remoteDate = false
        self.controllerDetailInfos = res.data.data.data
      })
      axios.get(global.baseUrl + 'data/pumpStatus?' + global.getHttpData(args))
      .then((res) => {
        self.remoteDates = res.data.data
      })
      setTimeout(this.selectController, 10000)
    },
    isOperation () {
      var self = this
      axios.get(global.baseUrl + 'limitation/checkLimit?' + global.getHttpData(this.limitionMsg))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.remoteDate = true
        } else {
          alert('权限不够，无法操作')
        }
      })
    },
    // 开启操作
    openData (number) {
      var obj = {
        number: number,
        pumpStatus: 1,
        deviceId: this.deviceMsg.deviceId
      }
      var self = this
      axios.post(global.baseUrl + 'room/manual', global.postHttpDataWithToken(obj))
      .then((res) => {
        console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
          self.selectController()
        }
      })
    },
    closeData (number) {
      var obj = {
        number: number,
        pumpStatus: 0,
        deviceId: this.deviceMsg.deviceId
      }
      var self = this
      axios.post(global.baseUrl + 'room/manual', global.postHttpDataWithToken(obj))
      .then((res) => {
        console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
          self.selectController()
        }
      })
    }
  },
  components: {
    'v-header': header,
    'v-footer': footer
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.h40{
  height: 40px;
}
.h25{
  margin-top: 25px;
}
.cH{
  font-size: 16px;
  font-family: "Microsoft YaHei";
  color: rgb( 17, 113, 170 );
}
.dataShow{
  border-width: 1px;
  border-color: rgb( 238, 238, 238 );
  border-style: solid;
  border-radius: 4px;
  background-color: rgb( 255, 255, 255 );
  box-shadow: 2.5px 4.33px 5px 0px rgb( 182, 182, 182 );
  width: 970px;
  height: 327px;
  margin: 10px auto;
  overflow-y: scroll;
  overflow-x: hidden;
}
.dataShow ul{
  width: 980px!important;
}
.dataShow ul li{
  display: inline-block;
  text-align: center;
  width: 12%;
  border-bottom: 1px solid #e1e1e1;
  padding: 0 20px 20px 0!important;
  position: relative;
  left: -8px;
}
.dataShow ul li p.h25{
  margin-bottom: 20px;
  font-size: 14px;
}
.dataShow ul li p{
  font-size: 14px;
}
.remoteDate{
  border-radius: 4px;
  border: 1px solid #276b94;
  width: 231px;
  height: 399px;
  margin: 10px auto;
}
.h20{
  height: 10px;
}
.remoteDate li{
  margin: 15px auto;
}
.remoteDate li:hover{
  cursor: pointer;
}
.detailController{
  width: 1280px;
  min-height: 800px;
  margin: 20px auto;
  background-color: #fff;
  /*background-image: url('../images/background.png');*/
  /*background-size: cover;*/
}
.controlllerDeailBlock{
  clear: both;
  height: 363px;
  text-align: left;
}
.baseRight img,.baseRight .cw{
  margin-bottom: 15px;
  margin-top: 25px;
}
.baseRight .cw{
  position: absolute;
  right: 70px;
  top: 0;
}
.baselist ul{
  width: 250px;
  display: inline-block;
}
.controllerDataList{
  display: inline-block;
  width: 11%;
  text-align: center;
}
.h130{
  height: 130px;
}
.controllerDataList p{
  font-size: 14px;
}
.baselist ul li:hover{
  cursor: pointer;
}
.baseRight{
  width:1005px;
  display: inline-block;
  overflow-y: auto;
  border: 1px solid #cccccc;
  border-radius: 4px;
  vertical-align: top;
  margin-left: 10px;
  text-align: center;
  position: relative;
  height: 447px;
}
.baseImg{
  margin-top: 30px;
}
.baseImgLeft{
  width: 250px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.baseImgRight,.baseImgLeft{
  display: inline-block;
  vertical-align: top;
  padding-top: 80px;
  position: relative;
  left: 5px;
  top: -96px;
  height: 636px;
  background-color: #0e5a88;
}
.t20{
  font-size: 14px;
  position: relative;
  top: -23px;
}
.baseImgRight{
  width: 1005px;
  min-height: 658px;
  border-radius: 5px;
  background-color: #fff;
  margin-top: 80px;
  margin-left: 10px;
  padding: 0;
  text-align: center;
}
.baseImgRight ul li{
  float: left;
  /*width: 215px;*/
  display: inline-block;
  width: 22.5%;
  height: 235px;
  text-align: center;
  background-color: #fff;
  margin: 20px 10px 0 10px;
  border-radius: 4px;
  border: 1px solid #cccccc;
  /*margin-right: 33px;
  margin-top: 20px;*/
}
.baseImgRight ul li span{
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.baseImgRight ul li img{
  display: inline-block;
  vertical-align: middle;
  max-width: 215px;
  max-height: 185px;
}
.baseImgLeft a{
  color: #fff;
}
.selectController{
  float: right;
  margin-right: 10px;
}
.baselist ul.baseLists li{
  margin: 40px 40px 40px 5px;
  font-size: 18px;
  position: relative;
  /*text-align: center;*/
}
.controllerDetialbg{
  display: inline-block;
  position: absolute;
  /*width: 78px;*/
  height: 33px;
  background-color: rgb( 240, 255, 207);
  opacity: 0;
  left: -5px;
  font-size: 16px;
}
.clickActive{
  border-bottom: 1px solid;
  /*opacity: .4;
  left:35px;
  transition: left .5s;*/
}
.baselist ul.baseLists{
  height:384px;
  width: 250px;
  overflow-y: auto;
  margin-left: 5px;
  background-color: #0e5a88;
  color: #fff;
}
.baselist ul.baseLists div{
  width: 230px;
  margin: 10px auto;
  border: 1px solid #276b94;
  max-height: 380px;
}
.baselist ul.baseLists li.leftH5::before{
  content: '';
  display: inline-block;
  width: 15px;
  height: 15px;
  margin: 0 10px;
  background: url('../images/baseBefore.png');
  vertical-align: middle;
}
.baselist ul.baseLists li.leftH5 span:last-child{
  font-size: 16px;
}
</style>
