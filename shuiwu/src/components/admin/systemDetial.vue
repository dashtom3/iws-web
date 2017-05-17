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
          <input v-model="addressData.address" placeholder="请输入详细地址" auto-complete="off" class="w800 setaddress" v-on:blur="addressDetail()">
        </el-form-item>
        <el-form-item label="经纬度">
          &nbsp;&nbsp; &nbsp;&nbsp; <span>X: </span><el-input v-model="addressData.x" auto-complete="off" class="w800 w50"></el-input>
          &nbsp;&nbsp; <span>Y: </span><el-input v-model="addressData.y" auto-complete="off" class="w800 w50"></el-input>
        </el-form-item>
      </el-form>
      <div id="demoComponent" class="demo-component">
        <el-amap vid="amap" zoom="14" :center="addressData.center">
          <el-amap-marker :position="addressData.center"></el-amap-marker>
        </el-amap>
      </div>
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
      <div class="arealists" v-for="(addresslist, index) in addresslists" :class="{active: addressData.isOpen == addresslist}">
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

        <!-- 房间套餐之类的 -->
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
                <!-- 泵房列表 -->
                <p class="roomlist" v-for="(room, num) in rooms.roomlist" :class="{ active: isOpen == room }">
                  <i class="el-icon-delete" v-on:click="roomDelete(addresslist, addresslist.id, room.id)"></i>&nbsp;&nbsp;
                    <i class="el-icon-edit" v-on:click="roomEdit(room.id)"></i>&nbsp;&nbsp;
                     <span v-on:click="roomIsactive(room)">{{room.name}}</span>&nbsp;&nbsp;<i class="el-icon-arrow-right"></i>
                </p>
          </el-col>
          <el-col :span="3" class="bor1" v-show="addPackage">
              <a href="javascript:;" class="addRoom" v-on:click="addPackageAlert = true">添加</a><br>

              <!-- 配置控制器 -->
              <el-dialog title="提示" v-model="addPackageAlert" size="tiny" style="text-align:left;">
                <el-form :model="deviceMsg">
                  <el-form-item label="名称" :label-width="width">
                    <el-input v-model="deviceMsg.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="端口号" :label-width="width">
                    <el-input v-model="deviceMsg.port" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="选择设备" :label-width="width">
                    <el-select v-model="deviceMsg.selectDeviceId" placeholder="选择设备" @change="selectDevice(deviceMsg.selectDeviceId)">
                      <el-option
                      :key="equipmentList"
                      v-for="equipmentList in equipmentLists"
                      :label="equipmentList.name" :value="equipmentList.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <div class="tableContent">
                    <table cellspacing="0" cellpadding="0" v-for="(equipmentController, index) in equipmentControllers">
                      <tr>
                        <th>名称</th>
                        <th>站号</th>
                      </tr>
                      <tr>
                        <td>{{equipmentController.name}}</td>
                        <td><input type="text" placeholder="请编辑" v-on:blur="configController(equipmentController.id, index, $event.target.value)"></td>
                      </tr>
                    </table>
                  </div>
                  <div style="height:20px;"></div>
                  <el-button type="primary" v-on:click="testDate">测试</el-button>
                  <p v-model="testResponeMsg"></p>

                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="addPackageAlert = false">取 消</el-button>
                  <el-button type="primary" v-on:click="addControllerDevice">确 定</el-button>
                </span>
              </el-dialog>

              <!-- 配置后的控制器列表 -->
              <p class="roomlist" v-for="meal in packages" :class="{ isActive: meal.isActive }" v-on:click="packageIsactive(meal)">
                   {{meal.name}}&nbsp;&nbsp;<i class="el-icon-arrow-right"></i>
              </p>
          </el-col>
          <el-col :span="18" class="bor1" v-if="next" style="position:relative">
              <a href="javascript:;" class="addRoom">&nbsp;</a>
              <span style="float:right;position:absolute;top:25px;right:25px;">
                <el-button type="primary" size="small" :disabled="configControllerDetialInfos.status === 1" v-on:click="openConfigController(configControllerDetialInfos.groupId)">开启</el-button>
                <el-button type="danger" size="small" :disabled="configControllerDetialInfos.status === 0"
                v-on:click="closeConfigController(configControllerDetialInfos.groupId)"
                >关闭</el-button>
              </span>

              <p class="roomlist listDetial" v-for="configControllerDetialInfo in configControllerDetialInfos.devices">
                <span style="text-align:left;">名称：{{configControllerDetialInfo.termName}}</span>
                <span>状态：{{controllerStatus[configControllerDetialInfos.status]}}</span>
                <span>站号：{{configControllerDetialInfo.number}}</span>
              </p>
          </el-col>
        </div>
        </transition>
      </div>
    </el-row>

    <!-- 分页 -->
    <div class="block" v-if="addressArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="addressArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="addressArgs.totalPage">
      </el-pagination>
    </div>

    <!-- 修改地点 -->
    <div class="editAlert" v-if="editAlert">
      <div class="formMsg">
        <form class="el-form editForm">
          <div class="el-form-item">
            <label for="" class="el-form-item__label">地点名称：</label><input class="el-input__inner w800" type="text" v-model="editDate.name">
          </div>
          <div class="el-form-item">
            <label for="" class="el-form-item__label">省/市/区：</label>
            <select class="select el-select-dropdown__list" id="editProvince" v-model="editDate.provinceId"  @change="editProvince">
              <option v-for="province in addressData.provinces" :value="province.provinceId" class="el-select-dropdown__item">{{province.name}}</option>
            </select>
            <select class="select" v-model="editDate.cityId" @change="editCity" id="editCity">
              <option class="el-select-dropdown__item"
              v-for="city in editCitys" :value="city.cityId">{{city.name}}</option>
            </select>
            <select class="select" v-model="editDate.areaId" @change="editArea" id="editArea">
              <option class="el-select-dropdown__item"
              v-for="area in editAreas" :value="area.areaId">{{area.name}}</option>
            </select>
          </div>
          <div class="el-form-item">
            <label for="" class="el-form-item__label">详细地址：</label><input class="el-input__inner w800" type="text" name="" v-model="editDate.describes" v-on:blur="editBlur">
          </div>
          <div class="el-form-item">
            <label for="" class="el-form-item__label">经纬度：</label>
            <span >X: </span><div class="w800 w50 el-input"><input type="text" autocomplete="off" class="el-input__inner" v-model="editDate.positionX"></div>
            <span >Y: </span><div class="w800 w50 el-input"><input type="text" autocomplete="off" class="el-input__inner" v-model="editDate.positionY"></div>
          </div>
          <div id="demoComponent" class="demo-component">
            <el-amap vid="amap" zoom="14" :center="[editDate.positionX, editDate.positionY]">
              <el-amap-marker :position="[editDate.positionX, editDate.positionY]"></el-amap-marker>
            </el-amap>
          </div>
          <!-- <baidu-map class="map-container" :center="{lng: editDate.positionX, lat: editDate.positionY}" :zoom="zoom" style="width:990px;height:500px;margin:0 auto;" @moving="editCenter" @moveend="editCenter">
            <bm-view class="bm-view" >
            </bm-view>
            <bm-local-search
             :auto-viewport="true" :keyword="editkeyword" style="display:none"></bm-local-search>
          </baidu-map> -->
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
      searchMsg: {
        s: 'rsv3',
        key: '28966b6be8e4fa0e4c4f4c9b4bf8d3ce',
        offset: '1',
        keywords: null
      },
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
      deviceMsg: {
        roomId: null,
        port: null,
        name: null,
        selectDeviceId: null,
        terms: []
      },
      select: '310000',
      addPackage: false,
      equipmentLists: [], // 设备列表
      equipmentControllers: [], // 设备控制器列表
      packageMsg: {
        name: null,
        equipment: null
      },
      packages: [], // 泵房下配置的控制器列表
      next: false,
      addressData: {
        systemId: this.$route.params.id,
        provinces: null,
        selectProvince: null,
        citys: null,
        center: [116.404, 39.915],
        selectCity: null,
        areas: null,
        selectArea: null,
        name: null,
        address: null,
        x: '116.404',
        y: '39.915',
        isOpen: null
      },
      addressDataNull: {
        systemId: this.$route.params.id,
        provinces: null,
        selectProvince: null,
        citys: null,
        center: [116.404, 39.915],
        selectCity: null,
        areas: null,
        selectArea: null,
        name: null,
        address: null,
        x: '116.404',
        y: '39.915',
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
      editkeyword: null,
      testResponeMsg: null,
      editCitys: [],
      editAreas: [],
      isOpen: null,
      configControllerDetialInfos: [],
      controllerStatus: ['关闭状态', '开启状态'],
      addressArgs: {
        systemId: this.$route.params.id,
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1
      },
      events: {
        init (obj) {
          console.log(obj)
        }
      }
    }
  },
  methods: {
    onSearchResult (pois) {
      console.log(pois)
    },
    areaIsActive (item, id) {
      var self = this
      this.addPackage = false
      this.next = false
      this.addressData.isOpen = item
      this.rooms.locationid = id
      axios.post(global.baseUrl + 'location/detail?locationId=' + id + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        self.rooms.roomlist = res.data.data.room
      })
    },
    selectDevice (id) {
      var self = this
      if (id) {
        axios.get(global.baseUrl + 'device/groupDetail?groupId=' + id + '&token=' + global.getToken())
        .then((res) => {
          self.equipmentControllers = res.data.data.deviceTerms
        })
      }
      return false
    },
    configController (controllerId, index, value) {
      var controllerObj = {
        termId: controllerId,
        number: value
      }
      this.deviceMsg.terms.splice(index, 1, controllerObj)
    },
    // 测试配置好的数据
    testDate () {
      // var self = this
      console.log(this.deviceMsg.terms)
      this.deviceMsg.terms = JSON.stringify(this.deviceMsg.terms)
      var xhr = new XMLHttpRequest()
      xhr.open('POST', global.baseUrl + 'room/testDevice?name=' + this.deviceMsg.name + '&token=' + global.getToken() + '&port=' + this.deviceMsg.port + '&roomId=' + this.deviceMsg.roomId + '&infoId=' + this.deviceMsg.selectDeviceId)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(this.deviceMsg.terms)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(123)
          // console.log(JSON.parse(xhr.responseText).data)
        }
      }
    },
    // 添加配置控制器
    addControllerDevice () {
      var self = this
      this.deviceMsg.terms = JSON.stringify(this.deviceMsg.terms)
      var xhr = new XMLHttpRequest()
      xhr.open('POST', global.baseUrl + 'room/addDevice?name=' + this.deviceMsg.name + '&token=' + global.getToken() + '&port=' + this.deviceMsg.port + '&roomId=' + this.deviceMsg.roomId + '&infoId=' + this.deviceMsg.selectDeviceId)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(this.deviceMsg.terms)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          global.addSuccess(self, '添加成功')
          self.deviceMsg.name = null
          self.deviceMsg.port = null
          self.deviceMsg.selectDeviceId = null
          self.deviceMsg.terms = []
          self.addPackageAlert = false
          self.equipmentControllers = []
          self.testResponeMsg = null
          axios.get(global.baseUrl + 'room/groupList?roomId=' + self.deviceMsg.roomId + '&token=' + global.getToken())
          .then((res) => {
            // console.log(res)
            self.packages = res.data.data
            self.next = false
          })
        }
      }
    },
    packageIsactive (meal) {
      // console.log(meal)
      var self = this
      axios.get(global.baseUrl + 'room/groupDetail?groupId=' + meal.groupId + '&token=' + global.getToken())
      .then((res) => {
        self.configControllerDetialInfos = res.data.data
      })
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
      this.searchMsg.keywords = this.addressData.selectProvince.name + this.addressData.selectArea.name
      this.setPosition(this.searchMsg.keywords)
    },
    editArea () {
      var provinceName = document.getElementById('editProvince')
      var areaName = document.getElementById('editArea')
      this.editDate.provinceName = provinceName.options[provinceName.selectedIndex].text
      this.editDate.areaName = areaName.options[areaName.selectedIndex].text
      this.searchMsg.keywords = this.editDate.provinceName + this.editDate.areaName
      this.editSetPosition(this.searchMsg.keywords)
    },
    editSetPosition (keywords) {
      if (keywords) {
        var self = this
        axios.get('https://restapi.amap.com/v3/place/text?' + global.getHttpData(this.searchMsg))
        .then((res) => {
          if (res.data.pois[0].location) {
            self.editDate.positionX = res.data.pois[0].location.split(',')[0]
            self.editDate.positionY = res.data.pois[0].location.split(',')[1]
          }
        })
      }
    },
    // 高德地图
    addressDetail () {
      this.searchMsg.keywords += this.addressData.address
      this.setPosition(this.searchMsg.keywords)
    },
    setPosition (keywords) {
      if (keywords) {
        var self = this
        axios.get('https://restapi.amap.com/v3/place/text?' + global.getHttpData(this.searchMsg))
        .then((res) => {
          if (res.data.pois[0].location) {
            self.addressData.center = res.data.pois[0].location.split(',')
            self.addressData.x = res.data.pois[0].location.split(',')[0]
            self.addressData.y = res.data.pois[0].location.split(',')[1]
          }
        })
      }
    },
    editBlur () {
      var provinceName = document.getElementById('editProvince')
      var areaName = document.getElementById('editArea')
      this.editDate.provinceName = provinceName.options[provinceName.selectedIndex].text
      this.editDate.areaName = areaName.options[areaName.selectedIndex].text
      this.searchMsg.keywords = this.editDate.provinceName + this.editDate.areaName
      this.searchMsg.keywords += this.editDate.describes
      this.editSetPosition(this.searchMsg.keywords)
    },
    // 添加地点
    addAddress () {
      var self = this
      // console.log(this.$route.params.id)
      var addAddressMsg = new FormData()
      addAddressMsg.append('systemId', this.addressData.systemId)
      addAddressMsg.append('provinceId', this.addressData.selectProvince.provinceId)
      addAddressMsg.append('cityId', this.addressData.selectCity.cityId)
      addAddressMsg.append('areaId', this.addressData.selectArea.areaId)
      addAddressMsg.append('positionX', this.addressData.x)
      addAddressMsg.append('positionY', this.addressData.y)
      addAddressMsg.append('name', this.addressData.name)
      addAddressMsg.append('describes', this.addressData.address)
      axios.post(global.baseUrl + 'location/add?token=' + global.getToken(), addAddressMsg)
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.addressAlert = false
          global.addSuccess(self, '添加成功')
          self.addressData = null
          self.addressData = self.addressDataNull
          self.getAddressLists(self.addressArgs)
        }
      })
    },
    // 通过城市筛选地点
    searchByArea () {
      var searchMsg = new FormData()
      searchMsg.append('systemId', this.addressData.systemId)
      if (this.search.searchProvince) {
        searchMsg.append('provinceId', this.search.searchProvince.provinceId)
      }
      if (this.search.searchCity) {
        searchMsg.append('cityId', this.search.searchCity.cityId)
      }
      if (this.search.searchArea) {
        searchMsg.append('areaId', this.search.searchArea.areaId)
      }
      var self = this
      axios.post(global.baseUrl + 'location/query?token=' + global.getToken(), searchMsg)
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.addresslists = res.data.data
        }
      })
    },
    // 编辑地点
    editIsopen (id) {
      this.editAlert = true
      this.addressId = id
      var self = this
      var qingqiu = new FormData()
      qingqiu.append('locationId', id)
      qingqiu.append('token', global.getToken())
      axios.post(global.baseUrl + 'location/detail', qingqiu)
      .then((res) => {
        console.log(res.data)
        self.editDate = res.data.data
        self.$nextTick(function () {
          self.editProvince()
          self.editCity()
        })
      })
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
      axios.post(global.baseUrl + 'location/update?token=' + global.getToken(), addAddressMsg)
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.addressAlert = false
          global.addSuccess(self, '修改成功')
          self.$nextTick(() => {
            axios.post(global.baseUrl + 'location/list?systemId=' + self.addressData.systemId + '&token=' + global.getToken())
            .then((res) => {
              // console.log(res)
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
      axios.post(global.baseUrl + 'location/delete?token=' + global.getToken() + '&locationId=' + this.addressId)
      .then((res) => {
        console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.delAlert = false
          global.addSuccess(self, '删除成功')
          self.getAddressLists(self.addressArgs)
        }
      })
    },
    // 添加泵房
    addroom () {
      var self = this
      this.addRoomAlert = !this.addRoomAlert
      var addroomMsg = new FormData()
      addroomMsg.append('name', this.rooms.name)
      axios.post(global.baseUrl + 'room/add?locationId=' + this.rooms.locationid + '&token=' + global.getToken(), addroomMsg)
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          axios.post(global.baseUrl + 'location/detail?locationId=' + self.rooms.locationid + '&token=' + global.getToken())
          .then((res) => {
            // console.log(res)
            self.rooms.roomlist = res.data.data.room
          })
        }
      })
    },
    // 删除泵房
    roomDelete (item, id, roomId) {
      // console.log(roomId)
      var self = this
      axios.post(global.baseUrl + 'room/delete?roomId=' + roomId + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.areaIsActive(item, id)
        }
      })
    },
    roomIsactive (room) {
      var self = this
      this.deviceMsg.roomId = room.id
      axios.get(global.baseUrl + 'room/groupList?roomId=' + room.id + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        self.packages = res.data.data
      })
      this.addPackage = true
      this.isOpen = room
    },
    roomEdit (roomid) {
      this.addRoomBtn = false
      this.editRoomBtn = true
      var self = this
      this.addRoomAlert = !this.addRoomAlert
      axios.post(global.baseUrl + 'room/detail?token=' + global.getToken() + '&roomId=' + roomid)
      .then((res) => {
        self.rooms = res.data.data
      })
    },
    editroom () {
      // console.log(123)
    },
    // 开启配置好的控制器
    openConfigController (groupId) {
      var groupMsg = {
        groupId: groupId
      }
      var self = this
      axios.post(global.baseUrl + 'room/start', global.postHttpDataWithToken(groupMsg))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
        }
      })
    },
    closeConfigController (groupId) {
      var groupMsg = {
        groupId: groupId
      }
      var self = this
      axios.post(global.baseUrl + 'room/close', global.postHttpDataWithToken(groupMsg))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
        }
      })
    },
    // 获取地点列表
    getAddressLists (args) {
      var self = this
      axios.post(global.baseUrl + 'location/list', global.postHttpDataWithToken(args))
      .then((res) => {
        // console.log(res)
        self.addresslists = res.data.data
        self.addressArgs.currentPage = res.data.currentPage
        self.addressArgs.totalPage = res.data.totalPage
      })
    },
    // 分页
    currentPageChange (value) {
      this.addressArgs.currentPage = value
      this.getAddressLists(this.addressArgs)
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
    // 获取设备列表
    axios.get(global.baseUrl + 'device/list?token=' + global.getToken())
    .then((res) => {
      self.equipmentLists = res.data.data
    })
    this.getAddressLists(this.addressArgs)
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
#demoComponent{
  height: 500px;
  width: 100%;
}
.amap-cointainer{
  height: 500px;
  width: 500px;
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
  width: 30%;
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
