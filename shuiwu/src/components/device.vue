<template>
  <div class="controllerdetail">
    <v-header></v-header>
    <div class="slidebar">
    <el-menu class="el-menu-vertical-demo" @select="choose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-search"></i>
          <span slot="title">数据查看</span>
        </template>
        <el-menu-item-group v-if="groupData != null">
          <el-menu-item :index="'1-'+index" v-for="item,index in groupData.devices">{{item.name}}</el-menu-item>
          <!-- <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-edit"></i>
          <span slot="title">设备控制</span>
        </template>
        <el-menu-item-group v-if="groupData != null">
          <el-menu-item :index="'2-'+index" v-for="item,index in groupData.devices">{{item.name}}</el-menu-item>
          <!-- <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </div>
    <div class="content" v-if="paramData != null">
      <div class="content-title">
        <span class="title-left">{{paramData.name}}</span>
        <span class="title-right"><el-button @click="closeParamData" size="small">关闭</el-button></span>
      </div>
      <el-row>
        <el-col :span="2" v-for="(item, index) in paramData.data.data" :key="item.id" >
          <el-card :body-style="{ padding: '5px' , height:'60px'}">
            <div><span >{{item.name}}</span></div>
            <div>
              <span v-if="item.data == null || item.data == ''" style="color:#20A0FF">暂无数据</span>
              <span v-else style="color:#20A0FF">{{item.data}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="content" v-if="controlData != null">
      <div class="content-title">
        <span class="title-left">{{groupData.devices[controlIndex].name}}</span>
        <span class="title-right"><el-button @click="closeControlData" size="small">关闭</el-button></span>
      </div>
      <el-row>
        <el-col :span="4" v-for="(item, index) in controlData" :key="item.number" >
          <el-card :body-style="{ padding: '5px' , height:'50px'}">
            <div v-if="item.data == '自动' || item.data == '手动'">
              <span >{{item.name}}</span>
              <el-switch
              v-model="item.switchBtn"
              on-text="手动"
              off-text="自动"
              on-color="#13ce66"
              off-color="#ff4949"
              @change="changeValue(item,index)" >
              </el-switch>
            </div>
            <div v-if="item.data == '启动' || item.data == '关闭'">
              <span >{{item.name}}</span>
              <el-switch
              v-model="item.switchBtn"
              on-text="启动"
              off-text="关闭"
              on-color="#13ce66"
              off-color="#ff4949"
              @change="changeValue(item,index)">
              </el-switch>
            </div>
            <div v-if="(item.data != '启动' && item.data != '关闭') && (item.data != '自动' && item.data != '手动')">
              <span >{{item.name}}</span><br>
              <span >{{item.data}}{{item.unit}}</span>&nbsp;&nbsp;<el-button plain size="mini" @click="changeNum(item)">设定</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div id="container" v-loading.body="fullscreenLoading" :element-loading-text="'模型加载中..'+loadPercent">
        <canvas id="canvas" v-if="protocol == 'MODBUS'"></canvas>
          <img src="../images/dataTCP.jpg" style="width:100%;height:100%" v-if="protocol == 'TCP'"></canvas>
    </div>
    <el-dialog
      :title="timeItem.name"
      :visible="timeItemShow"
      width="30%"
      >
      <span>设置：</span><el-input v-model="timeItem.pumpStatus" width="70%"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeItemShow = false">取 消</el-button>
        <el-button type="primary" @click="changeNumCertain">确 定</el-button>
      </span>
    </el-dialog>
    <v-footer></v-footer>
  </div>
</template>

<script>
import header from './common/header'
import footer from './common/footer'
import axios from 'axios'
import global from '../global/global'
export default {
  data () {
    return {
      groupMsg: {
        groupId: this.$route.params.id
      },
      protocol:'MODBUS',
      groupData: null,
      isCollapse: true,
      limitionMsg: {
        systemId: null,
        areaId: null,
        writable: 2,
        token: global.getToken()
      },
      loadPercent:"0%",
      paramData: null,
      paramIndex:null,
      controlData: null,
      controlIndex: null,
      manual: {
        deviceId: null,
        number: null,
        pumpStatus: null
      },
      timeItemShow:false,
      timeItem:{
        pumpStatus:null,
        number:null,
        name:null
      },
      fullscreenLoading: false,
      modelEnums: {
        '泵前压力':[0,0],'泵后压力':[0,1],'1#泵状态':[1,0],'2#泵状态':[1,1],'3#泵状态':[1,2],'4#泵状态':[1,3],'5#泵状态':[1,4],'6#泵状态':[1,5]
      }
    }
  },
  mounted() {
    this.fullscreenLoading = true;
    var self = this
    axios.get(global.baseUrl + 'room/groupDetail?'+global.getHttpDataWithToken(this.groupMsg))
    .then((res) => {
      if(res.data.callStatus == 'FAILED') {
        alert("暂无操作权限")
        self.fullscreenLoading = false;
      }else {
        self.groupData = res.data.data
        if(self.groupData.devices != null && self.groupData.devices.length>0) {
          self.protocol = self.groupData.devices[0].protocol
          if(self.protocol == 'MODBUS') {
            fileType = self.groupData.typeId == 0 ? 1:self.groupData.typeId
            init(this);
            animate();
          } else {
            self.getDeviceData()
            self.fullscreenLoading = false;
          }
        }
      }
      // console.log(self.groupData)
    })
    setInterval(() => {
      console.log('windows reload')
            this.getDeviceData()
        }, 15000)
  },
  created () {

  },
  methods: {
     choose(key, keyPath) {
       var temp = key.split("-")
       if(temp[0] == '1'){
         this.controlData = null
         this.paramIndex = temp[1]
         this.paramData = this.groupData.devices[temp[1]]
       }  else {
         this.paramData = null
         this.controlIndex = temp[1];
         this.getControlData(temp[1]);
       }
     },
     showData(data){
       var self = this
       data.forEach(function(item){
         for(var key in self.modelEnums){
           if(item.name == key) {
             if(self.modelEnums[key][0] == 0) {
               showPressureSprite(self.modelEnums[key][1],item.data,true)
             } else {
               changePumpState(self.modelEnums[key][1],item.data)
             }
           }
         }
       })
     },
     closeParamData() {
       this.paramData = null;
     },
     closeControlData() {
       this.controlData = null;
     },
     changeNum(item){
       console.log(item)
       this.timeItem = item
       this.timeItemShow = true
     },
     changeNumCertain(){
       var self = this
       this.manual.deviceId = this.groupData.devices[this.controlIndex].id
       this.manual.number = this.timeItem.number
       this.manual.pumpStatus = this.timeItem.pumpStatus

       global.apiPost(this,global.baseUrl + 'room/manual',global.postHttpDataWithToken(this.manual))
       .then((res) => {
         self.timeItemShow = false
         if(res.callStatus == "FAILED") {
           global.error(this,'控制失败',null)
         } else{
           self.timeItem.data = this.timeItem.pumpStatus
         }
         console.log(res.data)
       }).catch(()=>{
         global.error(this,'控制失败',null)
       })
     },
     changeValue(item,index){

      //  this.$set(this.controlData.control,index,item)
      //  console.log(item,index,this.controlData.control)
       this.manual.deviceId = this.groupData.devices[this.controlIndex].id
       this.manual.number = item.number
       this.manual.pumpStatus = item.switchBtn == true ? 1:0
       global.apiPost(this,global.baseUrl + 'room/manual',global.postHttpDataWithToken(this.manual))
       .then((res) => {
         console.log(res)
         if(res.callStatus == "FAILED") {
           global.error(this,'控制失败',null)
           item.switchBtn = !item.switchBtn
         }
       }).catch(()=>{
         global.error(this,'控制失败',null)
         item.switchBtn = !item.switchBtn
       })
     },
     getDeviceData() {
       var self = this
       if(this.groupData != null){
         this.groupData.devices.forEach(function(item,index){
           axios.get(global.baseUrl + 'data/presentData?'+global.getHttpDataWithToken({deviceId:item.id}))
           .then((res) => {
             item.data = res.data.data;
             console.log(res)
             self.showData(res.data.data.data)
             if(self.paramIndex == index && self.paramData != null) {
               self.paramData = Object.assign({},self.paramData,self.groupData.devices[index])
               console.log(self.paramData)
             }
           })
         })
       }
     },
     getControlData(index){
       var self = this
       axios.get(global.baseUrl + 'data/pumpStatus?'+global.getHttpDataWithToken({deviceId:self.groupData.devices[index].id}))
       .then((res) => {
         res.data.data.forEach(function(item,index){
           if(item.value == 0) {
             item.switchBtn = false
           } else {
             item.switchBtn = true
           }
         })
         self.groupData.devices[index].control = res.data.data
         this.controlData = self.groupData.devices[index].control
       })
     }
  },
  components: {
    'v-header': header,
    'v-footer': footer
  }
}
function $(id){return document.getElementById(id);}

var container;

var camera, scene, renderer;
var cameraControls;

var clock = new THREE.Clock();

//    var transparentMat = new THREE.MeshPhongMaterial({color: 0xcccccc, transparent:true, opacity:0.7});
var fileType = "";
var resourceFolder = "/static/3d/resource/";
var modelExtension = ".obj";
var materialExtension = ".mtl";
var arrowObj;
var arrowSize;
var arrowSpeed = 0.2;

var flowPositions = {};
var pressurePositions = {};     //压力表显示位置列表
var pipeObjects = [];           //管道模型对象列表
var flowArrowList = [];         //表示水流箭头的模型对象列表
var pressureSpriteList = {};    //压力值sprite列表
var pumpStateSpriteList = {};   //泵状态sprite列表
var pumpObjects = {};           //泵模型对象列表
var pumpPipeList = {};          //泵所对应管道列表
var pumpGroupList = {};         //泵所对应组模型列表

var pumpState1Material = new THREE.MeshPhongMaterial({color: 0x1a237e});    //状态1颜色值
var pumpState2Material = new THREE.MeshPhongMaterial({color: 0x42a5f5});    //状态2颜色值
var pumpState3Material = new THREE.MeshPhongMaterial({color: 0xf44336});    //状态3颜色值

var waterTexture = new THREE.TextureLoader().load("/static/3d/resource/texture/water.png");
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set( 2, 2 );
var waterMat = new THREE.MeshPhongMaterial({map: waterTexture, side: THREE.DoubleSide, transparent:true, opacity:0.7});

//========测试btn变量========
var isShowFlow = false;
var isShowPressure = false;
//=======================

// init();
// animate();

/**
 * 获取某个object的center
 */
function getCenterOfObject(object) {
    var center = new THREE.Vector3();
    var geometry = object.geometry;
    geometry.computeBoundingBox();
    center.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    center.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    center.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
    object.localToWorld( center );
    return center;
}

/**
 * 导入模型文件
 * @param fileName: 文件名，不包含文件后缀（如"01"对应模型为"resource/01/01.obj"）
 */
function loadFile(fileName,self){
    var resourcePath = resourceFolder + fileName + "/" + fileName;
    if(!isExist(resourcePath + modelExtension)) {
        return;
    }

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            self.loadPercent = Math.round(percentComplete, 2) + "%";
            console.log(fileName + " " + Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function(xhr) {
        console.error("load model: " + fileName + " error");
    };

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( resourceFolder + fileName + "/" );
    mtlLoader.load( fileName + materialExtension, function( materials ) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( resourceFolder + fileName + "/" );
        objLoader.load( fileName + modelExtension, function ( object ) {
            scene.add( object );

            var vertices = [];
            for(var i = 0; i < object.children.length; ++i)
            {
                //表示水流的球
                if(object.children[i].name.slice(0, 5) === "flow_") {
                    object.children[i].visible = false;
                    var pos = getCenterOfObject(object.children[i]);
                    var strs = object.children[i].name.split("_");
                    if(flowPositions[strs[1]] === undefined) {
                        flowPositions[strs[1]] = {};
                    }
                    flowPositions[strs[1]][strs[2]] = pos;
                }

                //管道
                if(object.children[i].name.slice(0, 5) === "pipe_") {
                    object.children[i].oldmat = object.children[i].material;
                    var strs = object.children[i].name.split("_");
                    if(strs.length >= 3 && strs[1] === "pump") {
                        if(pumpPipeList[strs[2]] === undefined) {
                            pumpPipeList[strs[2]] = [];
                        }
                        pumpPipeList[strs[2]].push(object.children[i]);
                    } else {
                        pipeObjects.push(object.children[i]);
                    }
                }

                //气压表位置
                if(object.children[i].name.slice(0, 9) === "pressure_") {
                    object.children[i].visible = false;
                    var strs = object.children[i].name.split("_");
                    pressurePositions[strs[1]] = getCenterOfObject(object.children[i]);
                }

                //泵
                if(object.children[i].name.slice(0, 5) === "pump_") {
                    var strs = object.children[i].name.split("_");
                    object.children[i].oldmat = object.children[i].material;
                    if(pumpObjects[strs[1]] === undefined) {
                        pumpObjects[strs[1]] = [];
                    }
                    pumpObjects[strs[1]].push(object.children[i]);
                }

                //泵所对应组
                if(object.children[i].name.slice(0, 6) === "group_") {
                    var strs = object.children[i].name.split("_");
                    if(pumpGroupList[strs[1]] === undefined){
                        pumpGroupList[strs[1]] = [];
                    }
                    pumpGroupList[strs[1]].push(object.children[i]);
                }

                //泵位置
                if(object.children[i].name.slice(0, 11) === "state_pump_") {
                    object.children[i].visible = false;
                    var strs = object.children[i].name.split("_");
                    var sprite = makeTextSprite( " 泵休息 ",
                        { fontsize: 64, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );

                    var pos = getCenterOfObject(object.children[i]);
                    sprite.position.set(pos.x, pos.y, pos.z);
                    pumpStateSpriteList[strs[2]] = sprite;
                    scene.add( sprite );
                }

                for(var j=0; j<object.children[i].geometry.attributes.position.array.length; ++j)
                    vertices.push(object.children[i].geometry.attributes.position.array[j]);
            }

            var box = new THREE.Box3();
            var vector = new THREE.Vector3();

            var boundingSphere = new THREE.Sphere();
            var center = boundingSphere.center;

            box.setFromArray( vertices );
            box.center( center );

            var maxRadiusSq = 0;

            for ( var i = 0, il = vertices.length; i < il; i += 3 ) {
                vector.fromArray( vertices, i );
                maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );
            }

            boundingSphere.radius = Math.sqrt( maxRadiusSq );
            camera.position.set(center.x, center.y + 2500, center.z + boundingSphere.radius + 1000 );

            // CONTROLS
            cameraControls.target.set( center.x, center.y, center.z );
            loadCompleted(fileName);
            loadArrow();
            self.getDeviceData()
            //关闭加载
            self.fullscreenLoading = false;
        }, onProgress, onError );
    });
}

function loadArrow() {
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log("arrow "+ Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
        console.error("load arrow "  + " error");
    };

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( resourceFolder + "arrow/" );
    mtlLoader.load( "arrow" + materialExtension, function( materials ) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath( resourceFolder + "arrow/" );
        objLoader.load( "arrow" + modelExtension, function (object) {
            var maxX = 0;
            for(var i=0; i<object.children.length; ++i)
            {
                for(var j=0; j<object.children[i].geometry.attributes.position.array.length; j+=3) {
                    if(maxX < Math.abs(object.children[i].geometry.attributes.position.array[j]))
                        maxX = Math.abs(object.children[i].geometry.attributes.position.array[j]);
                }
            }
            arrowObj = object;
            arrowObj.scale.set(0.7, 0.7, 0.7);
            arrowSize = maxX*0.7;
            loadCompleted("arrow");
            showFlowDir(true);
        }, onProgress, onError);
    });
}

function loadCompleted(resourceName) {
    console.log("load model " + resourceName + " completed");
}


/**
 * 显示或隐藏水流
 */
function showFlowDir(bShow) {
    if(bShow) {
        //显示水流箭头
        for(var flowPair in flowPositions) {
            var beginPos = flowPositions[flowPair]["0"];
            var endPos = flowPositions[flowPair]["1"];
            showArrowAlongLine(beginPos, endPos);
        }
        //透明化管道
        for(var i=0; i<pipeObjects.length; i++) {
            pipeObjects[i].material = waterMat;
        }
    }
    else{
        TWEEN.removeAll();

        for(var i=0; i<flowArrowList.length; ++i) {
            scene.remove(flowArrowList[i]);
        }
        flowArrowList.length = 0;

        //恢复管道material
        for(var i=0; i < pipeObjects.length; i++) {
            pipeObjects[i].material = pipeObjects[i].oldmat;
        }
    }
}

/**
 * 在beginPos到endPos这段直线上添加表示水流的箭头
 * @param beginPos: 起始点
 * @param endPos: 结束点
 */
function showArrowAlongLine(beginPos, endPos) {
    var distance = beginPos.distanceTo(endPos);
    var dir = endPos.clone();
    dir.sub(beginPos);
    dir.normalize();
    dir.multiplyScalar(arrowSize);

    var arrowNum = parseInt(distance/arrowSize/2);
    for(var i=0; i<arrowNum; ++i) {
        var arrowObjClone = arrowObj.clone();
        var pos = beginPos.clone();
        pos.addScaledVector(dir, i*2);
        arrowObjClone.position.set(pos.x, pos.y, pos.z);
        arrowObjClone.lookAt(endPos);
        scene.add(arrowObjClone);
        flowArrowList.push(arrowObjClone);

        var moveLen = distance - i*2*arrowSize - arrowSize;
        var targetPos = endPos.clone();
        targetPos.sub(dir);

        var completeFun = function() {
            this.set(beginPos.x, beginPos.y, beginPos.z);
            var len = distance - arrowSize;
            new TWEEN.Tween(this)
                .to({x: targetPos.x, y: targetPos.y, z: targetPos.z}, len/arrowSpeed)
                .onComplete(completeFun)
                .start();
        }

        new TWEEN.Tween( arrowObjClone.position )
            .to( {x: targetPos.x, y: targetPos.y, z: targetPos.z}, moveLen/arrowSpeed)
            .onComplete(completeFun)
            .start();
    }
}

/**
 * 显示气压值
 * @param index: 气压表索引值
 * @param value: 气压值
 * @param bShow: 是否显示气压值
 */
function showPressureSprite(index, value, bShow) {
    if(pressurePositions[index] != null) {
      if(pressureSpriteList[index] !== undefined) {
          scene.remove(pressureSpriteList[index]);
          pressureSpriteList[index] = undefined;
      }
      if(bShow == true) {
          var sprite = makeTextSprite( " " + value + " ",
              { fontsize: 64, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
          sprite.position.set(pressurePositions[index].x, pressurePositions[index].y, pressurePositions[index].z);
          pressureSpriteList[index] = sprite;
          scene.add( sprite );
      }
    }
}


/**
 * 改变泵的状态
 * @param index 泵的编号
 * @param state 泵的状态 0:停止 1：变频 2：工频 3： 故障
 */
function changePumpState(index, state) {
    if(pumpObjects[index] === undefined)
        return;
    switch (state) {
        case "泵休息":
            changePumpVisible(index, true);
            changePumpMat(index);
            changePumpStateSprite(index, "泵休息");
            changePumpPipeMat(index, false);
            break;
        case "泵变频":
            changePumpVisible(index, true);
            changePumpMat(index, pumpState1Material);
            changePumpStateSprite(index, "泵变频");
            changePumpPipeMat(index, true);
            break;
        case "泵运行":
            changePumpVisible(index, true);
            changePumpMat(index, pumpState2Material);
            changePumpStateSprite(index, "泵运行");
            changePumpPipeMat(index, true);
            break;
        case "泵故障":
            changePumpVisible(index, true);
            changePumpMat(index, pumpState3Material);
            changePumpStateSprite(index, "泵故障");
            changePumpPipeMat(index, false);
            break;
        case "":
            changePumpVisible(index, false);
            break;
        default:
            break;
    }
}


/**
 * 改变泵的显隐（顺便修改管道的显隐）
 * @param index 泵的编号
 * @param visible 显示或隐藏
 */
function changePumpVisible(index, visible) {
    for(var i=0; i<pumpObjects[index].length; ++i)
        pumpObjects[index][i].visible = visible;
    for(var i=0; i<pumpPipeList[index].length; ++i)
        pumpPipeList[index][i].visible = visible;
    for(var i=0; i<pumpGroupList[index].length; ++i)
        pumpGroupList[index][i].visible = visible;
    if(pumpStateSpriteList[index] != undefined && pumpStateSpriteList[index] != null)
        pumpStateSpriteList[index].visible = visible;
}

//更改泵的材质
function changePumpMat(index, mat) {
    for(var i=0; i<pumpObjects[index].length; ++i) {
        if(mat !== undefined)
            pumpObjects[index][i].material = mat;
        else
            pumpObjects[index][i].material = pumpObjects[index][i].oldmat;
    }
}
//更改泵所对应管道状态
function changePumpPipeMat(index, isWork) {
    for(var i=0; i<pumpPipeList[index].length; ++i) {
        if(isWork)
            pumpPipeList[index][i].material = waterMat;
        else
            pumpPipeList[index][i].material = pumpPipeList[index][i].oldmat;
    }
}
//更改泵的状态sprite
function changePumpStateSprite(index, stateStr) {
    scene.remove(pumpStateSpriteList[index]);
    var sprite = makeTextSprite( " " + stateStr + " ",
        { fontsize: 64, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
    var pos = pumpStateSpriteList[index].position.clone();
    sprite.position.set(pos.x, pos.y, pos.z);
    scene.add(sprite);
    pumpStateSpriteList[index] = sprite;
}

//判断资源是否存在
function isExist(url) {
    try {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("get", url, false);
        xmlhttp.send();
        return !(xmlhttp.stacks==="404");
    } catch (e) {
        return false;
    }
}

/**
 * 创建显示板
 * @param message 要显示文字
 * @param parameters 样式
 * @returns {THREE.Sprite}
 */
function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
        parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
        parameters["fontsize"] : 18;

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
        parameters["borderThickness"] : 4;

    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

//      var spriteAlignment = THREE.SpriteAlignment.topLeft;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    // background color
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
        + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
        + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial(
        { map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(200,100,2.0);
    return sprite;
}
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}



/**
 * 初始化场景
 */
function init(self) {
    container = $( 'container' );
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000000 );

    // scene
    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x666666 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xdfebff );
    directionalLight.position.set( 50, 200, 100 );
    scene.add( directionalLight );

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    loadFile(fileType,self);            //导入模型文件

    //
    renderer = new THREE.WebGLRenderer({canvas: $( 'canvas' ), antialias: true});
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.offsetWidth, container.offsetHeight );

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = container.offsetWidth/container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.offsetWidth, container.offsetHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    TWEEN.update();

    if(cameraControls) {
        var delta = clock.getDelta();
        cameraControls.update(delta);
    }
    waterTexture.offset.y = (clock.getElapsedTime()*0.1 * 3 % 1);

    renderer.render( scene, camera );
}



//===========测试btn响应函数==========
function showFlow() {
    if(!isShowFlow) {
        $("flowBtn").innerHTML = "隐藏水流方向";
    }
    else {
        $("flowBtn").innerHTML = "显示水流方向";
    }
    showFlowDir(!isShowFlow);
    isShowFlow = !isShowFlow;
}
function changePump() {
    var index = parseInt($("pumpIndex").value);
    var state = parseInt($("pumpState").value);
    changePumpState(index, state);
}
function changePressure() {
    var index = parseInt($("pressureIndex").value);
    if(!isShowPressure) {
        $("pressureBtn").innerHTML = "隐藏气压值";
        var value = $("pressureValue").value;
        showPressureSprite(index, value, true);
    } else {
        $("pressureBtn").innerHTML = "显示气压值";
        showPressureSprite(index, "", false);
    }
    isShowPressure = !isShowPressure;
}
//===================================


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #container {
   height: 100vh;
   width: 100%;
   /*display: inline-block;*/
 }
 .slidebar {
   width: 20%;
   position: absolute;
 }
 .content {
   width: 72%;
   margin-left: 24%;
   position: absolute;
   min-height:200px;
   margin-top: 10px;
   padding-bottom: 5px;
   background-color: white;
   border: 1px solid #f5f5f5;
 }
 .block {
   display: inline-block;
   width: 7%;
   height: 40px;
   padding: 5px;
   text-align: center;
 }
 .content-title {
   margin: 5px 0px;
   padding-left: 20px;
   border-bottom: 1px solid #f5f5f5;
   height: 30px;
 }
 .title-left {
   font-weight: bold;
   font-size: 16px;
 }
 .title-right {
   float: right;
   margin-right: 5px;
 }
</style>
