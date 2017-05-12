<template>
  <div class="controllerdetail">
    <v-header></v-header>
    <div class="detailController">
      <div class="baselist">
        <div class="h40"></div>
        <ul class="baseLists">
          <li v-for="(controllerDetial, index) in controllerDetials" v-on:click="selectBase(index, controllerDetial.groupId)">
            <span class="controllerDetialbg" :class="{clickActive: isActive === index}"></span>
            {{controllerDetial.name}}</li>
        </ul>
        <div class="baseRight">
          <div class="selectController">
            <el-select placeholder="控制器" v-model="controllerId" @change="selectController">
              <el-option
                :key="controller"
                v-for="controller in controllerlists"
                :label="controller.termName"
                :value="controller.termId">
              </el-option>
            </el-select>
          </div>
          <div class="">
            <ul>
              <li v-for="controllerDetailInfo in controllerDetailInfos">
                <p>{{controllerDetailInfo.name}}</p>
                <p>{{controllerDetailInfo.data}}</p>
              </li>
            </ul>
          </div>
          <!-- <ul>
            <li v-for="controllerDate in controllerDates"></li>
          </ul> -->
        </div>
      </div>
      <div class="baseImg">
        <div class="baseImgLeft">
          <p><a href=""><img src="../images/control.png" alt=""><br>远程控制</a></p>
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
      controllerDetailInfos: null,
      locationMsg: {
        locationId: this.$route.params.id
      },
      isActive: 0
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
    conso (id) {
      console.log(id)
    },
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
      })
    },
    selectController () {
      var self = this
      var controllerMsg = {
        deviceId: this.controllerId,
        token: global.getToken()
      }
      axios.get(global.baseUrl + 'data/presentData?' + global.getHttpData(controllerMsg))
      .then((res) => {
        console.log(res)
        self.controllerDetailInfos = res.data.data.data
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
.detailController{
  width: 1280px;
  min-height: 800px;
  margin: 20px auto;
  color: #fff;
  background-image: url('../images/background.png');
  background-size: cover;
}
.baselist ul{
  width: 250px;
  display: inline-block;
}
.baselist ul li:hover{
  cursor: pointer;
}
.baseRight{
  width:1000px;
  display: inline-block;
  overflow: hidden;
  border-width: 1px;
  border-color: rgb( 255, 255, 255 );
  border-style: solid;
  border-radius: 4px;
  vertical-align: top;
  height: 265px;
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
}
.baselist ul li{
  margin: 0 40px 40px 5px;
  font-size: 18px;
  position: relative;
}
.controllerDetialbg{
  display: inline-block;
  position: absolute;
  width: 78px;
  height: 33px;
  background-color: rgb( 240, 255, 207);
  opacity: 0;
  left: -5px;
}
.clickActive{
  opacity: .4;
  left:35px;
  transition: left .5s;
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
</style>
