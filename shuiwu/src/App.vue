<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-size: 12px;
  font-family: "Microsoft YaHei";
}
ul li{
  list-style: none;
}
.whiteCo input{
  color: #fff!important;
}
.remoteDate button.el-button--primary{
  color: #fff;
  background-color: rgba( 240, 255, 207, .4);
  border-color: rgba( 240, 255, 207, .4);
}
.remoteDate button.is-disabled{
  color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5;
}
.selectController input{
  width: 100px;
}
.selectController i{
  color: #000!important;
}
a,a:hover{
  text-decoration: none;
}
a:active{
  color: #000;
}
.addcontro .el-dialog{
  width: 65%!important;
}
.addcontro .el-dialog__footer{
  text-align: center;
}
.systemSelect .el-tag{
  border-radius: 6px;
  background-color: rgb( 238, 238, 238 );
  width: 191px;
  height: 41px;
  line-height: 41px;
  text-align: center;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  margin-right: 40px;
  position: relative;
  margin-bottom: 20px;
}
.systemSelect .el-tag .el-tag__close{
  position: absolute;
  right: 0;
  top: 0;
  font-size: 15px;
}
.addcontro .el-dialog__footer .el-button,.controllerOs .el-dialog__footer .el-button--default{
  width: 200px;
  height: 40px;
}
.addcontro .el-dialog__footer .el-button--default{
  margin-right: 110px;
  /*background-color: rgb( 235, 235, 235 );*/
}
/*.BMap_Marker img{
  width: 30px;
}*/
.controllerOs .el-dialog__footer{
  text-align: center;
}
.map .BMapLabel{
  display: none!important;
}
.map .BMap_Marker:hover + .map .BMapLabel{
  display: inline!important;
}
.indexMap .amap-icon{
  /*background: red;*/
  display: block;
  width: 31px;
  height: 37px;
  background: url('images/mapContent.png');
  text-align: center;
}
.indexMap .amap-icon img{
  width: 20px;
  height: 20px;
  right: 0;
  left: 5px!important;
  top: 5px!important;
}
.addressMarker .BMapLabel{
  border-radius: 4px;
  background-color: rgba( 0, 0, 0, .4)!important;
  color: #fff!important;
  width: 125px;
  height: 72px;
  display: block;
  border-color: rgba( 0, 0, 0, .4)!important;
  text-align: center;
  overflow: hidden;
}
/*.el-carousel__container{
  width: 1140px;
  text-align: left;
  margin:0 auto;
}*/
.el-radio-button:first-child .el-radio-button__inner{
  border: none!important;
  border-radius: 4px!important;
}
.el-radio-button__inner{
  border: none!important;
}
.el-radio-button__orig-radio:checked+.el-radio-button__inner{
  border-radius: 4px!important;
}
.amap-marker:nth-child(2n+1){
  z-index: 999!important;
}
.el-input__inner{
  background-color: transparent!important;
}
.personalDiv .el-input__inner::-webkit-input-placeholder{color:#fff!important;}
.personalDiv .el-input__inner::-moz-placeholder{color:#fff!important;}
.personalDiv .el-input__inner:-moz-placeholder{color:#fff!important;}
.newsConNav .el-select .el-input__inner{
  border: none;
  text-align: center;
}
.confirm{
  color: #fff!important;
  border: none!important;
}
.confirm:hover{
  border: none;
}
/*.el-carousel__item:first-child{
  display: inline-block!important;
}*/
</style>
