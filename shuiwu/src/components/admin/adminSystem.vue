<template>
  <div class="systemLists">
    <div class="systemlist" v-for="systemlist in systemlists">
      <div class="systemlistLeft" v-on:click="go(systemlist.id)">
        <div class="systemImg">
          <img :src=systemlist.pic alt="">
        </div>
        <div class="systemIntr">
          <p class="systemTitle">{{systemlist.name}}</p>
          <p class="systemCreat">创建于{{systemlist.date | date}}</p>
        </div>
      </div>
      <div class="delicon" v-on:click="del(systemlist.id)"></div>
    </div>
    <div class="systemlist addSystem"  @click="addSystemAlert = true">
      <div class="systemImg">
        <img src="../../images/add.png" alt="">
      </div>
      <div class="systemIntr">
        <p class="systemTitle center">添加新系统</p>
      </div>
    </div>
    <el-dialog title="添加新系统" v-model="addSystemAlert">
      <el-form :model="addsystem">
        <el-form-item label="系统名称">
          <el-input v-model="addsystem.name" auto-complete="off" style="width:500px"></el-input>
        </el-form-item>
        <span>系统图标（即该图标在地图上显示的图标）</span><br>
        <div class="change">
          <ul class="s">
            <li v-for="(systemImg, index) in systemImgs" :class="{'active': addsystem.imgUrl == systemImg }" v-on:click="changeSystemImg(systemImg)"><img :src=systemImg alt=""><span class="systemSelect"></span></li>
          </ul>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSystemAlert = false">取 消</el-button>
        <el-button type="primary" @click="addSystem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import global from '../../global/global'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      addSystemAlert: false,
      addsystem: {
        name: null,
        imgUrl: null
      },
      formLabelWidth: '120px',
      systemImgs: [],
      systemlists: []
    }
  },
  created () {
    var self = this
    global.apiPost(this,global.baseUrl + 'system/list?token=' + global.getToken())
    .then(function (res) {
      // console.log(res)
      self.systemlists = res.data.data
    })
    // 请求图片列表
    global.apiPost(this,global.baseUrl + 'system/pic?token=' + global.getToken())
    .then((res) => {
      // console.log(res)
      self.systemImgs = res.data.data
      for (let i in self.systemImgs) {
        self.systemImgs[i] = global.baseUrl + self.systemImgs[i]
      }
    })
  },
  methods: {
    go (id) {
      this.$router.push({ name: 'systemDetial', params: {id: id} })
    },
    del (id) {
      var self = this
      global.apiPost(this,global.baseUrl + 'system/delete?token=' + global.getToken() + '&systemId=' + id)
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '删除成功', '/admin/system')
          global.apiPost(self,global.baseUrl + 'system/list?token=' + global.getToken())
          .then(function (res) {
            self.systemlists = res.data.data
          })
        }
      })
    },
    changeSystemImg (item) {
      this.addsystem.imgUrl = item
    },
    addSystem () {
      var self = this
      this.addSystemAlert = false
      var systemMsg = new FormData()
      systemMsg.append('name', this.addsystem.name)
      systemMsg.append('pic', this.addsystem.imgUrl)
      global.apiPost(this,global.baseUrl + 'system/add?token=' + global.getToken(), systemMsg)
      .then((res) => {
        console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '添加成功', '/admin/system')
          global.apiPost(self,global.baseUrl + 'system/list?token=' + global.getToken())
          .then(function (res) {
            self.systemlists = res.data.data
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.systemlist{
  float: left;
  border-radius: 4px;
  background-color: rgb( 255, 255, 255 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  width: 45%;
  height: 201px;
  margin: 0 40px 40px 0;
  position: relative;
}
.systemlist:before{
  content: '';
  display: block;
  text-align: center;
  margin: 0 auto;
  background-color: rgb( 20, 135, 202 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  width: 60px;
  height: 12px;
}
.systemlist:hover{
  cursor: pointer;
}
.systemlist:hover .delicon{
  display: inline-block;
}
.systemTitle{
  font-size: 18px;
}
.systemCreat{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
}
.delicon{
  width: 26px;
  height: 26px;
  background: url('../../images/del.jpg')no-repeat;
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: none;
  z-index: 9999;
}
.delicon:hover{
  cursor: pointer;
}
.systemlistLeft{
  width: 100%;
  height: 100%;
}
.systemImg{
  float: left;
  margin-right: 20px;
}
.systemTitle{
  margin-bottom: 5px;
}
.systemImg,.systemIntr{
  position: relative;
  top: 65px;
  left: 65px;
}
.center{
  position: relative;
  top: 15px;
}
.addSystem .systemImg,.addSystem .systemIntr{
  left: 140px;
}
.s{
  border-radius: 5px;
  background-color: rgb( 249, 249, 249 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  margin-top: 20px;
}
.s li{
  /*float: left;*/
  display: inline-block;
  margin: 20px 30px;
}
.s li:hover{
  cursor: pointer;
}
.s li img{
  float: left;
}
.systemSelect{
  display: inline-block;
  border-width: 1px;
  /*border-color: rgb( 20, 135, 202 );*/
  border-style: solid;
  border-radius: 4px;
  width: 27px;
  height: 27px;
  /*line-height: 27px;*/
  position: relative;
  left: 20px;
  top: 8px;
}
.s li.active .systemSelect{
  border-color: rgb( 20, 135, 202 );
}
.s li.active .systemSelect:after{
  content: "";
  border: 2px solid rgb( 20, 135, 202 );
  border-left: 0;
  border-top: 0;
  height: 20px;
  width: 10px;
  transform: rotate(45deg);
  left: 7px;
  position: absolute;
  /*top: 1px;*/
}
/*.change{
  border-radius: 5px;
  background-color: rgb( 249, 249, 249 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  width: 991px;
  height: 601px;
}*/
</style>
