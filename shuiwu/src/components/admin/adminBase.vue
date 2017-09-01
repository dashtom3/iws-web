<template>
  <div class="base">
    <div class="addController">
      <el-button type="primary" v-on:click="addBaseClick">添加</el-button>
    </div>

    <!-- 添加设备 -->
    <el-dialog title="添加设备" v-model="addBaseAlert">
      <el-form ref="addBaseMsg" :model="addBaseMsg" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addBaseMsg.name" placeholder="请编辑"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" style="text-align:left" class="pt20">
          <div class="bgCf">
            <div class="h20"></div>
            <el-select v-model="addBaseMsg.type" placeholder="请选择设备类型" class="pwtc">
              <el-option

              v-for="baseType in baseTypes"
              :label="baseType.name" :value="baseType.id"></el-option>
            </el-select><br>
            <div style="height:20px;"></div>
            <label for="" class="left15">压力表</label>
            <el-select v-model="addBaseMsg.selectPressure" placeholder="请选择压力表" style="width:160px;margin-right:15px;">
              <el-option

              v-for="pressureList in pressureLists"
              :label="pressureList.name" :value="pressureList.id"></el-option>
            </el-select>
            <label for="" class="left15">电表</label>
            <el-select v-model="addBaseMsg.selectMeter" placeholder="请选择电表"style="width:160px;">
              <el-option

              v-for="meter in meters"
              :label="meter.name" :value="meter.id"></el-option>
            </el-select><br>
            <div style="height:20px;"></div>
            <label for="" class="left15">流量计</label>
            <el-select v-model="addBaseMsg.selectFlowmeter" placeholder="请选择流量计"style="width:160px;margin-right:15px;">
              <el-option

              v-for="flowmeter in flowmeters"
              :label="flowmeter.name" :value="flowmeter.id"
              ></el-option>
            </el-select>
            <label for="" class="left15">PLC控制器</label>
            <el-select v-model="addBaseMsg.selectController" placeholder="请选择PLC控制器"style="width:160px;">
              <el-option

              v-for="controllerList in controllerLists"
              :label="controllerList.name" :value="controllerList.id"></el-option>
            </el-select>
          </div>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBaseAlert = false">取 消</el-button>
        <el-button type="primary" v-on:click="addBasePost">确 定</el-button>
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
      <span>{{baseListTypes[baseList.type-1]}}</span>
      <span>{{baseList.describes}}</span>
      <span><img src="" alt=""></span>
      <span>
        <p v-for="device in baseList.deviceTerms" class="controllerMargin">{{device.name}}</p>
      </span>
      <span>
        <i class="controlleredit controllericon" v-on:click="editBase(baseList.id)"></i>
        <i class="controllerdel controllericon" v-on:click="deleteBaseShow(baseList.id)"></i>
      </span>
    </div>
    <!-- 分页 -->
    <div class="block" v-if="baseListArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="baseListArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="baseListArgs.totalPage">
      </el-pagination>
    </div>

    <!-- 确认删除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteBaseAlert"
      size="tiny">
      <span>确认删除该设备吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteBaseAlert = false">取 消</el-button>
        <el-button type="primary" @click="deleteBase">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改设备 -->
    <el-dialog title="修改设备" v-model="editBaseAlert" size="tiny">
      <el-form ref="editBaseMsg" :model="editBaseMsg" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="editBaseMsg.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBaseAlert = false">取 消</el-button>
        <el-button type="primary" v-on:click="editBasePost">确 定</el-button>
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
      pressureLists: null,
      meters: null,
      flowmeters: null,
      controllerLists: null,
      baseListTypes: ['水箱变频', '户外叠压', '管网叠压', '箱式叠压'],
      addBaseMsg: {
        name: null,
        terms: [],
        type: null,
        selectPressure: null,
        selectMeter: null,
        selectFlowmeter: null,
        selectController: null,
        token: global.getToken()
      },
      editBaseMsg: {
        id: null,
        name: null,
        token: global.getToken()
      },
      baseMsg: {
        groupId: null
      },
      deleteBaseAlert: false,
      baseListArgs: {
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1,
        token: global.getToken()
      }
    }
  },
  created () {
    this.getBaseList(this.baseListArgs)
    this.getbaseTypes()
  },
  methods: {
    // 获取设备列表
    getBaseList (args) {
      var self = this
      global.apiGet(this,global.baseUrl + 'device/list?' + global.getHttpData(args))
      .then((res) => {
        console.log(res)
        self.baseLists = res.data.data
        self.baseListArgs.currentPage = res.data.currentPage
        self.baseListArgs.totalPage = res.data.totalPage
      })
    },
    // 添加设备
    addBaseClick () {
      this.addBaseAlert = true
      var self = this
      global.apiPost(this,global.baseUrl + 'deviceTerm/list?token=' + global.getToken() + '&type=1')
      .then((res) => {
        self.controllerLists = res.data.data
      })
      global.apiPost(this,global.baseUrl + 'deviceTerm/list?token=' + global.getToken() + '&type=2')
      .then((res) => {
        self.pressureLists = res.data.data
      })
      global.apiPost(this,global.baseUrl + 'deviceTerm/list?token=' + global.getToken() + '&type=3')
      .then((res) => {
        self.flowmeters = res.data.data
      })
      global.apiPost(this,global.baseUrl + 'deviceTerm/list?token=' + global.getToken() + '&type=4')
      .then((res) => {
        self.meters = res.data.data
      })
    },
    // 获取设备类型
    getbaseTypes () {
      var self = this
      global.apiGet(this,global.baseUrl + 'device/groupType?token=' + global.getToken())
      .then((res) => {
        self.baseTypes = res.data.data
      })
    },
    // 修改设备
    editBase (baseId) {
      this.editBaseAlert = true
      this.editBaseMsg.id = baseId
      var self = this
      global.apiGet(this,global.baseUrl + 'device/groupDetail?groupId=' + baseId + '&token=' + global.getToken())
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.editBaseMsg = res.data.data
        }
      })
    },
    editBasePost () {
      var self = this
      global.apiPost(this,global.baseUrl + 'device/update?id=' + this.editBaseMsg.id + '&name=' + this.editBaseMsg.name + '&token=' + global.getToken())
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.editBaseAlert = false
          global.success(self, '修改成功', '')
          self.getBaseList(self.baseListArgs)
        }
      })
    },
    // 添加设备
    addBasePost () {
      if (!this.addBaseMsg.selectController && !this.addBaseMsg.selectFlowmeter && !this.addBaseMsg.selectPressure && !this.addBaseMsg.selectMeter) {
        alert('请选择至少一种控制器')
      } else {
        this.addBaseMsg.terms = [this.addBaseMsg.selectController, this.addBaseMsg.selectFlowmeter, this.addBaseMsg.selectPressure, this.addBaseMsg.selectMeter].join(',')
        var self = this
        global.apiPost(this,global.baseUrl + 'device/addGroup', global.postHttpData(this.addBaseMsg))
        .then((res) => {
          if (res.data.callStatus === 'SUCCEED') {
            self.addBaseAlert = false
            self.emptyFun()
            self.addBaseMsg['token'] = global.getToken()
            global.success(self, '添加成功', '')
            self.getBaseList(self.baseListArgs)
          }
        })
      }
    },
    // 删除设备
    deleteBaseShow (baseId) {
      this.deleteBaseAlert = true
      this.baseMsg.groupId = baseId
    },
    deleteBase () {
      var self = this
      global.apiPost(this,global.baseUrl + 'device/delete', global.postHttpDataWithToken(this.baseMsg))
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.deleteBaseAlert = false
          global.success(self, '删除成功', '')
          self.getBaseList(self.baseListArgs)
        }
      })
    },
    // 初始化函数
    emptyFun () {
      for (let i in this.addBaseMsg) {
        this.addBaseMsg[i] = null
      }
    },
    // 分页
    currentPageChange (value) {
      this.baseListArgs.currentPage = value
      this.getBaseList(this.baseListArgs)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.base{
  text-align: center;
}
.bgCf{
  background-color: #eeeeee;
  padding: 30px;
  position: relative;
  top: -30px;
}
.pwtc{
  position: relative;
  top: -20px;
}
.pt20{
  position: relative;
  /*top: 15px;*/
  padding: 30px 0;
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
.left15{
  margin:0 15px 0 0;
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
