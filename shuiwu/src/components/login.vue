<template>
  <div class="login">
    <v-header></v-header>
    <div class="loginCon" ref="contentHeight">
      <div class="loginMsg" v-show="msgLogin">
        <div class="w361">
          <div class="msgTitle"></div>
          <span>帐号</span>
          <el-input v-model="userLoginMsg.username" placeholder="请输入账号"></el-input>
          <span>密码</span>
          <el-input v-model="userLoginMsg.password" placeholder="请输入密码" type="password"></el-input>
          <span class="goPhone"><a  v-on:click="goPhoneLogin" href="javascript:;">忘记密码</a></span>
          <el-button type="primary" style="width:100%" v-on:click="login">登录</el-button>
          <span class="goRegister"><a href="javascript:;" v-on:click="goRegister">注册</a></span>
        </div>
      </div>
      <div class="loginMsg" v-show="phoneLogin">
        <div class="w361">
          <div class="msgTitle"></div>
          <el-form :label-position="labelPosition" label-width="80px" :rules="rules" ref="phoneMsg" :model="phoneMsg">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="phoneMsg.phone"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="phoneCode">
              <el-input v-model="phoneMsg.code"  placeholder="请输入验证码" class="code"></el-input><el-button type="primary" class="getCode" v-on:click="getPhoneCode" :disabled="isDisabled" >{{btnHtml}}</el-button>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="phoneMsg.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
              <el-input v-model="phoneMsg.repassword" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" class="phoneLog" v-on:click="forgetPwd('phoneMsg')">确认</el-button>
            <span class="goRegister"><a href="javascript:;" v-on:click="goRegister">注册</a></span>
          </el-form>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import header from './common/header'
import footer from './common/footer'
import global from '../global/global'
import axios from 'axios'
export default {
  data () {
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.phoneMsg.repassword !== '') {
          this.$refs.phoneMsg.validateField('repassword')
        }
        callback()
      }
    }
    var repassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.phoneMsg.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      msg: 'Welcome to Your Vue.js App',
      labelPosition: 'top',
      userLoginMsg: {
        username: '',
        password: ''
      },
      btnHtml: '获取',
      waitTime: 60,
      msgLogin: true,
      phoneLogin: false,
      isDisabled: false,
      phoneMsg: {
        phone: '',
        code: '',
        password: '',
        repassword: ''
      },
      rules: {
        phone: [{ validator: phone, trigger: 'blur' }],
        password: [{ validator: password, trigger: 'blur' }],
        repassword: [{ validator: repassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    goPhoneLogin: function () {
      this.msgLogin = false
      this.phoneLogin = true
    },
    goRegister: function () {
      this.$router.push('/register')
    },
    dl (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.prev = false
          this.next = true
        } else {
          return false
        }
      })
    },
    // 验证码倒计时
    timeUpdata () {
      if (this.waitTime === 0) {
        this.isDisabled = false
        this.btnHtml = '获取'
      } else {
        this.waitTime = this.waitTime - 1
        this.btnHtml = this.waitTime + 's'
        setTimeout(this.timeUpdata, 1000)
      }
    },
    getPhoneCode () {
      if (this.phoneMsg.phone === '') {
        alert('请输入手机号')
      } else {
        this.isDisabled = true
        this.timeUpdata()
        var phone = new FormData()
        phone.append('username', this.phoneMsg.phone)
        axios.post(global.baseUrl + 'user/getVerifyCode', phone)
        .then(function (res) {
          // console.log(res)
        })
      }
    },
    // 登录发送请求
    login () {
      var self = this
      // console.log(msg)
      axios.post(global.baseUrl + 'user/login', global.postHttpData(this.userLoginMsg))
      .then(function (res) {
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '登录成功', '/index')
          global.setToken(res.data.token)
          global.userMsg = res.data.data
        } else {
          global.error(self, '账号或密码错误', '/register')
        }
      })
    },
    // 忘记密码
    forgetPwd (formName) {
      var self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var forgetPwdMsg = new FormData()
          forgetPwdMsg.append('username', this.phoneMsg.phone)
          forgetPwdMsg.append('code', this.phoneMsg.code)
          forgetPwdMsg.append('password', this.phoneMsg.password)
          // console.log(forgetPwdMsg)
          axios.post(global.baseUrl + 'user/forgetPwd', forgetPwdMsg)
          .then(function (res) {
            // console.log(res)
            if (res.data.callStatus === 'SUCCEED') {
              global.forgetPwd(self, '密码设置成功', '/login')
            }
          })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    var login = this.$refs.contentHeight
    global.setHeight(login)
  },
  components: {
    'v-header': header,
    'v-footer': footer
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginCon{
  background: url('../images/loginbg.png') no-repeat;
  background-size: cover;
  padding-top: 75px;
}
.loginMsg{
  width: 500px;
  height: 600px;
  border-radius: 12px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.902;
  margin: 0 auto;
}
.w361{
  width: 361px;
  margin: 0px auto;
  padding-top: 50px;
}
.msgTitle{
  background: url('../images/loginTitle_03.png');
  width: 288px;
  height: 124px;
  text-align: center;
  margin: 0px auto;
}
.w361 span{
  display: block;
  margin: 20px 0 10px;
  font-size: 14px;
}
.goPhone,.goRegister{
  text-align: right;
}
.code{
  width: auto;
  margin-right: 49px;
}
.getCode{
  width: 120px;
}
.phoneLog{
  margin-top: 20px;
  width: 100%;
  margin-left: 0;
}
a{
  color:#000;
}
</style>
