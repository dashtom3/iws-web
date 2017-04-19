import axios from 'axios'
export default{
  userMsg: {},
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
  // token时间
  timeout (obj, msg, url) {
    obj.$message({
      message: msg,
      type: 'error',
      duration: '1000',
      onClose: function () {
        obj.$router.push(url)
        localStorage.token = ''
        localStorage.time = ''
      }
    })
  },
  baseUrl: 'http://61.190.61.78:6784/iws/api/',
  setHeight: function (value) {
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
    console.log(obj.selectProvince)
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
  postHttpDataWithToken: function (data) {
    var temp = new FormData()
    for (var i in data) {
      if (data[i] != null) {
        temp.append(i, data[i])
      }
    }
    temp.append('token', localStorage.token)
    return temp
  },
  getToday: function (today) {
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    return today
  }
}
