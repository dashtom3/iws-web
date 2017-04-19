<template>
  <div class="testUser">
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
        <el-select v-model="user.roleId" placeholder="请选择" @change="setrole(user.id, user.roleId)">
          <el-option
            :key="item"
            v-for="item in options"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
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
      userlist: null
    }
  },
  created () {
    var self = this
    axios.get(global.baseUrl + 'userManage/list?token=' + localStorage.token)
    .then((res) => {
      for (let i in res.data.data) {
        res.data.data[i].roleId = parseInt(res.data.data[i].roleId)
      }
      self.userlist = res.data.data
      // console.log(res)
    })
    axios.post(global.baseUrl + 'role/list?token=' + localStorage.token)
    .then((res) => {
      // console.log(res)
      self.options = res.data.data
    })
  },
  methods: {
    setrole (userid, roleid) {
      console.log(userid, roleid)
      axios.get(global.baseUrl + 'userManage/role?userId=' + userid + '&roleId=' + roleid + '&token=' + localStorage.token)
      .then((res) => {
        console.log(res)
      })
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
