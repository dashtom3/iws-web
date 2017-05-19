<template>
  <div class="controllerdetail">
    <v-header></v-header>
    <div class="detailController">
      <div class="baselist">
        <div class="h40"></div>
        <ul class="baseLists">
          <li v-for="(controllerDetial, index) in controllerDetials" v-on:click="selectBase(index, controllerDetial.groupId)">
            <span class="controllerDetialbg"></span>
            <span :class="{clickActive: isActive === index}">{{controllerDetial.name}}</span></li>
        </ul>
        <div class="baseRight">
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
                  <p>{{controllerDetailInfo.name}}</p>
                  <p>&nbsp;{{controllerDetailInfo.data}}</p>
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
          <p><a href="javascript:;" v-on:click="remoteDate = true"><img src="../images/control.png" alt=""><br>远程控制</a></p>
          <ul class="remoteDate" v-show="remoteDate">
            <div class="h20"></div>
            <li v-for="remoteDate in remoteDates">{{remoteDate.name}}&nbsp;&nbsp;&nbsp;<el-button type="primary" size="mini" :disabled="remoteDate.value === 1" @click="openData(remoteDate.number)">开启</el-button><el-button type="primary" size="mini":disabled="remoteDate.value === 0" @click="closeData(remoteDate.number)">关闭</el-button></li>
          </ul>
        </div>
        <div class="baseImgRight">
          <ul>
            <li><span></span><img src="../images/control.png" alt=""></li>
            <li><span></span><img src="../images/control.png" alt=""></li>
            <li><span></span><img src="../images/control.png" alt=""></li>
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
      isActive: null,
      showData: false
    }
  },
  created () {
    var self = this
    axios.post(global.baseUrl + 'location/detail', global.postHttpDataWithToken(this.locationMsg))
    .then((res) => {
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
      // setTimeout(this.selectController, 10000000)
    },
    // 开启操作
    openData (number) {
      var obj = {
        number: number,
        pumpStatus: 1,
        deviceId: this.controllerId
      }
      var self = this
      axios.post(global.baseUrl + 'room/manual', global.postHttpDataWithToken(obj))
      .then((res) => {
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
        deviceId: this.controllerId
      }
      var self = this
      axios.post(global.baseUrl + 'room/manual', global.postHttpDataWithToken(obj))
      .then((res) => {
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
.dataShow ul{
  width: 980px!important;
}
.dataShow ul li{
  display: inline-block;
  text-align: center;
  width: 12%;
  margin: 0 20px 20px 0!important;
}
.dataShow ul li p{
  margin-bottom: 20px;
  font-size: 14px;
}
.remoteDate{
  border-radius: 4px;
  background-color: rgba( 255, 255, 255, .1 );
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
  color: #fff;
  background-image: url('../images/background.png');
  background-size: cover;
}
.controlllerDeailBlock{
  clear: both;
  height: 230px;
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
  width:1000px;
  display: inline-block;
  overflow-y: auto;
  border-width: 1px;
  border-color: rgb( 255, 255, 255 );
  border-style: solid;
  border-radius: 4px;
  vertical-align: top;
  height: 384px;
  margin-left: 15px;
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
}
.baseImgRight{
  width: 1000px;
  min-height: 658px;
  border-radius: 5px;
  background-color: rgba( 240, 255, 207, .2 );
}
.baseImgRight ul li{
  float: left;
  width: 290px;
  height: 290px;
  text-align: center;
  background-color: #fff;
  margin-right: 33px;
  margin-top: 20px;
}
.baseImgRight ul li:nth-child(1){
  margin-left: 30px;
}
.baseImgRight ul li span{
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.baseImgRight ul li img{
  display: inline-block;
  vertical-align: middle;
  max-width: 290px;
  max-height: 290px;
}
.baseImgLeft a{
  color: #fff;
}
.selectController{
  float: right;
  margin-right: 10px;
}
.baselist ul li{
  margin: 0 40px 40px 5px;
  font-size: 18px;
  position: relative;
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
  border: 1px solid #fff;
  width: 228px;
  overflow-y: auto;
  margin-left: 5px;
}
.baselist ul.baseLists li::before{
  content: '';
  display: inline-block;
  width: 15px;
  height: 15px;
  margin: 0 10px;
  background: url('../images/baseBefore.png');
  vertical-align: middle;
}
.baselist ul.baseLists li span:last-child{
  font-size: 16px;
}
</style>
