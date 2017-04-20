<template>
  <div>
    <echarts
        :title="{'text':'标题'}"
        :options="data"
        type="line"
        className="echarts">
    </echarts>
    <button type="button" name="button" v-on:refresh="add">dianji</button>
  </div>
</template>

<script>
// import axios from 'axios'
import Vue from 'vue'
import Echarts from 'vue-echarts3'
Vue.component('chart', Echarts)
export default {
  data () {
    return {
      data: {
        legend: {
          data: [ '页面PV', '页面UV', '下载PV', '下载UV', '激活量', '注册量' ]
        },
        xAxis: [
          {
            type: 'category',
            data: [ '20170201', '20170202', '20170203', '20170204', '20170205', '20170206', '20170207' ]
          }
        ],
        series: [
          {
            name: '页面PV',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [ 320, 332, 301, 334, 390, 330, 2 ]
          }
        ]
      }
    }
  },
  methods: {
    add () {
      var obj = {
        name: '页面UV',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [ 30, 32, 301, 334, 30, 330, 20 ]
      }
      console.log(this.data)
      this.data.series.push(obj)
    }
  }
}
</script>

<style scoped>
.echarts {
   width: 400px;
   height: 400px;
 }
</style>
