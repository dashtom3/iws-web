<template>
  <div class="testUser">
    <el-row :gutter="20" style="text-align:left;">
      <el-select v-model="userType" placeholder="请选择" @change="changeUserType">
        <el-option
          v-for="item in userTypes"
          :key="item.value"
          :label="item.data"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="userSearch" placeholder="请输入内容" style="width:200px;" v-on:blur="searchBlur"></el-input>
      <el-button type="primary"  v-on:click="searchUser">查找</el-button>
      <el-button type="primary"  v-on:click="searchCancel">取消</el-button>
      <div class="h20"></div>
    </el-row>
    <el-row :gutter="20" class="userTitle">
      <el-col :span="3"><span>用户名</span></el-col>
      <el-col :span="3"><span>姓名</span></el-col>
      <el-col :span="3"><span>注册时间</span></el-col>
      <el-col :span="5"><span>描述</span></el-col>
      <el-col :span="5"><span>地址</span></el-col>
      <el-col :span="5"><span>选择角色</span></el-col>
    </el-row>
    <el-row :gutter="20"
    :key="user"
    v-for="(user, index) in userlist" class="userlist">
      <el-col :span="3"><span>{{user.username}}&nbsp;</span></el-col>
      <el-col :span="3"><span>{{user.name}}&nbsp;</span></el-col>
      <el-col :span="3"><span>{{user.date | date}}&nbsp;</span></el-col>
      <el-col :span="5"><span>{{user.describes}}&nbsp;</span></el-col>
      <el-col :span="5"><span>{{user.address}}&nbsp;</span></el-col>
      <el-col :span="5">
        <el-select v-model="user.roleName" placeholder="请选择" @change="setrole(user.id, user.roleName)">
          <el-option
            :key="item"
            v-for="item in options"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="block" v-if="userArgs.totalPage > 1">
      <el-pagination
        @current-change="currentPageChange"
        :current-page.sync="userArgs.currentPage"
        layout="total, prev, pager, next"
        :page-count="userArgs.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import global from '../../global/global'
export default {
  data () {
    return {
      value: '',
      options: [],
      userlist: null,
      userArgs: {
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1,
        token: global.getToken()
      },
      userType: null,
      userSearch: null,
      userTypes: [
        { data: '用户名', value: 'username' },
        { data: '姓名', value: 'name' },
        { data: '地址', value: 'address' }
      ],
      searchType: {}
    }
  },
  created () {
    this.getUserList(this.userArgs)
    var self = this
    axios.post(global.baseUrl + 'role/list?token=' + global.getToken())
    .then((res) => {
      self.options = res.data.data
    })
  },
  methods: {
    setrole (userId, roleId) {
      var roleMsg = {
        userId: userId,
        roleId: roleId,
        token: global.getToken()
      }
      var self = this
      axios.get(global.baseUrl + 'userManage/role?' + global.getHttpData(roleMsg))
      .then((res) => {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
          self.getUserList(self.userArgs)
        }
      })
    },
    getUserList (args) {
      var self = this
      axios.get(global.baseUrl + 'userManage/list?' + global.getHttpData(args))
      .then((res) => {
        for (let i in res.data.data) {
          res.data.data[i].roleId = parseInt(res.data.data[i].roleId)
        }
        self.userlist = res.data.data
        self.userArgs.currentPage = res.data.currentPage
        self.userArgs.totalPage = res.data.totalPage
      })
    },
    // 分页
    currentPageChange (value) {
      this.userArgs.currentPageChange = value
      this.getUserList(this.userArgs)
    },
    changeUserType () {
      if (this.userType) {
        this.searchType = {}
        this.searchType[this.userType] = this.userSearch
        this.searchType['token'] = global.getToken()
      }
    },
    searchBlur () {
      if (this.userType) {
        this.searchType = {}
        this.searchType[this.userType] = this.userSearch
        this.searchType['token'] = global.getToken()
      }
    },
    searchUser () {
      var self = this
      if (!this.userType) {
        alert('请选择查找类型')
      } else if (!this.userSearch) {
        alert('请输入查找内容')
      } else {
        axios.get(global.baseUrl + 'userManage/query?' + global.getHttpData(this.searchType))
        .then((res) => {
          if (res.data.data.length !== 0) {
            self.userlist = res.data.data
            self.userArgs.currentPage = res.data.currentPage
            self.userArgs.totalPage = res.data.totalPage
          } else {
            alert('用户不存在')
          }
        })
      }
    },
    searchCancel () {
      this.userType = null
      this.userSearch = null
      this.getUserList(this.userArgs)
    }
  }
}
</script>

<style media="screen">
.cell{
  text-align: center;
}
.testUser{
  text-align: center;
}
.h20{
  height: 20px;
}
.userTitle{
  border-radius: 6px;
  background-color: rgb( 229, 229, 229 );
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}
.userlist{
  height: 60px;
  line-height: 60px;
  font-size: 14px;
}
.userlist .el-col{
  border-right: 1px solid #dfe6ec;
  border-bottom: 1px solid #dfe6ec;
}
.userlist .el-col:first-child{
  border-left: 1px solid #dfe6ec;
}
</style>
