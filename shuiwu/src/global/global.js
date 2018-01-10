import axios from 'axios'
export default{
  userMsg: {},
  modeName:[['进口压力','出口压力','水箱液位','泵1状态','泵2状态','泵3状态','泵4状态','泵5状态','泵6状态'],
  ['进口压力','出口压力','水箱液位','泵1状态','泵2状态','泵3状态','泵4状态','泵5状态','泵6状态'],
  ['进口压力','出口压力','水箱液位','泵1状态','泵2状态','泵3状态','泵4状态','泵5状态','泵6状态'],
  ['进口压力','出口压力','水箱液位','泵1状态','泵2状态','泵3状态','泵4状态','泵5状态','泵6状态']],
  // 成功
  success (obj, msg, url) {
    obj.$message({
      message: msg,
      type: 'success',
      duration: '1000',
      onClose: function () {
        obj.$router.push(url)
      }
    })
  },
  // 添加成功
  addSuccess (obj, msg) {
    obj.$message({
      message: msg,
      type: 'success',
      duration: '1000'
    })
  },
  // 错误
  error (obj, msg, url) {
    obj.$message({
      message: msg,
      type: 'error',
      duration: '1200'
    })
  },
  // 设置密码
  forgetPwd (obj, msg, url) {
    obj.$message({
      message: msg,
      type: 'success',
      duration: '1200',
      onClose: function () {
        obj.msgLogin = true
        obj.phoneLogin = false
      }
    })
  },
  apiGet(obj ,url, params = {}) {
    var self = this
    return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
        resolve(res);
      } else {
        if(res.data.errorLabel == '操作权限不足') {
          self.logout()
          self.success(obj,'请重新登陆','/login')
          reject();
        } else {
          reject(res.data.errorLabel);
        }
      }
    }).catch(err => {
      self.error(obj,'网络连接错误','')
      reject();
    });
    });
  },
  apiPost(obj,url, params) {
  var self = this
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((res) => {
        if (res.data.callStatus === 'SUCCEED') {
          resolve(res);
        } else {
          if(res.data.errorLabel == '无操作权限') {
            self.logout()
            self.success(obj,'请重新登陆','/login')
            reject();
          } else {
            reject(res.data.errorLabel);
          }
        }
      }).catch(() => {
        // reject(err);
        self.error(obj,'网络连接错误','')
        reject();
      });
  });
},

  // 用户退出
  userExit (obj, url) {
    obj.$message({
      message: '用户已存在',
      type: 'error',
      duration: '1200',
      onClose: function () {
        obj.$router.push(url)
      }
    })
  },
  // baseUrl: 'http://61.190.61.78:6784/iws/api/',
  baseUrl: 'http://localhost:8080/iws/api/',
  setHeight: function (value) {
    var wh = document.body.scrollHeight
    value.style.minHeight = wh - 100 + 'px'
    value.style.height = 'auto'
  },
  setNavHeight (value) {
    var wh = document.body.scrollHeight
    value.style.minHeight = wh - 180 + 'px'
    value.style.height = 'auto'
  },
  // 选择省份
  province: function (obj) {
    var self = obj
    obj.selectCity = ''
    obj.selectArea = ''
    obj.areas = ''
    axios.post(this.baseUrl + 'area/province?provinceId=' + obj.selectProvince.provinceId)
    .then(function (res) {
      self.citys = res.data.data.city
    })
  },
  // 选择市
  city: function (obj) {
    var self = obj
    obj.selectArea = ''
    // console.log('市被调用了')
    if (obj.selectCity !== '') {
      axios.post(this.baseUrl + 'area/city?cityId=' + obj.selectCity.cityId)
      .then((res) => {
        self.areas = res.data.data.area
      })
    }
  },
  // 选择地区
  area: function (obj) {
    // console.log(obj.selectArea.areaId)
  },
  getHttpData: function (data) {
    var temp = ''
    for (var i in data) {
      if (data[i] != null && data[i] !== 'null') {
        temp = temp + '&' + i + '=' + data[i]
      }
    }
    return temp
  },
  getHttpDataWithToken: function (data) {
    var temp = ''
    for (var i in data) {
      if (data[i] != null && data[i] !== 'null') {
        temp = temp + '&' + i + '=' + data[i]
      }
    }
    temp = temp + '&token=' + this.getToken();
    return temp
  },
  postHttpDataWithToken: function (data) {
    var temp = new FormData()
    for (var i in data) {
      if (data[i] != null) {
        temp.append(i, data[i])
      }
    }
    temp.append('token', this.getToken())
    return temp
  },
  postHttpDataWithTokenNoForm: function (data) {
    data.token = this.getToken()
    return data
  },
  postHttpData: function (data) {
    var temp = new FormData()
    for (var i in data) {
      if (data[i] != null) {
        temp.append(i, data[i])
      }
    }
    return temp
  },
  setToken (token) {
    localStorage.setItem('watertoken', token)
    localStorage.setItem('watertokentime', new Date().getTime())
  },
  getToken () {
    var date = localStorage.getItem('watertokentime')
    if (new Date().getTime() - date > 36000000) {
      // alert('登录过期')
      return null
    }
    return localStorage.getItem('watertoken')
  },
  getUser: function () {
    return JSON.parse(localStorage.getItem('wateruser'))
  },
  setUser: function (wateruser) {
    localStorage.setItem('wateruser', JSON.stringify(wateruser))
  },
  logout: function(){
    localStorage.setItem('watertoken', null)
    localStorage.setItem('watertokentime', null)
    localStorage.setItem('wateruser', null)
  },
  getToday: function (today) {
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    return today
  }
}
