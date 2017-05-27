<template>
  <div class="videoMsg" ref="contentHeight" id="divPlugin">
    <ul>
      <li v-for="videoList in videoLists"><video :src="videoList.src" autoplay poster="" controls></video></li>
      <li class="addVideo"><i class="el-icon-plus" v-on:click="videoListAlert = true" style="color:#aaaaaa;"></i></li>
    </ul>
    <el-dialog title="视频列表" v-model="videoListAlert">
      <!-- <el-table :data="videoTableData">
        <el-table-column property="date" label="名称" width="150"></el-table-column>
        <el-table-column property="name" label="地址" width="200"></el-table-column>
        <el-table-column property="address" label="监控地址"></el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template scope="scope">
            <el-button type="text" size="small">添加</el-button>
          </template>
      </el-table> -->
    </el-dialog>
  </div>
</template>
<!-- <script src="./static/jquery.js"></script> -->
<!-- <script src="./static/demo-easy.js"></script> -->

<script type="text/javascript">
import $ from 'jquery'
// import axios from 'axios'
import global from '../global/global'
// $(function () {
//
// })
export default {
  data () {
    return {
      videoListAlert: false,
      videoLists: [
        // { src: 'https://misc.rrcimg.com/pc/two_anniversary.mp4' },
        // { src: 'https://misc.rrcimg.com/pc/two_anniversary.mp4' },
        // { src: 'https://misc.rrcimg.com/pc/two_anniversary.mp4' }
      ],
      videoTableData: null
    }
  },
  created () {
    setTimeout(this.test, 200)
    // this.test()
    // console.log(this.$route)
    // console.log($)
    // axios.get(global.baseUrl + '')
  },
  methods: {
    test () {
      // 检查插件是否已经安装过
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
    	if (-2 == iRet) {
    		alert("您的Chrome浏览器版本过高，不支持NPAPI插件！");
    		return;
    	} else if (-1 == iRet) {
            alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
    		return;
        }

    	var oPlugin = {
    		iWidth: 600,			// plugin width
    		iHeight: 400			// plugin height
    	};

    	// 初始化插件参数及插入插件
    	WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
            bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iWndowType: 1,
    		cbSelWnd: function (xmlDoc) {

    		}
    	});
    	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

    	// 检查插件是否最新
    	if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
    		alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
    		return;
    	}

    	var oLiveView = {
    		iProtocol: 1,			// protocol 1：http, 2:https
    		szIP: "192.168.2.4",	// protocol ip
    		szPort: "80",			// protocol port
    		szUsername: "admin",	// device username
    		szPassword: "xj12345678",	// device password
    		iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
    		iChannelID: 1,			// channel no
    		bZeroChannel: false		// zero channel
    	};

    	// 登录设备
    	WebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
    		success: function (xmlDoc) {
    			// 开始预览
    			WebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
    				iStreamType: oLiveView.iStreamType,
    				iChannelID: oLiveView.iChannelID,
    				bZeroChannel: oLiveView.bZeroChannel
    			});
    		}
    	});

    	// 关闭浏览器
    	$(window).unload(function () {
    		WebVideoCtrl.I_Stop();
    	});
    }
  },
  mounted () {
    var login = this.$refs.contentHeight
    global.setNavHeight(login)
    if (!global.getToken()) {
      this.$router.push('/login')
    }
    // if (this.$route.path == '/video') {
    // }
  }
}
</script>
<style media="screen">
.videoMsg{
  width: 1280px;
  margin: 0 auto;
}
.videoMsg ul{
  overflow: hidden;
  width: 100%;
}
.videoMsg ul li{
  width: 640px;
  height: 400px;
  float: left;
  text-align: center;
  border-width: 3px;
  border-color: rgb( 15, 21, 11 );
  border-style: solid;
  box-sizing: border-box;
}
.videoMsg ul li video{
  max-width: 100%;
  height: 100%;
}
.addVideo i{
  font-size: 80px;
  line-height: 400px;
  text-align: center;
  cursor: pointer;
}
</style>
