<template>
  <div class="index" ref="newsContent">
    <div class="indexPoster">
      <div class="block">
        <el-carousel trigger="click" height="170px">
          <el-carousel-item
          :key="item"
          v-for="item in Math.ceil(items.length/3)">
            <div class="index1" v-for="it in 3" v-if="items[(item-1)*3+it-1] != null">
              <div class="systemImg">
                <div class="imgCon">
                  <img :src=items[(item-1)*3+it-1].pic alt="">
                </div>
                <div class="systemTime">
                  <p class="systemname">{{items[(item-1)*3+it-1].name}}</p>
                  <p class="systemBegin">创建于:&nbsp;{{items[(item-1)*3+it-1].date | date}}</p>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <p class="mapTitle"><span></span>GPS地图显示</p>
    <div class="mapCon">
      <transition name="slide-fade">
         <div v-if="showLeftNav" class="leftNav">
           <div class="leftNavCon">
             <el-input
              placeholder="请输入搜索内容"
              v-model="filterAddress">
            </el-input>
            <i class="el-icon-search enterClick" v-on:click="filterAdd"></i>
            <el-tree :data="treeData"
              node-key="id"
              ref="tree"
              accordion
              highlight-current
              :default-expanded-keys="[1]"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @current-change="clicktree"></el-tree>
           </div>
         </div>
      </transition>
      <div class="map">
        <a href="javascript:;" class="icon" v-on:click="LeftNav"></a>
        <!-- <baidu-map class="map" :center="{lng: 121.470672, lat: 31.312029}" :zoom="15">
           <div
           :key="mar"
           v-for="(mar, index) in items" class="addressMarker">
             <div class="" :key="lo"
             v-for="lo in mar.location">
             <bm-marker
             :mouseover="alertMsg"
             :position="{lng: lo.positionX, lat: lo.positionY}"
             :icon="{url: mar.pic, size: {width: 50, height: 50}}"
              >
            </bm-marker>
            <bm-info-window :position="{lng: lo.positionX, lat: lo.positionY}"  :show="true" :title="lo.describes" :closeOnClick="false" :width="10">
            </bm-info-window>
             </div>
           </div>
         </baidu-map> -->
        <!-- <div id="demoComponent" class="demo-component">
          <el-amap vid="amap" :zoom="zoom" :center="center">
            <div v-for="marker in markers">
            <el-amap-marker
            :key="markerInfo"
            v-for="markerInfo in marker" :position="markerInfo.position" :events="markerInfo.events" :visible="markerInfo.visible"
            :icon="markerInfo.icon" :content="markerInfo.content" :draggable="markerInfo.draggable"></el-amap-marker>
            </div>
          </el-amap>
        </div> -->

        <!-- 高德地图 -->
        <div id="demoComponent" class="demo-component indexMap">
          <el-amap vid="amap" :zoom="zoom" :center="center">
            <div v-for="marker in markers">
            <el-amap-marker
            :key="markerInfo"
            v-for="markerInfo in marker" :position="markerInfo.position" :events="markerInfo.events" :visible="markerInfo.visible"
            :icon="markerInfo.icon" :content="markerInfo.content" :draggable="markerInfo.draggable"></el-amap-marker>
            </div>
          </el-amap>
        </div>
      </div>
    </div>

    <el-dialog
      title="泵房列表"
      v-model="addressAlert">
      <ul class="maxHeight">
        <li v-for="addressRoomList in addressRoomLists" class="addressRoomlist">
          <p class="roomTitle" style="line-height:40px;">{{addressRoomList.name}}</p>
          <a class="configControllerlist" v-for="configControllerList in addressRoomList.deviceGroups" :href="'/detail/'+locationId" target="_blank">
            <img :src="imgUrl+configControllerList.pic" alt="">
            <p>{{configControllerList.name}}</p>
          </a>
        </li>
      </ul>
      <div class="qxAlert">
        <el-button v-on:click="addressAlert = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- <v-footer></v-footer> -->
    <!-- <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <img src="../images/test1.gif" alt="">
    </el-dialog> -->
  </div>
</template>

<script>
// import sewage from '../images/sewage.png'
// import big from '../images/big.png'
import axios from 'axios'
import global from '../global/global'
export default {
  name: 'index',
  data () {
    return {
      dialogVisible: true,
      posters: [],
      items: [],
      addressAlert: false,
      filterAddress: null,
      msg: 'Welcome to Your Vue.js App',
      showLeftNav: false,
      zoom: 5,
      center: [121.5273285, 31.21515044],
      chengshiShow: false,
      imgUrl: global.baseUrl,
      // 地图
      markers: [],
      markerContent: '',
      treeData: [],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      locationId: null,
      addressRoomLists: [] // 泵房列表
    }
  },
  created () {
    var self = this
    axios.post(global.baseUrl + 'system/listPack?token=' + global.getToken())
    .then((res) => {
      // console.log(res)
      self.items = res.data.data
      var mydata = res.data.data
      this.tree(mydata)
    })
    this.getAllAddress()
  },
  methods: {
    filterAdd () {
      if (this.filterAddress) {
        this.$refs.tree.filter(this.filterAddress)
      } else {
        this.$refs.tree.filter()
        // this.getAllAddress()
      }
    },
    goDataview () {
      this.$router.push('/dataview')
    },
    getAllAddress () {
      // 请求所有地点
      axios.post(global.baseUrl + 'location/list?systemId=0', global.postHttpDataWithToken())
      .then((res) => {
        var self = this
        for (let i in res.data.data) {
          var arr = [
            {
              icon: res.data.data[i].system.pic,
              position: [res.data.data[i].positionX, res.data.data[i].positionY],
              events: {
                mouseover: () => {
                  self.markers[i][1].visible = true
                },
                mouseout: () => {
                  self.markers[i][1].visible = true
                }
              },
              visible: true,
              draggable: false
            }, {
              icon: null,
              position: [res.data.data[i].positionX, res.data.data[i].positionY],
              content: '<div style="width:124px;height:70px;text-align:center;color:#fff;background-color:rgba(0,0,0,.4);border-radius:4px;position:absolute;z-index:-1;top:-52px;left:15px;"><p style="margin:18px 0 10px 0;color:#fff;font-size:14px;">' + res.data.data[i].system.name + '</p>' + res.data.data[i].describes + '</div>',
              events: {
                mouseover: () => {
                  self.markers[i][1].visible = true
                },
                mouseout: () => {
                  self.markers[i][1].visible = false
                },
                click: () => {
                  // console.log(123)
                  axios.post(global.baseUrl + 'location/detail?locationId=' + res.data.data[i].id + '&token=' + global.getToken())
                  .then((res) => {
                    self.addressAlert = true
                    self.addressRoomLists = res.data.data.room
                    self.locationId = res.data.data.id
                  })
                }
              },
              visible: false,
              draggable: false
            }
          ]
          self.markers.push(arr)
        }
        // console.log(self.markers)
      })
    },
    filterNode (value, data, node) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    LeftNav () {
      this.showLeftNav = !this.showLeftNav
      document.querySelector('.map').style.display = 'inline-block'
      if (this.showLeftNav) {
        document.querySelector('.map').style.width = 1280 - 236 + 'px'
      } else {
        document.querySelector('.map').style.width = 1280 + 'px'
      }
    },
    clicktree (data) {
      // console.log(data)
      if (data.position) {
        this.center = data.position
      } else {
        return false
      }
    },
    tree (mydata) {
      if (mydata) {
        for (var q = 0; q < mydata.length; q++) {
          var onedataq = {}
          onedataq.children = []
          onedataq.label = mydata[q].name
          var z = mydata[q].locationPack
          if (z) {
            for (var w = 0; w < z.length; w++) {
              var obj = {}
              obj.label = z[w].name
              obj.children = []
              var x = z[w].city
              if (x) {
                for (var e = 0; e < x.length; e++) {
                  var obj2 = {}
                  obj2.label = x[e].name
                  obj2.children = []
                  var c = x[e].area
                  if (c) {
                    for (var r = 0; r < c.length; r++) {
                      var obj3 = {}
                      obj3.children = []
                      obj3.label = c[r].name
                      var v = c[r].location
                      if (v) {
                        for (var t = 0; t < v.length; t++) {
                          var obj4 = {}
                          obj4.position = [v[t].positionX, v[t].positionY]
                          obj4.locationId = v[t].id
                          obj4.label = v[t].name
                          obj3.children.push(obj4)
                        }
                      }
                      obj2.children.push(obj3)
                    }
                  }
                  obj.children.push(obj2)
                }
              }
              onedataq.children.push(obj)
            }
          }
          this.treeData.push(onedataq)
        }
      }
    }
  },
  mounted () {
    if (!global.getToken()) {
      this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexHeader{
  width: 1280px;
  height: 71px;
  line-height: 71px;
  margin: 0 auto 10px;
}
.addressRoomlist{
  margin-bottom: 20px;
  background-color: #ededed;
}
.configControllerlist{
  display: inline-block;
  color: #000;
  text-align: center;
  width: 20%;
  margin-left: 10px;
}
.configControllerlist p{
  font-size: 14px;
  color: #696969;
  position: relative;
  top: -60px;
}
.roomTitle{
  text-align: center;
  margin-bottom: 10px;
}
.qxAlert{
  text-align: center;
}
.maxHeight{
  max-height: 600px;
  overflow-y: auto;
}
.systemname{
  font-size: 24px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  margin-bottom: 10px;
}
.systemBegin{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  text-align: left;
}
.systemImg{
  position: relative;
}
.systemImg img{
  /*line-height: 80px;*/
  vertical-align: middle;
}
.systemTime{
  position: absolute;
  left: 150px;
  top: 45px;
  text-align: left;
}
.enterClick{
  position: absolute;
  width: 35px;
  height: 100%;
  right: 0;
  top: 5px;
  cursor: pointer;
  text-align: center;
  color: #bfcbd9;
  font-size: 23px;
  transition: all .3s;
}
.index1{
  /*float: left;*/
  display: inline-block;
  width: 360px;
  height: 160px;
  border-radius: 6px;
  background-color: rgba( 255, 255, 255, .5 );
  box-shadow: 0.5px 0.866px 3px 0px rgb( 31, 31, 31 );
  margin: 0 10px;
}
.index1:nth-child(2n){
  border-radius: 6px;
  background-color: rgb( 20, 135, 202 );
  opacity: 0.502;
  box-shadow: 0.5px 0.866px 3px 0px rgb( 31, 31, 31 );
}
.index1:nth-child(2n) p{
  color:#fff;
}
.leftNav ul {
  border-radius: 6px;
  background-color: rgb( 238, 238, 238 );
  box-shadow: 0.5px 0.866px 3px 0px rgb( 177, 177, 177 );
  width: 200px;
  height: 487px;
}
.leftNav ul li{
  line-height: 43px;
  position: relative;
  width: 140px;
  margin: 10px auto;
}
.leftNav ul li:hover{
  cursor: pointer;
  color: rgb(20,135,202);
}
.leftNav ul li span{
  /*display: inline-block;*/
  font-size: 14px;
}
.leftNav ul li img{
  width: 22px;
  height: 27px;
  float: left;
  margin-right: 20px;
  position: relative;
  top: 10px;
}
.imgCon{
  position: relative;
  left: 40px;
  top: 35px;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #fff;
  text-align: center;
  vertical-align: middle;
  line-height: 80px;
}
/*.ws{
  background: url('../')
}*/
.fx{
  background: url('../images/fx.png') no-repeat;
}
.jc{
  background: url('../images/jc.png') no-repeat;
}
.gs{
  background: url('../images/gs.png') no-repeat;
}
.indexLog{
  float: left;
}
#demoComponent{
  height: 100%;
}
.leftNav{
  width: 220px;
  margin-right: 10px;
  float: left;
}
.map{
  height: 800px;
}
.mapCon{
  overflow: hidden;
  width: 1280px;
  margin: 0 auto;
}
.leftNavCon{
  width: 200px;
  margin: 0 auto;
  position: relative;
}

.block{
  clear: both;
  width: 1280px;
  margin: 0 auto;
}
.el-carousel{
  height: 220px;
  padding-top: 55px;
  text-align: center;
}
.indexPoster{
  background: url('../images/posterbg.jpg');
  height: 350px;
}
.map{
  position: relative;
  /*float: left;*/
  z-index: 999;
}
.map .icon{
  display: block;
  width: 54px;
  height: 54px;
  position: absolute;
  background: url('../images/icon.png');
  left: 30px;
  top:48%;
  z-index: 999;
}
.mapTitle{
  width: 1280px;
  margin: 20px auto 10px;
  font-size: 24px;
}
.mapTitle span{
  display: inline-block;
  background-color: rgb( 20, 135, 202 );
  width: 8px;
  height: 28px;
  margin-right: 20px;
}
.amap-wrapper {
  /*width: 500px;*/
  /*height: 500px;*/
}
.el-carousel__container{
  height: 170px;
  margin-top: 55px;
  width: 1140px;
  text-align: left;
}
</style>
