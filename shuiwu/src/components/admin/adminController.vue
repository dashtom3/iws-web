<template>
  <div class="controller">
    <div class="addController">
      <el-button type="primary" v-on:click="addController">添加控制器</el-button>
    </div>

    <!-- 添加控制器 -->
    <el-dialog v-model="addControllerAlert" class="addcontro">
      <el-form :model="addControllerDate" label-position="left">
        <el-form-item label="类型" :label-width="width">
          <el-select v-model="addControllerDate.type" placeholder="请选择类型" >
            <el-option
            v-for="type in controllerTypes"
            :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" :label-width="width">
          <el-input v-model="addControllerDate.name" auto-complete="off" class="w800 btc" placeholder="请编辑"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="width">
          <el-input v-model="addControllerDate.describes" auto-complete="off" class="w800" placeholder="请编辑"></el-input>
        </el-form-item>
        <el-form-item label="通讯协议" :label-width="width">
          <el-select v-model="addControllerDate.protocol" placeholder="请选择通讯协议" >
            <el-option :label="'TCP'" :value="'TCP'"></el-option>
            <el-option :label="'MODBUS'" :value="'MODBUS'"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="通讯协议" :label-width="width">
          <el-input v-model="addControllerDate.protocol" auto-complete="off" class="w800 btc wj800" placeholder="请编辑"></el-input>
        </el-form-item> -->
        <el-form-item label="起始寄存器地址" :label-width="width" v-if="addControllerDate.protocol == 'TCP'">
          <el-input v-model="addControllerDate.start" auto-complete="off" class="w800 btc wj800" placeholder="请编辑"></el-input>
        </el-form-item>
        <el-form-item label="字段数" :label-width="width">
          <el-input v-model="addControllerDate.count" auto-complete="off" class="w800 btc" placeholder="请编辑"></el-input>
        </el-form-item>
        <!-- 控制器参数 -->
        <div class="" style="position:relative;top:-10px;">
          <el-form-item label="参数" :label-width="width" style="border-bottom:1px solid #eeeeee">
          </el-form-item>
          <el-form-item label="名称" :label-width="width">
            <el-input v-model="field.name" auto-complete="off" class="w200" placeholder="请编辑"></el-input>
            <label class="m20">单位</label>
            <el-input v-model="field.unit" auto-complete="off" class="w200" placeholder="请编辑"></el-input>
            <label class="m20">值意义</label>
            <el-input v-model="field.describes" auto-complete="off" class="w200" placeholder="请编辑"></el-input>
            <label class="m20">参数类型</label>
            <el-select v-model="field.roleId" placeholder="请选择类型">
              <el-option v-if="parameter.protocol == addControllerDate.protocol"
              v-for="parameter in ParameterType"
              :label="parameter.describes" :value="parameter.id"></el-option>
            </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span v-show="field.roleId === 1 || field.roleId === 10 || field.roleId === 9 ">
              <div class="h20"></div>
              <label class="" style="margin-right:20px">倍率</label>
              <el-input v-model="field.multiple" auto-complete="off" class="w200 w100" placeholder="请编辑"></el-input>
              <label class="m20">上限</label>
              <el-input v-model="field.max" auto-complete="off" class="w200 w100" placeholder="请编辑"></el-input>
              <label class="m20">下限</label>
              <el-input v-model="field.min" auto-complete="off" class="w200 w100" placeholder="请编辑"></el-input>
              <label class="m20">小数</label>
              <el-input v-model="field.length" auto-complete="off" class="w200 w100" placeholder="请编辑"></el-input>
              <label class="m20" v-if="addControllerDate.type === 2">地址</label>
              <el-input v-model="field.address" auto-complete="off" class="w200 w100" placeholder="请编辑" v-if="addControllerDate.type === 2"></el-input>
            </span>
            <el-button type="button" icon="plus" class="add" v-on:click="addControllerType"></el-button>
          </el-form-item>
        </div>
        <div class="parameter">
          <div class="parametertitle">
            <span class="parametername w80">编号</span>
            <span class="parametername w247">名称</span>
            <span class="parametercompany w247">单位</span>
            <span class="parameterval w247">值意义</span>
            <span class="parameterstate w247">类型</span>
            <span class="parameterrate w80">倍率</span>
            <span class="parametertop w80">上限</span>
            <span class="parameterbottom w80">下限</span>
            <span class="parameterbottom w80">小数</span>
            <span class="parameterbottom w80">地址</span>
            <span class="parameteros w80">操作</span>
          </div>
          <div class="parameterlist" v-for="(fieldMsg, index) in addControllerDate.fields">
            <span class="parametername w80">{{index+1}}</span>
            <span class="parametername w247">{{fieldMsg.name}}</span>
            <span class="parametercompany w247">{{fieldMsg.unit}}</span>
            <span class="parameterval w247">{{fieldMsg.describes}}</span>
            <span class="parameterstate w247">{{fieldMsg.roleId}}</span>
            <span class="parameterrate w80">{{fieldMsg.multiple}}</span>
            <span class="parametertop w80">{{fieldMsg.max}}</span>
            <span class="parameterbottom w80">{{fieldMsg.min}}</span>
            <span class="parameterbottom w80">{{fieldMsg.length}}</span>
            <span class="parameteros w80" v-on:click="delControllerType(index)" style="cursor:pointer;color:red;">删除</span>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addControllerAlert = false">取 消</el-button>
        <el-button type="primary" @click="addControllerPost">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 控制器列表 -->
    <div class="controllerlists">
      <div class="controllertitle">
        <span class="controllerid">编号</span>
        <span class="controllername">名称</span>
        <span class="controllerstate">类型</span>
        <span class="controllerintro">描述</span>
        <span class="controllerhttp">通讯协议</span>
        <span class="controllernumber">参数(个数)</span>
        <span class="controllerOs">操作</span>
      </div>
      <div class="controllerContent" v-for="(controller, index) in controllerlists">
        <span class="controllerid">{{index + 1}}</span>
        <span class="controllername">{{controller.name}}</span>
        <span class="controllerstate">{{controller.typeName}}</span>
        <span class="controllerintro">{{controller.describes}}</span>
        <span class="controllerhttp">{{controller.protocol}}</span>
        <span class="controllernumber">{{controller.count}}</span>
        <span class="controllerOs">
          <i class="eye controllericon" v-on:click="seeController(controller)"></i>
          <el-dialog v-model="viewcontroller" class="lh">
            <div class="viewcontrollertitle">
              <span class="w138">名称</span>
              <span class="w138">描述</span>
              <span class="w138">类型</span>
              <span class="w900">参数</span>
            </div>
            <div class="controllerinfo">
              <span class="w138">{{controllerDetial.name}}</span>
              <span class="w138">{{controllerDetial.describes}}</span>
              <span class="w138">{{controllerDetial.type}}</span>
              <span class="w900">
              <table>
                <tr v-for="field in controllerDetial.fields">
                  <td>{{field.name}}</td>
                  <td>{{field.unit}}</td>
                  <td>{{field.describes}}</td>
                </tr>
              </table>
            </span>
            </div>
            <div slot="footer" class="dialog-footer pt">
              <el-button @click="viewcontroller = !viewcontroller">关 闭</el-button>
            </div>
          </el-dialog>
          <i class="controlleredit controllericon" v-on:click="editController(controller.id)"></i>
          <i class="controllerdel controllericon" v-on:click="deleteShow(controller.id)"></i>
        </span>
      </div>

      <!-- 删除提醒 -->
      <el-dialog
        title="提示"
        :visible.sync="deleteAlert"
        size="tiny">
        <span>确认删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteAlert = false">取 消</el-button>
          <el-button type="primary" @click.native="deleteController">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 修改控制器 -->
      <el-dialog title="修改控制器" v-model="editControllerAlert">
        <el-form :model="editControllerDate">
          <el-form-item label="名称" :label-width="width">
            <el-input v-model="editControllerDate.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="width">
            <el-input v-model="editControllerDate.describes" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editControllerAlert = false">取 消</el-button>
          <el-button type="primary" @click="editControllerPost">确 定</el-button>
        </div>
      </el-dialog>

    </div>
    <div class="block" v-if="controllerArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="controllerArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="controllerArgs.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import global from '../../global/global'
import axios from 'axios'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      addControllerAlert: false,
      viewcontroller: false,
      editControllerAlert: false,
      deleteAlert: false,
      deleteControllerMsg: {
        deviceTermId: null
      },
      addControllerDate: {
        type: null,
        name: null,
        describes: null,
        protocol: null,
        fields: [],
        count: null,
        controllerId: null,
        start: null,
      },
      controllerDetial: '',
      field: {
        number: null,
        roleId: null,
        name: null,
        describes: null,
        unit: null,
        min: null,
        max: null,
        multiple: null,
        length:null,
        address: null
      },
      controllerId: null,
      controllerTypes: null,
      ParameterType: null,
      controllerlists: [],
      width: '70px',
      editControllerDate: {},
      controllerArgs: {
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1
      }
    }
  },
  created () {
    var self = this
    global.apiPost(this,global.baseUrl + 'deviceTerm/typeList', global.postHttpDataWithToken())
    .then((res) => {
      // console.log(res)
      self.controllerTypes = res.data.data
    })
    global.apiPost(this,global.baseUrl + 'deviceTerm/pointRole', global.postHttpDataWithToken())
    .then((res) => {
      // console.log(res)
      self.ParameterType = res.data.data
    })
    this.getControllerLists(this.controllerArgs)
  },
  methods: {
    // 获取控制器列表
    getControllerLists (args) {
      var self = this
      global.apiPost(this,global.baseUrl + 'deviceTerm/list', global.postHttpDataWithToken(args))
      .then((res) => {
        // console.log(res)
        self.controllerlists = res.data.data
        self.controllerArgs.currentPage = res.data.currentPage
        self.controllerArgs.totalPage = res.data.totalPage
      })
    },

    // 添加控制器
    addController () {
      this.addControllerClick = true
      this.addControllerAlert = true
      this.emapyMsg()
    },
    addControllerPost () {
      if (this.addControllerDate.fields.length !== parseInt(this.addControllerDate.count)) {
        alert('当前参数的总个数不等于字段数!')
      } else {
        for (let i in this.addControllerDate.fields) {
          this.addControllerDate.fields[i].number = parseInt(i) + 1
        }
        var self = this
        self.addControllerAlert = false
        this.addControllerDate.fields = JSON.stringify(this.addControllerDate.fields)
        var xhr = new XMLHttpRequest()
        var temp = 'name=' + this.addControllerDate.name + '&token=' + global.getToken() + '&count=' + this.addControllerDate.count + '&protocol=' + this.addControllerDate.protocol + '&type=' + this.addControllerDate.type + '&describes=' + this.addControllerDate.describes
        if(this.addControllerDate.start != null) {
          temp = temp + '&start=' + this.addControllerDate.start
        }
        xhr.open('POST', global.baseUrl + 'deviceTerm/add?'+temp)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(this.addControllerDate.fields)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            global.success(self, '添加成功', '')
            self.getControllerLists(self.controllerArgs)
          }
        }
      }
    },
    // 查看控制器
    seeController (controllerMsg) {
      this.controllerDetial = controllerMsg
      this.viewcontroller = true
    },

    // 增加控制器的参数
    addControllerType () {
      var msg = {
        name: this.field.name,
        describes: this.field.describes,
        unit: this.field.unit,
        min: this.field.min,
        max: this.field.max,
        number: this.field.number,
        roleId: this.field.roleId,
        multiple: this.field.multiple,
        length: this.field.length,
        address: this.field.address
      }
      for (let i in this.field) {
        this.field[i] = null
      }
      this.addControllerDate.fields.push(msg)
    },
    // 删除控制器的参数
    delControllerType (index) {
      this.addControllerDate.fields.splice(index, 1)
    },
    emapyMsg () {
      for (let i in this.addControllerDate) {
        this.addControllerDate[i] = null
      }
      for (let j in this.field) {
        this.field[j] = null
      }
      this.addControllerDate.fields = []
    },

    // 修改控制器
    editController (controllerId) {
      this.editControllerAlert = true
      this.controllerId = controllerId
      var self = this
      global.apiPost(this,global.baseUrl + 'deviceTerm/detail?deviceTermId=' + controllerId + '&token=' + global.getToken()).then((res) => {
        // console.log(res)
        self.editControllerDate = res.data.data
      })
    },
    editControllerPost () {
      var obj = {
        id: this.controllerId,
        name: this.editControllerDate.name,
        describes: this.editControllerDate.describes,
        token: global.getToken()
      }
      var self = this
      global.apiPost(this,global.baseUrl + 'deviceTerm/update', global.postHttpData(obj))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.editControllerAlert = false
          global.success(self, '修改成功', '')
          self.getControllerLists(self.controllerArgs)
        }
      })
    },
    // 删除控制器
    deleteShow (deviceTermId) {
      this.deleteControllerMsg.deviceTermId = deviceTermId
      this.deleteAlert = true
    },
    deleteController () {
      var self = this
      global.apiPost(this,global.baseUrl + 'deviceTerm/delete', global.postHttpDataWithToken(this.deleteControllerMsg))
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          self.deleteAlert = false
          global.success(self, '删除成功', '')
          self.getControllerLists(self.controllerArgs)
        }
      })
    },
    // 分页
    currentPageChange (value) {
      this.controllerArgs.currentPageChange = value
      this.getControllerLists(this.controllerArgs)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addController{
  text-align: right;
}
.pt{
  position: relative;
  top: -20px;
}
.btc::after{
  content: '*(必填)';
  color: red;
  position: absolute;
  right: -65px;
  top: 0;
  font-size: 15px;
}
.addController button{
  border-radius: 3px;
  background-color: rgb( 20, 135, 202 );
  width: 201px;
  height: 41px;
}
.controllerlists{
  margin-top: 20px;
}
.controllerinfo span{
  display: table-cell;
}
.controllertitle,.parametertitle,.viewcontrollertitle{
  border-radius: 6px;
  background-color: rgb( 229, 229, 229 );
}
.m20{
  margin: 0 20px;
}
.w247{
  width: 217px;
}
.w80{
  width: 80px;
}
.w138{
  width: 140px;
}
.w900{
  width: 500px;
}
.pl26{
  position: relative;
  left: -16px;
}
.controllertitle span,.controllerContent span,.parametertitle span{
  margin-right: -3px;
  display: table-cell;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.parameterlist{
  text-align: center;
}
.parameterlist span{
  margin-right: -3px;
  vertical-align:middle;
  display:table-cell;
  line-height: 45px;
}
.controllertitle span{
  font-size: 14px;
  font-weight: 600;
}
.w200{
  width: 200px!important;
}
.w100{
  width: 100px!important;
}
.controllerContent span,.parameterlist span{
  border-bottom: 1px solid rgb( 229, 229, 229 );
  border-right: 1px solid rgb( 229, 229, 229 );
  /*box-sizing: content-box;*/
  box-sizing: border-box;
}
.controllerContent span:first-child,.parameterlist span:first-child{
  border-left: 1px solid rgb( 229, 229, 229 );
}
.controllerid{
  width: 100px;
}
.controllername{
  width: 250px;
}
.controllerstate{
  width: 100px;
}
.controllerintro{
  width: 575px;
}
.controllerhttp{
  width: 430px;
}
.controllernumber{
  width: 100px;
}
.controllerOs{
  width: 174px;
}
.controllericon{
  display: inline-block;
  margin-right: 20px;
}
.controllericon:hover{
  cursor: pointer;
}
.eye{
  width: 23px;
  height: 15px;
  background: url('../../images/see.png');
}
.w800{
  width: 300px!important;
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
</style>
