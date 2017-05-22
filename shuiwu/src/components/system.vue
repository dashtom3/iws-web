<template>
  <div class="history">
    <ul class="lists">
      <li v-for="newsList in newsLists">
        <el-row>
          <el-col :span="24"><p class="newsquer"><span class="report"></span><span class="newsinfo">{{newsList.describes}}</span></p>
          <p class="newsTime"><span class="time">{{newsList.alarmTime | time}}</span><span class="newsid">编号:</span><span>{{newsList.id}}</span><span class="state">{{status[newsList.status-1]}}</span></p></el-col><br><br>
          <!-- 已确认 -->
          <div class="systemUncon" v-if="newsList.status === 1">
            <span style="font-size:14px;">管理员分配给<a href="javascript:;" v-on:click="showPersonalAlert(newsList.userId)">{{newsList.userName}}</a></span>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="danger" size="small" v-if="userInfo.roleId === 1 || userInfo.roleId === -1">语音播报</el-button>
            <el-button type="danger" size="small" v-if="userInfo.roleId === 1 || userInfo.roleId === -1" v-on:click="sendMessage(newsList.id, newsList.userId)">发送短信</el-button>
            <div class="h20"></div>
          </div>

          <div class="systemQue" v-if="newsList.status === 2">
            <el-col :span="6" style="text-align:center;">
              <div class="h20"></div>
              <div class="selectController" v-if="userInfo.roleId === 1 || userInfo.roleId === -1">
                <el-select v-model="newsList.userName" placeholder="请选择" style="inputWidth">
                  <el-option
                    v-for="item in userLists"
                    :key="item"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                  </el-select>
                <el-button class="confirm" v-on:click="msgConfirm(newsList.id, newsList.userName)">确认</el-button>
              </div>
              <div class="h20"></div>
            </el-col>
          </div>
        </el-row>
      </li>
    </ul>
    <!-- 分页 -->
    <div class="block" v-if="newsArgs.totalPage > 1">
      <el-pagination
        layout="prev, pager, next"
        :page-count="newsArgs.totalPage"
        @current-change="currentPageChange">
      </el-pagination>
    </div>
    <!-- 个人信息 -->
    <el-dialog title="用户信息" v-model="personalAlert">
      <div class="personalDiv">
        <el-table
          :data="userDetail"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="describes"
            label="描述">
          </el-table-column>
        </el-table>
        <div style="height:20px;"></div>
        <div class="" style="text-align:center;">
          <span slot="footer" class="dialog-footer" >
            <el-button @click="personalAlert = false">关 闭</el-button>
          </span>
        </div>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      newsLists: [],
      userInfo: global.getUser(),
      newsArgs: {
        systemId: this.$route.params.id,
        token: global.getToken(),
        numberPerPage: 10,
        currentPage: 1,
        totalPage: -1
      },
      status: ['已确认', '未确认'],
      personalAlert: false,
      userLists: [],
      userDetail: []
    }
  },
  created () {
    this.getNewsLists(this.newsArgs)
    this.getUserLists()
  },
  methods: {
    getNewsLists (args) {
      var self = this
      axios.get(global.baseUrl + 'news/list?' + global.getHttpData(args))
      .then((res) => {
        // console.log(res)
        self.newsLists = res.data.data
        self.newsArgs.totalPage = res.data.totalPage
        self.newsArgs.numberPerPage = res.data.numberPerPage
      })
    },
    msgConfirm (newsId, userId) {
      var obj = {
        newsId: newsId,
        userId: userId
      }
      var self = this
      axios.post(global.baseUrl + 'news/confirm', global.postHttpDataWithToken(obj))
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '操作成功', '')
          self.getNewsLists(self.newsArgs)
        }
      })
    },
    // 分页
    currentPageChange (value) {
      document.body.scrollTop = 0
      this.newsArgs.currentPage = value
      this.getNewsLists(this.newsArgs)
    },
    getUserLists () {
      var self = this
      axios.get(global.baseUrl + 'userManage/list?token=' + global.getToken())
      .then((res) => {
        self.userLists = res.data.data
      })
    },
    showPersonalAlert (userId) {
      this.personalAlert = true
      var personalMsg = {
        userId: userId,
        token: global.getToken()
      }
      var self = this
      self.userDetail = []
      axios.get(global.baseUrl + 'userManage/detail?' + global.getHttpData(personalMsg))
      .then((res) => {
        self.userDetail.push(res.data.data)
      })
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
.newsquer{
  margin: 25px 0 10px;
}
.systemQue{
  position: relative;
}
.goPerson .personalDiv{
  width: 100%;
  margin: 0px auto;
  color: #fff;
  text-align: center;
}
.goPerson:hover{
  cursor: pointer;
}
.userMsg{
  font-size: 14px;
  color: rgb(20,135,202);
}
.confirm{
  background-color: rgb(202,20,59);
}
p.userMsg:nth-child(2){
  margin-top: 10px;
}
.msgstate{
  margin-left: 15px;
}
.state{
  margin-left: 10px;
}
.report{
  float: left;
  position: absolute;
  display: inline-block;
  width: 15px;
  height:19px;
  background:url('../images/report.png') no-repeat;
}
.systemUncon{
  position: relative;
  left: 25px;
  top: 10px;
}
.newsinfo{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  letter-spacing:1.5px;
  position: relative;
  left: 25px;
}
.newsTime{
  margin: 10px 0 0px 25px;
}
.time,.newsid,.state{
  font-size: 14px;
  color: rgba( 0, 0, 0, 0.6 );
}
.newsid{
  margin: 0 20px;
}
</style>
