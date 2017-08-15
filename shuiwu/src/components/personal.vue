<template>
  <div class="index">
    <div class="personalMsg" ref="contentHeight">
      <div class="personalDiv">
        <el-row :gutter="20">
          <el-col :span="4"><span class="nameIcon"></span></el-col>
          <el-col :span="10"><span>{{userMsg.name}}</span></el-col>
          <el-col :span="4"><span class="phoneIcon"></span></el-col>
          <el-col :span="6"><span>{{userMsg.username}}</span></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="addrIcon"></span></el-col>
          <el-col :span="20"><el-input v-model=userMsg.address placeholder="请输入内容" class="cw whiteCo"></el-input>
</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="infoIcon"></span></el-col>
          <el-col :span="20"><el-input v-model=userMsg.describes placeholder="请输入内容" class="cw whiteCo"></el-input>
</el-col>
        </el-row>
        <div style="text-align:center">
          <el-button class="qr" v-on:click="update">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import header from './common/header'
// import footer from './common/footer'
import axios from 'axios'
import global from '../global/global'
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      userMsg: {
        name: null,
        describes: null
      }
    }
  },
  created () {
    var self = this
    axios.post(global.baseUrl + 'user/detail', global.postHttpDataWithToken())
    .then(function (res) {
      self.userMsg = res.data.data
    })
  },
  methods: {
    update () {
      var self = this
      axios.post(global.baseUrl + 'user/update', global.postHttpDataWithToken(this.userMsg))
      .then(function (res) {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '信息修改成功', '')
        }
      })
    }
  },
  mounted () {
    if (!global.getToken()) {
      this.$router.push('/login')
    }
  }
  // components: {
  //   'v-header': header,
  //   'v-footer': footer
  // }
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
.cw{
  color: #fff;
}
.indexLog{
  float: left;
}
.navbar li{
  float: right;
  font-size: 18px;
  width: 151px;
  text-align: center;
  margin:0 40px;
}
.navbar li:hover{
  cursor: pointer;
}
.navbar li.active{
  color: rgb(20,135,202);
  border-bottom: 4px solid;
}
.personalMsg{
  background: url('../images/personalbg_03.png');
  background-size: cover;
  width: 1280px;
  margin: 0 auto;
}
.personalDiv{
  width: 420px;
  margin: 0px auto;
  padding: 200px 0;
}
.nameIcon,.phoneIcon,.addrIcon,.infoIcon{
  display: block;
  width: 44px;
  height: 48px;
  float: left;
}
.nameIcon{
  background: url('../images/name.png') no-repeat;
}
.phoneIcon{
  background: url('../images/phone.png') no-repeat;
}
.addrIcon{
  background: url('../images/ip.png') no-repeat;
}
.infoIcon{
  background: url('../images/discribe.png') no-repeat;
}
.el-row{
  margin: 40px 0;
  line-height: 48px;
  font-size: 18px;
  color: #fff;
}
.qr{
  border-radius: 4px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.6;
  width: 130px;
  height: 39px;
  margin: 0 auto;
  text-align: center;
}
</style>
