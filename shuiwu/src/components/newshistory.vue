<template>
  <div class="">
    <el-date-picker
      v-model="newsMsg.startTime"
       type="date"
       placeholder="选择日期">
     </el-date-picker>
     <span> —— </span>
     <el-date-picker
      v-model="newsMsg.endTime"
       type="date"
       placeholder="选择日期">
     </el-date-picker>
     <el-button type="primary" v-on:click="searchByTime">查找</el-button>
  <ul class="lists">
    <li v-for="newsList in newsLists">
      <el-row>
        <el-col :span="20"><p class="newsquer"><span class="report"></span><span class="newsinfo">{{newsList.describes}}</span></p>
        <p class="newsTime"><span class="time">{{newsList.alarmTime | time}}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="newsid">编号:</span><span>{{newsList.id}}</span><span class="state">已确认</span></p></el-col>
      </el-col>
        <el-col :span="4">
          <div class="goPerson">
            <p class="userMsg">用户名称:<span class="name" v-on:click="showPersonalAlert(newsList.id)">{{newsList.userName}}</span></p>
            <el-dialog title="用户信息" v-model="personalAlert">
              <div class="personalDiv">
                <el-table
                  :data="userInfo"
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
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="personalAlert = false">关 闭</el-button>
                  </span>
                </div>
              </el-dialog>
            <p class="userMsg">{{newsList.confirmTime | time}}<span class="msgstate">已确认</span></p>
          </div>
        </el-col>
      </el-row>
    </li>
  </ul>
</div>
</template>

<script>
import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      newsLists: [],
      personalAlert: false,
      userInfo: null,
      newsMsg: {
        status: 1,
        token: global.getToken(),
        startTime: null,
        endTime: null,
        currentPage: 1,
        numberPerPage: 10,
        totalPage: -1
      }
    }
  },
  created () {
    this.getNewsLists(this.newsMsg)
  },
  methods: {
    showPersonalAlert (userId) {
      // console.log(userId)
      this.personalAlert = true
      axios.get(global.baseUrl + 'userManage/list?id=' + userId + '&token=' + global.getToken())
      .then((res) => {
        // console.log(res)
        self.userInfo = res.data.data
      })
    },
    getNewsLists (args) {
      var self = this
      axios.get(global.baseUrl + 'news/list?' + global.getHttpData(args))
      .then((res) => {
        // console.log(res)
        self.newsLists = res.data.data
      })
    },
    searchByTime () {
      this.newsMsg.startTime = this.timeFilter(this.newsMsg.startTime)
      this.newsMsg.endTime = this.timeFilter(this.newsMsg.endTime)
      this.getNewsLists(this.newsMsg)
    },
    timeFilter (value) {
      var month = value.getMonth() + 1
      var date = value.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      return value.getFullYear() + '-' + month + '-' + date
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lists li{
  height: 95px;
  border-bottom: 1px dashed
}
.state{
  margin-left: 10px;
}
/*.lists li p{
  line-height: 59px;
}*/
.goPerson .personalDiv{
  width: 100%;
  margin: 0px auto;
  color: #fff;
  text-align: center;
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
.newsquer{
  margin: 25px 0 10px;
}
.newsTime{
  margin: 10px 0 20px 25px;
}
.report{
  float: left;
  display: inline-block;
  width: 15px;
  height:19px;
  margin-right: 10px;
  background:url('../images/report.png') no-repeat;
}
.newsinfo{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  letter-spacing:1.5px;
}
.time,.newsid,.state{
  font-size: 14px;
  color: rgba( 0, 0, 0, 0.6 );
}
.el-col-4{
  position: relative;
  top: 25px;
}
.confirm{
  border-radius: 3px;
  background-color: rgb( 202, 20, 59 );
}
.userMsg{
  font-size: 14px;
  color: rgb(20,135,202);
}
p.userMsg:nth-child(2){
  margin-top: 10px;
}
.name{
  margin-left: 20px;
}
.msgstate{
  margin-left: 15px;
}
.goPerson:hover{
  cursor: pointer;
}
</style>
