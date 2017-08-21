<template>
  <div class="controllerdetail">
    <v-header></v-header>
    <!-- <div class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;"></span>
          <el-button type="primary">数据查看</el-button>
        </div>
        <div v-for="item in groupData.devices" v-if="groupData != null">
          {{item.name}}
        </div>
      </el-card>
    </div> -->
    <div class="slidebar">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-search"></i>
          <span slot="title">数据查看</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1" v-for="">选项1</el-menu-item>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-edit"></i>
        <span slot="title">设备控制</span>
      </el-menu-item>
    </el-menu>
    </div>
    <div id="container">
        <canvas id="canvas"></canvas>
    </div>

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
      groupData: null,
      isCollapse: true,
      limitionMsg: {
        systemId: null,
        areaId: null,
        writable: 2,
        token: global.getToken()
      }
    }
  },
  mounted() {
    init();
    animate();
  },
  created () {
    var self = this
    axios.get(global.baseUrl + 'room/groupDetail?'+global.getHttpDataWithToken(this.groupMsg))
    .then((res) => {
      console.log(res.data.data)
      self.groupData = res.data.data
      res.data.data.devices.forEach(function(item,index){
        axios.get(global.baseUrl + 'data/presentData?'+global.getHttpDataWithToken({deviceId:item.id}))
        .then((res) => {
          console.log(res.data.data)
          item.data = res.data.data;
        })
      })
    })
  },
  methods: {
    handleOpen(key, keyPath) {
       console.log(key, keyPath);
     },
     handleClose(key, keyPath) {
       console.log(key, keyPath);
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
    var transparentMat = new THREE.MeshPhongMaterial({color: 0xcccccc, transparent:true, opacity:0.7});

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

    var pumpState1Material = new THREE.MeshPhongMaterial({color: 0x00ff00});    //状态1颜色值
    var pumpState2Material = new THREE.MeshPhongMaterial({color: 0x0000ff});    //状态2颜色值
    var pumpState3Material = new THREE.MeshPhongMaterial({color: 0xff0000});    //状态3颜色值


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
    function loadFile(fileName){
        var resourcePath = resourceFolder + fileName + "/" + fileName;
        if(!isExist(resourcePath + modelExtension)) {
            return;
        }

        var onProgress = function(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
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
                        pipeObjects.push(object.children[i]);
                    }

                    //气压表位置
                    if(object.children[i].name.slice(0, 10) === "pressure_q") {
                        object.children[i].visible = false;
                        var strs = object.children[i].name.split("_");
                        pressurePositions[strs[2]] = getCenterOfObject(object.children[i]);
                    }

                    //泵
                    if(object.children[i].name.slice(0, 2) === "b_") {
                        var strs = object.children[i].name.split("_");
                        object.children[i].oldmat = object.children[i].material;
                        if(pumpObjects[strs[1]] === undefined) {
                            pumpObjects[strs[1]] = [];
                        }
                        pumpObjects[strs[1]].push(object.children[i]);
                    }

                    //泵位置
                    if(object.children[i].name.slice(0, 8) === "state_b_") {
                        object.children[i].visible = false;
                        var strs = object.children[i].name.split("_");
                        var sprite = makeTextSprite( " 停止 ",
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
                camera.position.set(center.x+boundingSphere.radius, center.y, center.z);

                // CONTROLS
                cameraControls.target.set( center.x, center.y, center.z );
                loadCompleted(fileName);
                loadArrow();
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
            }, onProgress, onError);
        });
    }

    function loadCompleted(resourceName) {
        console.log("load model " + resourceName + " completed");
    }


    /**
     * 显示或隐藏水流
     */
    function showFlowDir(bShow){
        if(bShow) {
            //显示水流箭头
            for(var flowPair in flowPositions) {
                var beginPos = flowPositions[flowPair]["0"];
                var endPos = flowPositions[flowPair]["1"];
                showArrowAlongLine(beginPos, endPos);
            }
            //透明化管道
            for(var i=0; i<pipeObjects.length; i++) {
                pipeObjects[i].material = transparentMat;
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


    /**
     * 改变泵的状态
     * @param index 泵的编号
     * @param state 泵的状态 0:停止 1：变频 2：工频 3： 故障
     */
    function changePumpState(index, state) {
        if(pumpObjects[index] === undefined)
            return;
        switch (state) {
            case 0:
                changePumpMat(index);
                changePumpStateSprite(index, "停止");
                break;
            case 1:
                changePumpMat(index, pumpState1Material);
                changePumpStateSprite(index, "变频");
                break;
            case 2:
                changePumpMat(index, pumpState2Material);
                changePumpStateSprite(index, "工频");
                break;
            case 3:
                changePumpMat(index, pumpState3Material);
                changePumpStateSprite(index, "故障");
                break;
            default:
                break;
        }
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

        // get size data (height depends only on font size)
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
    function init() {
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
        loadFile("01");

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
        var state = parseInt($("pumpState").value);
        changePumpState("1", state);
    }
    function changePressure() {
        if(!isShowPressure) {
            $("pressureBtn").innerHTML = "隐藏气压值";
            var value = $("pressureValue").value;
            showPressureSprite("0", value, true);
        } else {
            $("pressureBtn").innerHTML = "显示气压值";
            showPressureSprite("0", "", false);
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
   width: 150px;
   position: absolute;
 }
 .content {
   width: 200px;
 }
</style>
