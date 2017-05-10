<template>
  <div class="history">
    <ul class="lists">
      <li v-for="newsList in newsLists">
        <el-row>
          <el-col :span="20"><p class="newsquer"><span class="report"></span><span class="newsinfo">{{newsList.describes}}</span></p>
          <p class="newsTime"><span class="time">{{newsList.alarmTime | time}}</span><span class="newsid">编号:</span><span>{{newsList.id}}</span><span class="state">{{status[newsList.status]}}</span></p></el-col>
        </el-col>
          <el-col :span="4" v-if="newsList.status === 1" style="position:relative;top:15px;"><el-button class="confirm" v-on:click="msgConfirm(newsList.id)" type="success">确认</el-button></el-col>
          <el-col :span="4" style="position:relative;top:15px;">
            <div class="goPerson" v-if="newsList.status === 0">
              <p class="userMsg">用户名称:<span class="name" v-on:click="showPersonalAlert(newsList.id)">{{newsList.userName}}</span></p>
              <!-- <el-dialog title="用户信息" v-model="personalAlert">
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
                </el-dialog> -->
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
      systemId: this.$route.params.id,
      newsLists: [
        {alarmId: 3, alarmTime: 1494239934000, describes: '2017-04-11 21:19:39 供水系统 北京市市辖区东城区XX小区 XX泵房:泵前压力 出现异常', id: 4, status: 1, userName: '你好', userId: '1'},
        {alarmId: 3, alarmTime: 1494239934000, describes: '2017-04-11 21:19:39 供水系统 北京市市辖区东城区XX小区 XX泵房:泵前压力 出现异常', id: 4, status: 0, userName: '你好', userId: '1'}
      ],
      newsArgs: {
        token: global.getToken(),
        numberPerPage: 10,
        currentPage: 1,
        totalPage: -1
      },
      status: ['已确认', '未确认']
    }
  },
  created () {
    this.getNewsLists(this.newsArgs)
  },
  watch: {
    systemId (val, oldVal) {
      console.log(val, oldVal)
    }
  },
  methods: {
    getNewsLists (args) {
      axios.get(global.baseUrl + 'news/list?' + global.getHttpData(args))
      .then((res) => {
        console.log(res)
      })
    },
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
              message: '确认成功!',
              onClose: self.getNewsLists(self.newsArgs)
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
.newsquer{
  margin: 25px 0 10px;
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
.newsTime{
  margin: 10px 0 20px 25px;
}
.time,.newsid,.state{
  font-size: 14px;
  color: rgba( 0, 0, 0, 0.6 );
}
.newsid{
  margin: 0 20px;
}
</style>
