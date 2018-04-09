<template>
  <div class="testUser">
    <div class="right">
      <span class="kd"></span><span>只读</span>
      <span class="kx"></span><span>只写</span>
      <!-- <span class="fz"></span><span>负责人</span> -->
    </div>
    <div class="addroleBtn">
      <el-button type="primary" @click="addroleAlert">添加角色</el-button>
    </div>
    <el-row :gutter="20" class="userTitle">
      <el-col :span="8"><span>角色名</span></el-col>
      <el-col :span="8"><span>角色权限</span></el-col>
      <el-col :span="8"><span>操作</span></el-col>
    </el-row>
    <el-row :gutter="20"
    :key="user.id"
    v-for="user in rolelists" class="role" :class="{ active: divIsactive == user }">
      <el-col :span="8" style="position:absolute;"><span>{{user.name}}</span></el-col>
      <el-col :span="8" style="margin-left:33.33333%;position:relative;">
        <p v-for="list in user.subitem" class="rolelist" v-on:click="addactive($event, user)"><span><span class="sjf" v-if="user.subitem.length !== 1"></span>{{list.systemName}}&nbsp;{{list.areaName}}</span>
          <span v-if="1 == list.limitation"><span class="kd"></span></span>
          <span v-if="2 == list.limitation"><span class="kd"></span><span class="kx"></span></span>
          <!-- <span v-if="2 == list.limitation"><span class="kd"></span><span class="kx"></span><span class="fz"></span></span> -->
        </p>
      </el-col>
      <el-col :span="8" style="position:absolute;right:0">
        <i class="el-icon-edit icon" v-on:click="edit(user.id)"></i>
        <i class="el-icon-delete icon" v-on:click="del(user.id)"></i>
        <el-dialog title="提示" v-model="isDel" size="tiny" class="line">
          <span>确认删除该角色吗</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isDel = false">取 消</el-button>
            <el-button type="primary" @click="delRole(user.id)">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <div class="block" v-if="rolelistArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="rolelistArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="rolelistArgs.totalPage">
      </el-pagination>
    </div>

   <!-- 添加角色 -->
   <div class="addroles">
     <el-dialog title="添加角色" v-model="roleAlert">
     <el-form :model="addRoleInfo">
       <el-form-item label="角色名称" :label-width="formLabelWidth">
         <el-input v-model="addRoleInfo.name" auto-complete="off" placeholder="请编辑"></el-input>
       </el-form-item>
       <el-form-item label="选择系统" :label-width="formLabelWidth">
         <el-select v-model="addRoleInfo.selectSystem" placeholder="选择系统" @change="systemSelectData">
           <el-option  v-for="system,index in addRoleInfo.systemlists" :label="system.name" :value="index">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="省/市/区" :label-width="formLabelWidth">
         <el-select v-model="addRoleInfo.selectProvince" placeholder="选择省份" value-key="name" @change="province">
           <el-option
           :key="province.id"
           v-for="province in addRoleInfo.provinces"
           :label="province.name"
           :value="province"></el-option>
         </el-select>
         <el-select v-model="addRoleInfo.selectCity" placeholder="选择市" value-key="name" @change="city">
           <el-option
           :key="city.id"
           v-for="city in addRoleInfo.citys"
           :label="city.name"
           :value="city"></el-option>
         </el-select>
         <el-select v-model="addRoleInfo.selectArea" value-key="name" placeholder="选择地区">
           <el-option
           :key="area.id"
           v-for="area in addRoleInfo.areas"
           :label="area.name"
           :value="area"></el-option>
         </el-select>
         <el-select v-model="addRoleInfo.selectJurisdiction" placeholder="设置权限">
           <el-option
           :key="jurisdiction.state"
           v-for="jurisdiction,index in addRoleInfo.jurisdictions"
           :label="jurisdiction.data"
           :value="index"
           ></el-option>
         </el-select>
         <!-- <el-button type="button" icon="el-icon-plus">123</el-button> -->
         <el-button type="button" icon="plus" class="add" v-on:click="addTag"></el-button><br>
         <el-tag
            :key="tag"
            v-for="(tag, index) in tags"
            :closable="true"
            type="gray"
            :close-transition="false"
            @close="delTag(tag, index)"
          class="tags">
          {{tag}}
          </el-tag>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="roleAlert = false">取 消</el-button>
       <el-button type="primary" @click="addRole" v-if="addrolesub">确 定</el-button>
       <el-button type="primary" @click="editRole" v-if="editrolesub">确 定</el-button>
     </div>
    </el-dialog>
   </div>
  </div>
</template>

<script>
import axios from 'axios'
import global from '../../global/global'
// import Vue from 'vue'
export default {
  data () {
    return {
      roleAlert: false,
      formLabelWidth: '100px',
      isDel: false,
      addrolesub: false,
      editrolesub: false,
      divIsactive: null,
      tags: [],
      tagsMsg: [],
      rolelists: [],
      roleId: null,
      addRoleInfo: {
        name: '',
        subitem: [],
        systemlists: [],
        selectSystem: '',
        provinces: '',
        selectProvince: '',
        citys: '',
        selectCity: '',
        areas: '',
        selectArea: '',
        jurisdictions: [
          { data: '只读', state: '1' },
          { data: '读写', state: '2' }
        ],
        selectJurisdiction: 1,
        systemId: '',
        areaId: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rolelistArgs: {
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1
      }
    }
  },
  methods: {
    // 删除地点
    del (id) {
      this.isDel = true
      this.roleId = id
    },
    delRole () {
      var self = this
      global.apiPost(this,global.baseUrl + 'role/delete?roleId=' + this.roleId + '&token=' + global.getToken())
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          self.isDel = false
          global.addSuccess(self, '删除成功')
          self.getRoleLists(self.rolelistArgs)
        }
      })
    },
    systemSelectData () {
      console.log(this.addRoleInfo.selectSystem)
      this.addRoleInfo.selectProvince = ''
      this.addRoleInfo.selectCity = ''
      this.addRoleInfo.selectArea = ''
      var self = this
      global.apiPost(this,global.baseUrl + 'system/detailPack?systemId=' + this.addRoleInfo.systemlists[this.addRoleInfo.selectSystem].id + '&token=' + global.getToken())
      .then((res) => {
        self.addRoleInfo.provinces = res.data.data.locationPack
      })
    },
    province () {
      this.addRoleInfo.selectCity = ''
      this.addRoleInfo.selectArea = ''
      if (this.addRoleInfo.selectProvince) {
        this.addRoleInfo.citys = this.addRoleInfo.selectProvince.city
      }
    },
    city () {
      this.addRoleInfo.selectArea = ''
      if (this.addRoleInfo.selectCity) {
        this.addRoleInfo.areas = this.addRoleInfo.selectCity.area
      }
    },
    addactive (ele, user) {
      // console.log(ele.target.parentNode.parentNode)
      var arr = ele.target.parentNode.parentNode.parentNode.className
      // console.log(ele.target.parentNode.parentNode.parentNode)
      if (arr.split('、')[0].indexOf('active') === -1) {
        this.divIsactive = user
      } else {
        this.divIsactive = null
      }
      // console.log(this.divIsactive)
    },
    // 增加标签
    addTag () {
      var temp = this.addRoleInfo.systemlists[this.addRoleInfo.selectSystem].name + ' ' + this.addRoleInfo.selectProvince.name
      temp = this.addRoleInfo.selectCity.name == null ? temp : temp + this.addRoleInfo.selectCity.name
      temp = this.addRoleInfo.selectArea.name == null ? temp : temp + this.addRoleInfo.selectArea.name
      temp = temp + this.addRoleInfo.jurisdictions[this.addRoleInfo.selectJurisdiction].data
        this.tags.push( temp )
        if (this.addRoleInfo.selectArea === '') {
          if (this.addRoleInfo.selectCity === '') {
            this.addRoleInfo.areaId = this.addRoleInfo.selectProvince.provinceId
          } else {
            this.addRoleInfo.areaId = this.addRoleInfo.selectCity.cityId
          }
        } else {
          this.addRoleInfo.areaId = this.addRoleInfo.selectArea.areaId
        }
        var msg = {
          systemId: this.addRoleInfo.systemlists[this.addRoleInfo.selectSystem].id,
          areaId: this.addRoleInfo.areaId,
          limitation: this.addRoleInfo.jurisdictions[this.addRoleInfo.selectJurisdiction].state
        }
        this.addRoleInfo.subitem.push(msg)

    },
    // 删除标签
    delTag (item, num) {
      this.tags.splice(this.tags.indexOf(item), 1)
      this.addRoleInfo.subitem.splice(num, 1)
    },
    addroleAlert () {
      this.roleAlert = true
      this.editrolesub = false
      this.addrolesub = true
      this.addRoleInfo.name = null
      this.tags = []
      this.tagsMsg = []
      this.addRoleInfo.selectSystem = null
      this.addRoleInfo.selectProvince = null
      this.addRoleInfo.selectJurisdiction = 0
      this.addRoleInfo.subitem = []
      // console.log(this.addRoleInfo)
    },
    addRole () {
      var self = this
      // console.log(this.addRoleInfo.name)
      if(this.addRoleInfo.name == "" || this.addRoleInfo.name == null) {
        global.error(self, '角色名称不能为空',null)
      } else {
        this.roleAlert = false
        var subitem = JSON.stringify(this.addRoleInfo.subitem)
        var xhr = new XMLHttpRequest()
        xhr.open('POST', global.baseUrl + 'role/add?name=' + this.addRoleInfo.name + '&token=' + global.getToken())
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(subitem)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            global.addSuccess(self, '添加成功')
            self.getRoleLists(self.rolelistArgs)
          }
        }
      }

    },
    // 修改角色
    edit (id) {
      this.roleId = id
      this.addrolesub = false
      this.editrolesub = true
      this.roleAlert = true
      this.addRoleInfo.selectSystem = null
      this.addRoleInfo.selectProvince = null
      this.addRoleInfo.selectJurisdiction = 0
      this.tags = []
      var self = this
      global.apiPost(this,global.baseUrl + 'role/detail?roleId=' + id + '&token=' + global.getToken())
      .then((res) => {
        self.addRoleInfo.name = res.data.data.name
        for (let i in res.data.data.subitem) {
          self.tags.push(res.data.data.subitem[i].systemName + res.data.data.subitem[i].areaName + res.data.data.subitem[i].limitName)
          self.tagsMsg.push(res.data.data.subitem[i].systemId + res.data.data.subitem[i].areaId + res.data.data.subitem[i].limitation)
        }
        self.addRoleInfo.subitem = res.data.data.subitem
      })
    },
    editRole () {
      if(this.addRoleInfo.name == "" || this.addRoleInfo.name == null) {
        global.error(this,"角色名称不能为空",null)
      } else {
        var self = this
        this.roleAlert = false
        var subitem = JSON.stringify(this.addRoleInfo.subitem)
        var xhr = new XMLHttpRequest()
        xhr.open('POST', global.baseUrl + 'role/update?id=' + this.roleId + '&name=' + this.addRoleInfo.name + '&token=' + global.getToken())
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(subitem)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            global.addSuccess(self, '修改成功')
            self.getRoleLists(self.rolelistArgs)
          }
        }
      }
    },
    // 获取角色列表
    getRoleLists (args) {
      var self = this
      global.apiPost(this,global.baseUrl + 'role/list', global.postHttpDataWithToken(args))
      .then((res) => {
        // console.log(res)
        self.rolelistArgs.currentPage = res.data.currentPage
        self.rolelistArgs.totalPage = res.data.totalPage
        self.rolelists = res.data.data
        self.rolelists.splice(0, 1)
      })
    },
    // 分页
    currentPageChange (value) {
      this.rolelistArgs.currentPage = value
      this.getRoleLists(this.rolelistArgs)
    }
  },
  created () {
    var self = this
    // axios.post(global.baseUrl + 'area/provinces?token=' + global.getToken())
    // .then((res) => {
    //   self.addRoleInfo.provinces = res.data.data
    // })
    // 获取系统列表
    global.apiPost(this,global.baseUrl + 'system/list?token=' + global.getToken())
    .then((res) => {
      self.addRoleInfo.systemlists = res.data.data
    })
    // 角色列表
    this.getRoleLists(this.rolelistArgs)
  }
}
</script>

<style media="screen">
.block .el-pagination{
  text-align: center;
  margin: 20px 0;
}
.rolelist:hover{
  cursor: pointer;
}
.addroles{
  text-align: center;
}
.right{
  text-align: left;
}
.addroleBtn{
  text-align: right;
  position: relative;
  top: -20px;
}
.right span{
  display: inline-block
}
.kd,.kx,.fz{
  display: inline-block;
  width: 18px;
  height: 18px;
  position: relative;
  top: 4px;
}
.kd{
  background: url('../../images/eyes.png')no-repeat;
}
.kx{
  background: url('../../images/write.png')no-repeat;
}
.fz{
  background: url('../../images/mon.png')no-repeat;
}
.addroles .el-dialog__wrapper{
  text-align: left;
}
.addroles .el-select{
  width: 160px;
}
.addroles .el-dialog__footer{
  text-align: center;
}
.rolelist{
  position: relative;
}
/*.sjx{
  content: '\e604';
  display: inline-block;
  font-family: element-icons!important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}*/
.rolelist:first-child .sjf:before{
  content: '\e604';
  display: inline-block;
  font-family: element-icons!important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  /*position: absolute;*/
  top: 24px;
  /*left: 25%;*/
}
.role{
  overflow: hidden;
  /*box-sizing: border-box;*/
  box-sizing: content-box;
  /*height: 60px;*/
  /*line-height: 59px;*/
  /*height: auto;*/
}
.role .el-col-8{
  border-right: 1px solid #dfe6ec;
  border-bottom: 1px solid #dfe6ec;
  height: 60px;
  line-height: 59px;
}
.role .el-col-8:first-child{
  border-left: 1px solid #dfe6ec;
}
.role.active .el-col-8:first-child:before{
  content: '';
  display:block;
   visibility:hidden;
   height:0;
   clear:both;
}
.role.active{
  height: 100%;
}
.role.active .el-col-8{
  height: 100%;
}
.tags{
  width: 330px;
  height: 50px;
  margin: 25px 75px 15px 0;
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  position: relative;
}
.tags .el-tag__close{
  width: 25px;
  height: 25px;
  line-height: 25px;
  color: #fff;
  font-size: 14px;
  background-color: rgb( 20, 135, 202 );
  position: absolute;
  top: -15px;
  right: -10px;
  display: none;
}
.tags:hover .el-tag__close{
  display: block;
}
.tags .el-tag__close:hover{
  color: #fff;
  background-color: rgb( 20, 135, 202 );
}
.add{
  border: 1px dashed rgb(20,135,202);
}
.role .icon{
  font-size: 20px;
  padding: 0 10px;
  color: #1487ca;
}
.icon:hover{
  cursor: pointer;
}
.line div{
  line-height: 0px!important;
}
</style>
