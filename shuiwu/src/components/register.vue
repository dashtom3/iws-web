<template>
  <div class="login">
    <v-header></v-header>
    <div class="loginCon" ref="contentHeight">
      <div class="h75"></div>
      <div class="loginMsg" v-show="msgLogin">
        <div class="w361">
          <div class="msgTitle"></div>
          <el-form :label-position="labelPosition" label-width="80px" :rules="rules" ref="phoneMsg" :model="phoneMsg" v-show="prev">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="phoneMsg.phone"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="phoneCode">
              <el-input v-model="phoneMsg.code"  placeholder="请输入验证码" class="code"></el-input><el-button type="primary" class="getCode" :disabled="isDisabled" v-on:click="getPhoneCode">{{btnHtml}}</el-button>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="phoneMsg.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
              <el-input v-model="phoneMsg.repassword" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" style="width:100%" @click="submitForm('phoneMsg')">下一步</el-button>
            <!-- <span class="goRegister"><a href="javascript:;" v-on:click="goRegister"></a></span> -->
          </el-form>
          <el-form :label-position="labelPosition" label-width="80px" :rules="rules" :model="phoneMsg" v-show="next">
            <el-form-item label="姓名">
              <el-input v-model="phoneMsg.username"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="phoneMsg.address"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="phoneMsg.describe"></el-input>
            </el-form-item>
            <el-button type="primary" style="width:100%" @click="register">注册</el-button>
            <span class="goRegister"><a href="javascript:;" v-on:click="goLogin">登录</a></span>
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
      btnHtml: '获取',
      waitTime: 60,
      isDisabled: false,
      phoneMsg: {
        username: '',
        password: '',
        repassword: '',
        phone: '',
        code: '',
        address: '',
        describe: ''
      },
      prev: true,
      next: false,
      msgLogin: true,
      phoneLogin: false,
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
    goLogin: function () {
      this.$router.push('/login')
    },
    // 下一步
    submitForm (formName) {
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
        var phonenum = new FormData()
        phonenum.append('username', this.phoneMsg.phone)
        axios.post(global.baseUrl + 'user/getVerifyCode', phonenum)
        // .then(function (res) {
        //   // console.log(res)
        // })
      }
    },
    // 注册
    register () {
      var self = this
      var user = new FormData()
      user.append('username', this.phoneMsg.phone)
      user.append('password', this.phoneMsg.password)
      user.append('code', this.phoneMsg.code)
      user.append('name', this.phoneMsg.username)
      user.append('address', this.phoneMsg.address)
      user.append('describes', this.phoneMsg.describe)
      // user.append('describes', this.phoneMsg.describes)
      axios.post(global.baseUrl + 'user/register', user)
      .then(function (res) {
        // console.log(res)
        if (res.data.callStatus === 'SUCCEED') {
          global.success(self, '注册成功', '/login')
        } else if (res.data.errorCode === 'Username_Already_Exist') {
          global.error(self, '用户已经存在，请登录', '/login')
        }
      })
      // console.log(user)
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
}
.h75{
  height: 75px;
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
</style>
