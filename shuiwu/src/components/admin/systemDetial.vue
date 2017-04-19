<template>
  <div class="systemDetial">
    <el-row :gutter="20">
      <el-col :span="2"><span class="back" v-on:click="back">返回系统>></span></el-col>
      <el-col :span="20">&nbsp;</el-col>
      <el-col :span="2"><el-button type="primary" @click="addressAlert = true">添加新地点</el-button></el-col>
    </el-row>

    <!-- 添加新地点 -->
    <el-dialog title="添加新地点" v-model="addressAlert">
      <el-form :model="addressData">
        <el-form-item label="地点名称">
          &nbsp;&nbsp; <el-input v-model="addressData.name" auto-complete="off" class="w800"></el-input>
        </el-form-item>
        <el-form-item label="省/市/地区">
          <el-select v-model="addressData.selectProvince" placeholder="选择省份" @change="province">
            <el-option
            :key="province"
            v-for="province in addressData.provinces"
            :label="province.name" :value="province"></el-option>
          </el-select>
          <el-select v-model="addressData.selectCity" placeholder="选择市" @change="city">
            <el-option
            :key="city"
            v-for="city in addressData.citys"
            :label="city.name" :value="city"></el-option>
          </el-select>
          <el-select v-model="addressData.selectArea" placeholder="选择区域" @change="area">
            <el-option
            :key="area"
            v-for="area in addressData.areas"
            :label="area.name" :value="area"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体地址">
          <input v-model="addressData.address" placeholder="输入完成后按Enter进行校验" auto-complete="off" class="w800 setaddress" v-on:keyup.13="setPosition()">
        </el-form-item>
        <el-form-item label="经纬度">
          &nbsp;&nbsp; &nbsp;&nbsp; <span>X: </span><el-input v-model="addressData.x" auto-complete="off" class="w800 w50"></el-input>
          &nbsp;&nbsp; <span>Y: </span><el-input v-model="addressData.y" auto-complete="off" class="w800 w50"></el-input>
        </el-form-item>
      </el-form>
      <baidu-map class="map-container" :center="center" :zoom="zoom" @moving="syncCenter" @moveend="syncCenter">
        <bm-view class="bm-view" >
        </bm-view>
        <bm-local-search
        :keyword="addressData.keyword" :auto-viewport="true" style="display:none"></bm-local-search>
      </baidu-map>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressAlert = false">取 消</el-button>
        <el-button type="primary" @click="addAddress">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 根据地区筛选 -->
    <el-row :gutter="20">
      <el-col :span="2">
      <el-select v-model="search.searchProvince" placeholder="选择省份" @change="searchProvince">
        <el-option
        :key="province"
        v-for="province in search.searchProvinces"
        :label="province.name" :value="province"></el-option>
      </el-select>
      </el-col>
      <el-col :span="2">
      <el-select v-model="search.searchCity" placeholder="选择市" @change="searchCity">
        <el-option
        :key="city"
        v-for="city in search.searchCitys"
        :label="city.name" :value="city"></el-option>
      </el-select>
      </el-col>
      <el-col :span="2">
      <el-select v-model="search.searchArea" placeholder="选择地区">
        <el-option
        :key="area"
        v-for="area in search.searchAreas"
        :label="area.name" :value="area"></el-option>
      </el-select>
      </el-col>
      <el-col :span='2'>
        <el-button type="primary" @click="searchByArea">查找</el-button>
      </el-col>
    </el-row>

    <!-- 地点列表 -->
    <el-row :gutter="20" class="areaList">
      <div class="arealists" v-for="addresslist in addresslists" :class="{active: addressData.isOpen == addresslist}">
        <div class="areaListTitle">
          <el-col :span="10">
            <div class="areaName" v-on:click="areaIsActive(addresslist, addresslist.id)">
              <span>{{addresslist.name}}</span><i class="el-icon-caret-bottom"></i>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="areaAddress">
              <span>{{addresslist.provinceName+addresslist.cityName+addresslist.areaName+addresslist.describes}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="operation">
              <!-- 编辑地点 -->
              <span class="areaRevise" v-on:click="editIsopen(addresslist.id)"></span>
              <!-- 删除地点 -->
              <span class="areaDel" v-on:click="delIsopen(addresslist.id)"></span>
              <el-dialog title="提示" v-model="delAlert" size="tiny">
                <span>是否删除这个地点</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="delAlert = false">取 消</el-button>
                  <el-button type="primary" @click="deladdress">确 定</el-button>
                </span>
              </el-dialog>
            </div>
          </el-col>
        </div>
        <transition name="slide-fade">
        <div class="areaListDetial">
          <el-col :span="3" class="bor1">
                <a href="javascript:;" class="addRoom" v-on:click="addRoomAlert = !addRoomAlert">添加</a><br>

                <!-- 添加泵房 -->
                <el-dialog title="添加房间" v-model="addRoomAlert" size="tiny">
                  <el-form>
                    <el-form-item label="房间名称">
                      <el-input v-model="rooms.name" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addRoomAlert = false">取 消</el-button>
                    <el-button type="primary" @click="addroom" v-if="addRoomBtn">确 定</el-button>
                    <el-button type="primary" @click="editroom" v-if="editRoomBtn">确 定</el-button>
                  </div>
                </el-dialog>

                <p class="roomlist" v-for="room in rooms.roomlist" :class="{ active: isOpen == room }">
                  <i class="el-icon-delete" v-on:click="roomDelete(addresslist, addresslist.id, room.id)"></i>&nbsp;&nbsp;
                    <i class="el-icon-edit" v-on:click="roomEdit(room.id)"></i>&nbsp;&nbsp;
                     <span v-on:click="roomIsactive(room)">{{room.name}}</span>&nbsp;&nbsp;<i class="el-icon-arrow-right"></i>
                </p>
          </el-col>
          <el-col :span="3" class="bor1" v-show="addPackage">
              <a href="javascript:;" class="addRoom" v-on:click="addPackageAlert = true">添加</a><br>

              <!-- 添加套餐 -->
              <el-dialog title="提示" v-model="addPackageAlert" size="tiny" style="text-align:left;">
                <el-form :model="packageMsg">
                  <el-form-item label="名称" :label-width="width">
                    <el-input v-model="packageMsg.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="选择设备" :label-width="width">
                    <el-select v-model="packageMsg.region" placeholder="选择设备">
                      <el-option
                      :key="equipmentList"
                      v-for="equipmentList in equipmentLists"
                      :label="equipmentList.name" value="shanghai"></el-option>
                    </el-select>
                  </el-form-item>
                  <div class="tableContent">
                    <table cellspacing="0" cellpadding="0" v-for="equipmentController in equipmentControllers">
                      <tr>
                        <th>名称</th>
                        <th>类型</th>
                        <th>串口号</th>
                        <th>站号</th>
                      </tr>
                      <tr>
                        <td>{{equipmentController.name}}</td>
                        <td><input type="text" name="" value="" placeholder="请编辑"></td>
                        <td><input type="text" name="" value="" placeholder="请编辑"></td>
                        <td><input type="text" name="" value="" placeholder="请编辑"></td>
                      </tr>
                    </table>
                  </div>
                  <div style="height:20px;"></div>
                  <el-button type="primary">测试</el-button>

                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="addPackageAlert = false">取 消</el-button>
                  <el-button type="primary">确 定</el-button>
                </span>
              </el-dialog>

              <p class="roomlist" v-for="meal in packages" :class="{ isActive: meal.isActive }" v-on:click="packageIsactive(meal)">
                   {{meal.packagename}}&nbsp;&nbsp;<i class="el-icon-arrow-right"></i>
              </p>
          </el-col>
          <el-col :span="18" class="bor1" v-if="next">
              <a href="javascript:;" class="addRoom">&nbsp;</a>
              <p class="roomlist listDetial">
                <span>001</span>
                <span>设备A</span>
                <span>标准设备</span>
                <span>站号</span>
                <span>开启</span>
              </p>
              <p class="roomlist listDetial">
                <span>001</span>
                <span>设备A</span>
                <span>标准设备</span>
                <span>站号</span>
                <span>开启</span>
              </p>
          </el-col>
        </div>
        </transition>
      </div>
    </el-row>

    <!-- 修改地点 -->
    <div class="editAlert" v-if="editAlert">
      <div class="formMsg">
        <form class="el-form editForm">
          <div class="el-form-item">
            <label for="" class="el-form-item__label">地点名称：</label><input class="el-input__inner w800" type="text" name="" v-model="editDate.name">
          </div>
          <div class="el-form-item">
            <label for="" class="el-form-item__label">省/市/区：</label>
            <select class="select el-select-dropdown__list" v-model="editDate.provinceId"  @change="editProvince">
              <option v-for="province in addressData.provinces" :value="province.provinceId" class="el-select-dropdown__item">{{province.name}}</option>
            </select>
            <select class="select" v-model="editDate.cityId" @change="editCity">
              <option class="el-select-dropdown__item"
              v-for="city in editCitys" :value="city.cityId">{{city.name}}</option>
            </select>
            <select class="select" v-model="editDate.areaId" @change="editArea">
              <option class="el-select-dropdown__item"
              v-for="area in editAreas" :value="area.areaId">{{area.name}}</option>
            </select>
          </div>
          <div class="el-form-item">
            <label for="" class="el-form-item__label">详细地址：</label><input class="el-input__inner w800" type="text" name="" v-model="editDate.describes">
          </div>
          <div class="el-form-item">
            <label for="" class="el-form-item__label">经纬度：</label>
            <span >X: </span><div class="w800 w50 el-input"><input type="text" autocomplete="off" class="el-input__inner" v-model="editDate.positionX"></div>
            <span >Y: </span><div class="w800 w50 el-input"><input type="text" autocomplete="off" class="el-input__inner" v-model="editDate.positionY"></div>
          </div>
          <baidu-map class="map-container" :center="{lng: editDate.positionX, lat: editDate.positionY}" :zoom="zoom" style="width:990px;height:500px;margin:0 auto;">
            <bm-view class="bm-view" >
            </bm-view>
            <bm-local-search
             :auto-viewport="true" style="display:none"></bm-local-search>
          </baidu-map>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editAlert = false">取 消</el-button>
            <el-button type="primary" v-on:click="editaddressMsg">确 定</el-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import global from '../../global/global'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      addRoomName: '',
      addRoomAlert: false,
      addressAlert: false,
      editAlert: false,
      delAlert: false,
      addRoomBtn: true,
      editRoomBtn: false,
      addPackageAlert: false,
      width: '80px',
      addressId: null,
      addresslists: [],
      rooms: {
        locationid: null,
        roomlist: [],
        name: null
      },
      select: '310000',
      addPackage: false,
      equipmentLists: [], // 设备列表
      equipmentControllers: [
        { name: '123' },
        { name: '456' },
        { name: '456' },
        { name: '456' }
      ], // 设备控制器
      packageMsg: {
        name: null,
        equipment: null
      },
      packages: [
        { packagename: '套餐1', isActive: false },
        { packagename: '套餐2', isActive: false },
        { packagename: '套餐3', isActive: false }
      ],
      next: false,
      addressData: {
        systemId: this.$route.params.id,
        provinces: null,
        selectProvince: null,
        citys: null,
        selectCity: null,
        areas: null,
        selectArea: null,
        name: null,
        address: null,
        keyword: '北京',
        x: null,
        y: null,
        isOpen: null
      },
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 15,
      search: {
        searchProvinces: null,
        searchProvince: null,
        searchCitys: null,
        searchCity: null,
        searchAreas: null,
        searchArea: null
      },
      editDate: null,
      editCitys: [],
      editAreas: [],
      isOpen: null
    }
  },
  methods: {
    areaIsActive (item, id) {
      var self = this
      this.addressData.isOpen = item
      this.rooms.locationid = id
      axios.post(global.baseUrl + 'location/detail?locationId=' + id + '&token=' + localStorage.token)
      .then((res) => {
        console.log(res)
        self.rooms.roomlist = res.data.data.room
      })
    },
    packageIsactive (meal) {
      var self = this
      this.$nextTick(function () {
        self.packages.forEach(function (item) {
          Vue.set(item, 'isActive', false)
        })
        Vue.set(meal, 'isActive', true)
        self.next = true
      })
    },
    // 返回系统列表
    back () {
      this.$router.push('/admin/system')
    },
    // 省份
    province () {
      this.addressData.selectCity = ''
      this.addressData.selectArea = ''
      console.log(this.addressData.selectProvince)
      this.addressData.citys = this.addressData.selectProvince.city
    },
    searchProvince () {
      this.search.searchCityId = ''
      this.search.searchAreaId = ''
      this.search.searchCitys = this.search.searchProvince.city
    },
    editProvince () {
      var self = this
      axios.post(global.baseUrl + 'area/province?provinceId=' + self.editDate.provinceId)
      .then((res) => {
        self.editCitys = res.data.data.city
      })
    },
    // 市
    city () {
      this.addressData.areas = ''
      this.addressData.areas = this.addressData.selectCity.area
    },
    editCity () {
      var self = this
      if (self.editDate.cityId != null) {
        axios.post(global.baseUrl + 'area/city?cityId=' + self.editDate.cityId)
        .then((res) => {
          self.editAreas = res.data.data.area
        })
      }
    },
    searchCity () {
      this.search.searchAreaId = ''
      this.search.searchAreas = this.search.searchCity.area
    },
    area () {
      this.addressData.keyword = this.addressData.selectProvince.name + this.addressData.selectCity.name + this.addressData.selectArea.name
    },
    editArea () {
      console.log(123213)
      console.log(this.editData.provinceName)
      // this.editData.keyword = this.editData.provinceName + this.editData.cityName + this.editData.areaName
    },
    // 验证坐标
    setPosition (e) {
      this.addressData.keyword = this.addressData.keyword + this.addressData.address
    },
    // 取坐标位置
    syncCenter (e) {
      const {lng, lat} = e.target.getCenter()
      this.addressData.x = lng
      this.addressData.y = lat
    },
    // 添加地点
    addAddress () {
      var self = this
      console.log(this.$route.params.id)
      var addAddressMsg = new FormData()
      addAddressMsg.append('systemId', this.addressData.systemId)
      addAddressMsg.append('provinceId', this.addressData.selectProvince.provinceId)
      addAddressMsg.append('cityId', this.addressData.selectCity.cityId)
      addAddressMsg.append('areaId', this.addressData.selectArea.areaId)
      addAddressMsg.append('positionX', this.addressData.x)
      addAddressMsg.append('positionY', this.addressData.y)
      addAddressMsg.append('name', this.addressData.name)
      addAddressMsg.append('describes', this.addressData.address)
      axios.post(global.baseUrl + 'location/add?token=' + localStorage.token, addAddressMsg)
      .then((res) => {
        console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.addressAlert = false
          global.addSuccess(self, '添加成功')
          self.$nextTick(() => {
            axios.post(global.baseUrl + 'location/list?systemId=' + self.addressData.systemId + '&token=' + localStorage.token)
            .then((res) => {
              console.log(res)
              self.addresslists = res.data.data
            })
          })
        }
      })
    },
    // 通过城市筛选地点
    searchByArea () {
      var searchMsg = new FormData()
      searchMsg.append('systemId', this.addressData.systemId)
      searchMsg.append('provinceId', this.search.searchProvince.provinceId)
      searchMsg.append('cityId', this.search.searchCity.cityId)
      searchMsg.append('areaId', this.search.searchArea.areaId)
      // console.log(this.search)
      axios.post(global.baseUrl + 'location/query?token=' + localStorage.token, searchMsg)
      .then((res) => {
        console.log(res)
      })
    },
    // 编辑地点
    editIsopen (id) {
      this.editAlert = true
      this.addressId = id
      var self = this
      var qingqiu = new FormData()
      qingqiu.append('locationId', id)
      qingqiu.append('token', localStorage.token)
      axios.post(global.baseUrl + 'location/detail', qingqiu)
      .then((res) => {
        // console.log(res.data)
        self.editDate = res.data.data
        console.log(self.editDate)
        self.$nextTick(function () {
          self.editProvince()
          self.editCity()
          self.editArea()
        })
      })
    },
    editaddress (id) {
      console.log(id)
    },
    editaddressMsg () {
      var self = this
      this.editAlert = false
      var addAddressMsg = new FormData()
      addAddressMsg.append('id', this.editDate.id)
      addAddressMsg.append('systemId', this.editDate.systemId)
      addAddressMsg.append('provinceId', this.editDate.provinceId)
      addAddressMsg.append('cityId', this.editDate.cityId)
      addAddressMsg.append('areaId', this.editDate.areaId)
      addAddressMsg.append('positionX', this.editDate.positionX)
      addAddressMsg.append('positionY', this.editDate.positionY)
      addAddressMsg.append('name', this.editDate.name)
      addAddressMsg.append('describes', this.editDate.describes)
      axios.post(global.baseUrl + 'location/update?token=' + localStorage.token, addAddressMsg)
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.addressAlert = false
          global.addSuccess(self, '修改成功')
          self.$nextTick(() => {
            axios.post(global.baseUrl + 'location/list?systemId=' + self.addressData.systemId + '&token=' + localStorage.token)
            .then((res) => {
              console.log(res)
              self.addresslists = res.data.data
            })
          })
        }
      })
    },
    // 删除地点
    delIsopen (id) {
      this.delAlert = true
      this.addressId = id
    },
    deladdress () {
      var self = this
      axios.post(global.baseUrl + 'location/delete?token=' + localStorage.token + '&locationId=' + this.addressId)
      .then((res) => {
        console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.delAlert = false
          global.addSuccess(self, '删除成功')
          self.$nextTick(() => {
            axios.post(global.baseUrl + 'location/list?systemId=' + this.addressData.systemId + '&token=' + localStorage.token)
            .then((res) => {
              self.addresslists = res.data.data
            })
          })
        }
      })
    },
    // 添加泵房
    addroom () {
      var self = this
      this.addRoomAlert = !this.addRoomAlert
      var addroomMsg = new FormData()
      addroomMsg.append('name', this.rooms.name)
      axios.post(global.baseUrl + 'room/add?locationId=' + this.rooms.locationid + '&token=' + localStorage.token, addroomMsg)
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          axios.post(global.baseUrl + 'location/detail?locationId=' + self.rooms.locationid + '&token=' + localStorage.token)
          .then((res) => {
            console.log(res)
            self.rooms.roomlist = res.data.data.room
          })
        }
      })
    },
    // 删除泵房
    roomDelete (item, id, roomId) {
      // console.log(roomId)
      var self = this
      axios.post(global.baseUrl + 'room/delete?roomId=' + roomId + '&token=' + localStorage.token)
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.areaIsActive(item, id)
        }
      })
    },
    roomIsactive (room) {
      this.addPackage = true
      this.isOpen = room
    },
    roomEdit (roomid) {
      this.addRoomBtn = false
      this.editRoomBtn = true
      var self = this
      this.addRoomAlert = !this.addRoomAlert
      axios.post(global.baseUrl + 'room/detail?token=' + localStorage.token + '&roomId=' + roomid)
      .then((res) => {
        self.rooms = res.data.data
      })
    },
    editroom () {
      console.log(123)
    }
  },
  created () {
    var self = this
    // 获取城市列表
    axios.post(global.baseUrl + 'area/areas')
    .then((res) => {
      self.addressData.provinces = res.data.data
      self.search.searchProvinces = res.data.data
    })
    // 获取地点列表
    axios.post(global.baseUrl + 'location/list?systemId=' + this.addressData.systemId + '&token=' + localStorage.token)
    .then((res) => {
      // console.log(res)
      self.addresslists = res.data.data
    })
    // 获取设备列表
    axios.get(global.baseUrl + 'device/list?token=' + localStorage.token)
    .then((res) => {
      console.log(res)
      self.equipmentLists = res.data.data
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.areaRevise,.areaDel{
  display: inline-block;
  width: 18px;
  height: 18px;
  margin: 0 10px;
}
.tableContent{
  max-height: 300px;
  overflow-y: scroll;
}
.areaListDetial table{
  width: 100%;
  margin-bottom: 20px;
}
.areaListDetial table tr th{
  background-color: rgb(229,229,229);
}
.areaListDetial table tr th,.areaListDetial table tr td{
  display: table-cell;
  width: 25%;
  text-align: center;
  min-height: 40px;
  height: 40px;
  border: 1px solid #e2e2e2;
}
.areaListDetial table tr td input{
  width: 100%;
  outline: none;
  border: none;
  text-align: center;
}
.select{
  height: 36px;
  border-radius: 6px;
  margin-right: 5px;
  outline: none;
}
.editForm {
  margin: 50px 0 ;
}
.editForm label{
  margin-left: 30px;
}
.editAlert{
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}
.editAlert .formMsg{
  position: absolute;
  left: 50%;
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  box-sizing: border-box;
  /*width: 1050px;*/
  /*height: 1000px;*/
  top: 15%;
}
.formMsg .dialog-footer{
  margin-top: 40px;
  text-align: center;
}
.formMsg .el-button{
  width: 200px;
  height: 40px;
}
.formMsg .el-button--default{
  margin-right: 90px;
}
.w50{
  width: 100px!important;
}
.areaRevise:hover,.areaDel:hover{
  cursor: pointer;
}
.map-container,.bm-view{
  height: 500px;
}
.setaddress{
  float: left;
  -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    position: relative;
    left: 10px;
}
.setaddress:hover{
  border-color: #8391a5;
}
.setaddress:focus{
  border-color: #20a0ff;
  outline: none
}
.areaRevise{
  background: url('../../images/revise.png')no-repeat;
}
.areaDel{
  background: url('../../images/del.png')no-repeat;
}
.back{
  font-size: 16px;
}
.back:hover{
  cursor: pointer;
}
.w800{
  width: 800px;
}
.areaListTitle{
  height: 60px;
  line-height: 60px;
  /*border: 1px solid;
  border-bottom: none;*/
}
.arealists{
  height: 60px;
  overflow: hidden;
  border-bottom: 1px solid #e5e5e5;
}
.arealists.active{
  height: auto;
  transition: height .5s;
}
.amap-page-container {
  margin: auto;
}
.amap-page-container .el-vue-amap {
  height: 400px;
}
.search-box {
  position: relative;
  top: 65px;
  left: 20px;
}
.arealists.active .el-icon-caret-bottom{
  transform: rotate(180deg);
  transition: transform .5s;
}
.areaListDetial{
  overflow: hidden;
  border-top: 1px solid rgb( 229, 229, 229 );
  border-bottom: 1px solid rgb( 229, 229, 229 );
  width: 90%;
  margin: 0 auto 50px;
}
.listDetial span{
  display: inline-block;
  width: 19%;
}
.bor1{
  border: 1px solid;
  border-width: 1px;
  border-color: rgb( 229, 229, 229 );
  border-style: solid;
  border-radius: 5px;
  height: 331px;
  overflow: auto;
}
.rooms,.package{
  width: 198px;
}
.left{
  border-width: 1px;
  border-color: rgb( 229, 229, 229 );
  border-style: solid;
  border-radius: 5px;
  float: left;
  height: 331px;
}
.roomlist{
  margin: 20px 0;
}
.roomlist:hover{
  cursor: pointer;
}
.roomlist.active,.roomlist.isActive{
  color: rgba( 20, 135, 202, 0.8 );
}
.roomlist.active .el-icon-arrow-right,.roomlist.isActive .el-icon-arrow-right{
  transform: rotate(180deg);
}
.addRoom{
  color: #000;
  display: inline-block;
  border-bottom: 1px solid;
  /*padding: 20px 70px;*/
  width: 158px;
  height: 30px;
  margin-top: 20px;
}
.areaList{
  text-align: center;
  font-size: 14px;
  border-radius: 5px;
  background-color: rgb( 255, 255, 255 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  margin-top: 20px;
}
</style>
