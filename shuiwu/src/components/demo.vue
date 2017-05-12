<template>
  <div>
    <chart :options="options"></chart>
    <button type="button" name="button" v-on:refresh="add">dianji</button>
  </div>
</template>

<script>
// import axios from 'axios'
import Vue from 'vue'
import ECharts from 'vue-echarts3'
Vue.component('chart', ECharts)
export default {
  data () {
    return {
      options: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '邮件营销',
          type: 'line',
          data: [50, 200, 6, 100, 100, 20]
        }, {
          name: '联盟广告',
          type: 'line',
          data: [500, 20, 306, 100, 10, 120]
        }, {
          name: '视频广告',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  methods: {
    add () {
      console.log(123)
      var obj = {
        name: '不知道',
        type: 'line',
        data: [20, 30, 40, 50, 60, 80]
      }
      this.options.series = []
      this.options.series.push(obj)
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
