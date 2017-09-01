<template>
  <ul class="lists">
    <li v-for="newsMsg in newsLists">
      <el-row>
        <el-col :span="24"><p class="newsquer"><span class="report"></span><span class="newsinfo">{{newsMsg.describes}}</span></p>
        <p class="newsTime"><span class="time">{{newsMsg.alarmTime | time}}</span><span class="newsid">编号:</span><span>{{newsMsg.id}}</span><span class="state">该消息未确认</span></p></el-col>
      </el-col>
      <br>

      <!-- 用户列表 -->
      <el-col :span="6" style="text-align:center;">
        <div class="selectController" v-if="userInfo.roleId === 1 || userInfo.roleId === -1">
          <el-select v-model="newsMsg.userName" :placeholder="newsMsg.userId | state" style="inputWidth">
            <el-option
              v-for="item in userLists"
              :key="item"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          <el-button class="confirm" v-on:click="msgConfirm(newsMsg.id, newsMsg.userName)">确认</el-button>
        </div>
        </el-col>
      </el-row>
      <div class="h20"></div>
    </li>
    <!-- 分页 -->
    <div class="block" v-if="newsArgs.totalPage > 1">
      <el-pagination
        layout="prev, pager, next"
        :page-count="newsArgs.totalPage"
        @current-change="currentPageChange">
      </el-pagination>
    </div>
  </ul>
</template>

<script>
import axios from 'axios'
import global from '../global/global'
export default {
  props: ['args'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      id: '',
      newsLists: [],
      userLists: [],
      newsArgs: {
        token: global.getToken(),
        numberPerPage: 10,
        currentPage: 1,
        totalPage: -1,
        status: 2,
        describes: null
      },
      userInfo: global.getUser(),
      status: ['已确认', '未确认']
    }
  },
  watch: {
    args (value) {
      if (value) {
        this.newsArgs.describes = value
      } else {
        this.newsArgs.describes = null
      }
      this.getNewsLists(this.newsArgs)
    }
  },
  created () {
    this.getNewsLists(this.newsArgs)
    this.getUserLists()
  },
  methods: {
    msgConfirm (newsId, userId) {
      var obj = {
        newsId: newsId,
        userId: userId
      }
      var self = this
      global.apiPost(this,global.baseUrl + 'news/confirm', global.postHttpDataWithToken(obj))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
          self.getNewsLists(self.newsArgs)
        }
      })
    },
    getNewsLists (args) {
      var self = this
      global.apiGet(this,global.baseUrl + 'news/list?' + global.getHttpData(args))
      .then((res) => {
        if (res.data) {
          self.newsLists = res.data.data
          self.newsArgs.totalPage = res.data.totalPage
          self.newsArgs.currentPage = res.data.currentPage
        } else {
          global.error(self, '该消息不存在', '')
        }
      })
    },
    getUserLists () {
      var self = this
      global.apiGet(this,global.baseUrl + 'userManage/list?token=' + global.getToken())
      .then((res) => {
        self.userLists = res.data.data
      })
    },
    // 分页
    currentPageChange (value) {
      document.body.scrollTop = 0
      this.newsArgs.currentPage = value
      this.getNewsLists(this.newsArgs)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lists li{
  min-height: 95px;
  border-bottom: 1px dashed
}
.h20{
  height: 20px;
}
.inputWidth{
  width: 200px;
}
/*.lists li p{
  line-height: 59px;
}*/
.newsquer{
  margin: 25px 0 10px;
}
.newsTime{
  margin: 10px 0 20px 25px;
}
.state{
  margin-left: 20px;
}
.report{
  float: left;
  position: absolute;
  display: inline-block;
  width: 15px;
  height:19px;
  background:url('../images/report.png') no-repeat;
}
.newsinfo{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  letter-spacing:1.5px;
  position: relative;
  left: 25px;
}
.time,.newsid,.state{
  font-size: 14px;
  color: rgba( 0, 0, 0, 0.6 );
}
.newsid{
  margin: 0 20px;
}
.el-col-4{
  position: relative;
  top: 25px;
}
.confirm{
  border-radius: 3px;
  background-color: rgb( 202, 20, 59 );
}
</style>
