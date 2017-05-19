<template>
  <div class="echarts">
    <IEcharts :option="bar" class="echarts" id="main"></IEcharts>
    <button @click.enter="doRandom">Random</button>
    <button @click="del">删除</button>
  </div>
</template>

<script type="text/babel">
  var echarts = require('echarts')
  import IEcharts from 'vue-echarts-v3'
  export default {
    components: {
      IEcharts
    },
    props: {
    },
    data: () => ({
      bar: {
        title: {
          text: 'ECharts Hello World'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        xAxis: {
          data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks']
        },
        yAxis: {},
        series: []
      }
    }),
    methods: {
      doRandom () {
        var that = this
        let data = ['你好', '再见', '远方', '诗']
        let value = []
        for (let i = 0, min = 5, max = 99; i < 6; i++) {
          value.push(Math.floor(Math.random() * (max + 1 - min) + min))
        }
        var obj = {
          name: data[Math.floor(Math.random() * 4)],
          type: 'line',
          data: value
        }
        // that.bar.series[0].data = data
        that.bar.series.push(obj)
        that.bar.legend.data.push(obj.name)
        // console.log(that.bar.series)
      },
      // onReady (instance) {
      //   console.log(instance)
      // },
      del () {
        var that = this
        var index = Math.floor(Math.random())
        console.log(index)
        that.bar.series.splice(index, 1)
        that.bar.series = that.bar.series
        that.bar.legend.data.splice(index, 1)
        console.log(that.bar)
        var myChart = echarts.init(document.getElementById('main'))
        myChart.setOption(this.bar)
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
