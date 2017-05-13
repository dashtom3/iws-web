<template>
  <ul class="lists">
    <li v-for="newsMsg in newsLists">
      <el-row>
        <el-col :span="20"><p class="newsquer"><span class="report"></span><span class="newsinfo">{{newsMsg.describes}}</span></p>
        <p class="newsTime"><span class="time">{{newsMsg.alarmTime | time}}</span><span class="newsid">编号:</span><span>{{newsMsg.id}}</span><span class="state">{{status[newsMsg.status-1]}}</span></p></el-col>
      </el-col>
        <el-col :span="4" style="text-align:center;"><el-button class="confirm" v-on:click="msgConfirm(newsMsg.id)">确认</el-button></el-col>
      </el-row>
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      id: '',
      newsLists: [],
      newsArgs: {
        token: global.getToken(),
        numberPerPage: 10,
        currentPage: 1,
        totalPage: -1,
        status: 2
      },
      status: ['已确认', '未确认']
    }
  },
  created () {
    this.getNewsLists(this.newsArgs)
  },
  methods: {
    msgConfirm (newsid) {
      var self = this
      this.id = newsid
      this.$confirm('是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(global.baseUrl + 'news/confirm?token=' + global.getToken() + '&newsId=' + newsid)
        .then((res) => {
          console.log(res)
          if (res.data.callStatus === 'SUCCEED') {
            self.getNewsLists()
            self.$message({
              type: 'success',
              message: '确认成功! 请在历史消息中查看'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getNewsLists (args) {
      var self = this
      axios.get(global.baseUrl + 'news/list?' + global.getHttpData(args))
      .then((res) => {
        self.newsLists = res.data.data
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
