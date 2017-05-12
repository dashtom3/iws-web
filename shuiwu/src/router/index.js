import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import BaiduMap from 'vue-baidu-map'
import AMap from 'vue-amap'
// import '../theme/index.css'
import 'element-ui/lib/theme-default/index.css'
import tags from '@/components/common/navbar'
import login from '@/components/login'
import register from '@/components/register'
import aboutUs from '@/components/aboutUs'
import personal from '@/components/personal'
import index from '@/components/index'
import detail from '@/components/configControllerDetail'
import dataview from '@/components/dataview'
import alarminfo from '@/components/alarminfo'
import news from '@/components/news'
import newshistory from '@/components/newshistory'
import unconfirmed from '@/components/unconfirmed'
import system from '@/components/system'
import admin from '@/components/admin/admin'
import adm from '@/components/admin/adm'
import adminUser from '@/components/admin/adminUser'
import adminRoles from '@/components/admin/adminRoles'
import adminSystem from '@/components/admin/adminSystem'
import systemDetial from '@/components/admin/systemDetial'
import adminBase from '@/components/admin/adminBase'
import adminController from '@/components/admin/adminController'
// import test from '@/components/test'
import demo from '@/components/demo'
var VueResource = require('vue-resource')

Vue.use(VueResource)
// Vue.http.options.emulateHTTP = true

Vue.use(Router)
Vue.use(ElementUI)
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: '28966b6be8e4fa0e4c4f4c9b4bf8d3ce',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
})
Vue.use(BaiduMap, {
  ak: '2d12993ce41407db4050140fe342d9ba'
})
Vue.filter('date', function (value) {
  return new Date(parseInt(value)).getFullYear() + '-' + (new Date(parseInt(value)).getMonth() + 1)
})
Vue.filter('time', function (value) {
  var month = new Date(parseInt(value)).getMonth() + 1
  var date = new Date(parseInt(value)).getDate()
  var hour = new Date(parseInt(value)).getHours()
  var minutes = new Date(parseInt(value)).getMinutes()
  var seconds = new Date(parseInt(value)).getSeconds()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (month < 10) {
    month = '0' + month
  }
  if (date < 10) {
    date = '0' + date
  }
  return new Date(parseInt(value)).getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds
})

export default new Router({
  mode: 'history',
  hashbang: true,
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/detail/:id',
    component: detail
  }, {
    path: '/register',
    name: 'register',
    component: register
  }, {
    path: '/aboutUs',
    component: aboutUs
  }, {
    path: '/tags',
    name: 'tags',
    component: tags,
    children: [{
      path: '/index',
      name: 'index',
      component: index
    }, {
      path: '/personal',
      name: 'personal',
      component: personal
    }, {
      path: '/dataview',
      name: 'dataview',
      component: dataview
    }, {
      path: '/alarminfo',
      name: 'alarminfo',
      component: alarminfo
    }, {
      path: '/news',
      name: 'news',
      component: news,
      children: [{
        path: '/news/unconfirmed',
        component: unconfirmed
      }, {
        path: '/news/newshistory',
        component: newshistory
      }, {
        path: '/news/system',
        component: system
      }]
    }]
  }, {
    path: '/admin',
    component: admin
  }, {
    path: '/adm',
    component: adm,
    children: [{
      path: '/admin/user',
      component: adminUser
    }, {
      path: '/admin/roles',
      component: adminRoles
    }, {
      path: '/admin/system',
      component: adminSystem
    }, {
      path: '/admin/systemdetial/:id',
      name: 'systemDetial',
      component: systemDetial
    }, {
      path: '/admin/base',
      component: adminBase
    }, {
      path: '/admin/controller',
      component: adminController
    }]
  }, {
    path: '/demo',
    component: demo
  }]
})
