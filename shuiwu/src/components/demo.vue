<template>
  <div>
    <el-select v-model="select" placeholder="请选择" @change="province">
      <el-option
        :key="item"
        v-for="item in list"
        :label="item.name"
        :value="item.provinceId">
      </el-option>
    </el-select>
    <el-select v-model="cityselect" placeholder="请选择">
      <el-option
        :key="item"
        v-for="item in city"
        :label="item.name"
        :value="item.cityId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      msg: 'nihao',
      select: 150000,
      list: [],
      cityselect: 150100,
      city: []
    }
  },
  created () {
    var self = this
    axios.post('http://61.190.61.78:6784/iws/api/area/areas')
    .then((res) => {
      console.log(res)
      self.list = res.data.data
      self.$nextTick(function () {
        self.province()
      })
    })
  },
  methods: {
    province () {
      var self = this
      axios.post('http://61.190.61.78:6784/iws/api/area/province?provinceId=' + this.select)
      .then((res) => {
        console.log(res)
        console.log(123)
        self.city = res.data.data.city
      })
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
