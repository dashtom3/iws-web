<template>
  <div class="history">
    <ul class="lists">
      <li>
        <el-row :gutter="20">
          <el-col :span="16"><span></span><span>设备D安徽省合肥市A区B小区3房间 D字段40002电压出现问题：1.5正常值为0~0.5,已发送短信给您：152167197</span></el-col>
          <el-col :span="8"><el-button type="Danger">默认按钮</el-button></el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
