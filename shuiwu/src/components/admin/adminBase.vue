<template>
  <div class="base">
    <div class="addController">
      <el-button type="primary" v-on:click="addBaseAlert = true">添加</el-button>
    </div>

    <!-- 添加设备 -->
    <el-dialog title="添加设备" v-model="addBaseAlert">
      <el-form ref="addBaseMsg" :model="addBaseMsg" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addBaseMsg.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" style="text-align:left">
          <el-select v-model="addBaseMsg.region" placeholder="请选择设备类型">
            <el-option
            :key="baseType"
            v-for="baseType in baseTypes"
            :label="baseType.name" :value="baseType.id"></el-option>
          </el-select><br>
          <div style="height:20px;"></div>
          <label for="" class="left15">压力表</label>
          <el-select v-model="addBaseMsg.region" placeholder="请选择活动区域" style="width:160px;">
            <el-option
            :key="pressureList"
            v-for="pressureList in pressureLists"
            :label="pressureList.name" :value="pressureLists.id"></el-option>
          </el-select>
          <label for="" class="left15">电表</label>
          <el-select v-model="addBaseMsg.region" placeholder="请选择活动区域"style="width:160px;">
            <el-option
            :key="meter"
            v-for="meter in meters"
            :label="meter.name" :value="meter.id"></el-option>
          </el-select><br>
          <div style="height:20px;"></div>
          <label for="" class="left15">流量计</label>
          <el-select v-model="addBaseMsg.region" placeholder="请选择活动区域"style="width:160px;">
            <el-option
            :key="flowmeter"
            v-for="flowmeter in flowmeters"
            :label="flowmeter.name" :value="flowmeter.id"></el-option>
          </el-select>
          <label for="" class="left15">PLC控制器</label>
          <el-select v-model="addBaseMsg.region" placeholder="请选择活动区域"style="width:160px;">
            <el-option 
            :key="controllerList"
            v-for="controllerList in controllerLists"
            :label="controllerList.name" :value="controllerList.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBaseAlert = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设备列表 -->
    <div class="baseTitle baseWidth">
      <span>名称</span>
      <span>类型</span>
      <span>描述</span>
      <span>图片</span>
      <span>控制器</span>
      <span>操作</span>
    </div>
    <div class="baseList baseWidth" v-for="baseList in baseLists">
      <span>{{baseList.name}}</span>
      <span>{{baseList.type}}</span>
      <span>{{baseList.describes}}</span>
      <span><img src="" alt=""></span>
      <span>
        <p v-for="device in baseList.devices">{{device.name}}</p>
      </span>
      <span>
        <i class="controlleredit controllericon" v-on:click="editBase(baseList.id)"></i>
        <i class="controllerdel controllericon" v-on:click="deleteBase(baseList.id)"></i>
      </span>
    </div>

    <!-- 修改设备 -->
    <el-dialog title="修改设备" v-model="editBaseAlert" size="tiny">
      <el-form ref="addBaseMsg" :model="addBaseMsg" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addBaseMsg.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBaseAlert = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import global from '../../global/global'
export default {
  data () {
    return {
      addBaseAlert: false,
      editBaseAlert: false,
      baseLists: [],
      baseTypes: [],
      pressureLists: [],
      meters: [],
      flowmeters: [],
      controllerLists: [],
      addBaseMsg: {
        name: null,
        devices: []
      }
    }
  },
  created () {
    this.getBaseList()
    this.getbaseTypes()
    this.getFourDate(1, this.pressureLists)
    this.getFourDate(2, this.meters)
    this.getFourDate(3, this.flowmeters)
    this.getFourDate(4, this.controllerLists)
  },
  methods: {
    addBase () {
      console.log(123)
    },
    // 获取设备列表
    getBaseList () {
      var self = this
      axios.get(global.baseUrl + 'device/list?token=' + localStorage.token)
      .then((res) => {
        // console.log(res)
        self.baseLists = res.data.data
      })
    },
    // 获取设备类型
    getbaseTypes () {
      var self = this
      axios.get(global.baseUrl + 'device/groupType?token=' + localStorage.token)
      .then((res) => {
        self.baseTypes = res.data.data
      })
    },
    // 修改设备
    editBase (baseId) {
      this.editBaseAlert = true
      var self = this
      axios.get(global.baseUrl + 'device/deviceDetail?deviceId=' + baseId + '&token=' + localStorage.token)
      .then((res) => {
        self.addBaseMsg = res.data.data
      })
    },
    // 获取四个表数据
    getFourDate (type, obj) {
      axios.post(global.baseUrl + 'deviceTerm/list?token=' + localStorage.token + '&type=' + type)
      .then((res) => {
        // console.log(res)
        obj = res.data.data
      })
    },
    // 删除设备
    deleteBase (baseId) {
      console.log(baseId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.base{
  text-align: center;
}
.addController{
  text-align: right;
  margin-bottom: 20px;
}
.addController button{
  border-radius: 3px;
  background-color: rgb( 20, 135, 202 );
  width: 201px;
  height: 41px;
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
  display: table-cell;
  min-height: 40px;
  text-align: center;
  font-size: 14px;
  width: 270px;
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
.baseWidth span:nth-child(3){
  width: 395px;
}
.baseWidth span:last-child{
  width: 120px;
}
</style>
