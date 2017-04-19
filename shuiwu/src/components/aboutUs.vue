<template>
  <div class="about">
    <v-header></v-header>
    <div class="aboutUsContent">
      <div class="aboutUsContentInfo">
        <span class="lxfs">联系方式</span><a href="/index" class="goIndex">返回首页</a>
        <div class="addressDetail">
          <div class="addressDetailBorder">
            <p>地址：安徽省合肥市双凤经济开发区金江路32号</p>
            <p>邮编：231131</p>
            <p>电话：0551-66318181/85/86/87/89</p>
            <p>传真：0551-66318181转8021</p>
          </div>
        </div>
        <div class="addressDetailImg">
          <img src="../images/aboutUs.png" alt="">
        </div>
      </div>
      <div class="mapContent">
        <baidu-map class="map" :center="{lng: 117.276919, lat: 31.973875}" :zoom="18">
          <bm-marker :position="{lng: 117.276919, lat: 31.973875}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :label="{content: 'Marker Label', opts: {offset: {width: 20, height: -10}}}"></bm-marker>
        </baidu-map>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import header from './common/header'
import footer from './common/footer'
export default {
  name: 'aboutUs',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    'v-header': header,
    'v-footer': footer
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aboutUsContentInfo{
  position: relative;
  margin-bottom: 150px;
}
.mapContent{
  clear: both;
  height: 655px;
}
.map{
  height: 100%;
}
.aboutUsContent{
  width: 1200px;
  margin: 60px auto;
}
.goIndex{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  position: relative;
  left: 420px;
  padding-left: 15px;
}
.goIndex::before{
  content: '';
  display: inline-block;
  background-color: rgb( 20, 135, 202 );
  width: 10px;
  height: 34px;
  position: absolute;
  left: -11px;
  margin-right: 15px;
}
.lxfs{
  display: inline-block;
  background-color: rgb( 20, 135, 202 );
  width: 132px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 6px;
}
.addressDetail{
  border-width: 1px;
  border-color: rgb( 20, 135, 202 );
  border-style: solid;
  width: 469px;
  height: 286px;
  padding: 10px;
  position: relative;
  top: -20px;
  z-index: -1;
  left: 60px;
}
.addressDetailImg{
  border-width: 1px;
  border-color: rgb( 20, 135, 202 );
  border-style: solid;
  width: 596px;
  height: 364px;
  text-align: center;
  position: absolute;
  top: 70px;
  left: 500px;
}
.addressDetailBorder p{
  position: relative;
  top: 60px;
  left: 60px;
  line-height: 30px;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
}
.addressDetailImg img{
  margin-top: 10px;
  background-color: rgb( 255, 255, 255 );
  box-shadow: 2px 3.464px 9px 8px rgb( 168, 168, 168 );
}
.addressDetailBorder{
  background-color: rgb( 255, 255, 255 );
  box-shadow: 2px 3.464px 20px 8px rgb( 168, 168, 168 );
  width: 454px;
  height: 266px;
  margin:10px auto 0;
}
</style>
