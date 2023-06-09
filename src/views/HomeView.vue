<template>
<div>
  <div class="bg">
    <div class="in_show">
      <img 
        id="in_gif"
        :z-index="0"
        style="visibility:hidden;"
        :src="require('../assets/tixing.gif'.replace('on','off'))"
      />
      
  </div>
  </div>
  <div class="home" :z-index="2">
    <!-- <h3>1.上传文件</h3> -->
    <div class="upload">
      <form class="form" id="uploadForm" method="post" action="" enctype="multipart/form-data">
        <input type="file" id="file3"  name="file" multiple='' accept=".mp4"/>
        <input type="button" value="上传mp4" id="submit" @click="upload()">
      </form>
    </div>

    <!-- <h3>2.运行</h3> -->
    <div class="run">
      <div id="run_time">设置起止时间：</div>
      <input id="run_begin" v-model="run_begin">
      <div id="run_to">~</div>
      <input id="run_end" v-model="run_end">
      <div id="run_danwei">s</div>
      <button id="run" @click="rundance()">开始运行</button>
    </div>

    <!-- <h3>3.下载文件</h3> -->
    <div class="download2">
      <button id="download" @click="download()">下载文件</button>
    </div>

    <!-- <h3>4.展示效果</h3> -->
    <button class="primary-btn" @click="myshow()">播  放</button>
  
    <!-- <h3>5.显示屏相关</h3> -->
    <div
        id="loading-text"
        style="visibility:hidden;"
    >{{ loading_text }}</div>
    <img 
        id="loading"
        src="@/assets/load.png"
        style="visibility:hidden;"
      />
    <img
      id="mote"
      src="@/assets/mote.png"
    />
    <!-- <button @click="test()">test</button> -->
  </div>
</div>
</template>

<script>
import {downloadFile,runDance} from "../api/api";

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  data(){
    return{
      can_show:1,
      loading_text:'none',
      video_time:0,
      run_begin:0,
      run_end:0,
      step1:0,
      step2:0,
      step3:0,
      // lock:0,
      lock:1,
    }
  },
  // components: {
  //   HelloWorld
  // },
  methods:{
    test(){
      this.loading_text = '算法运行中...'
      var loading_text = document.getElementById('loading-text');
      loading_text.style.visibility = 'hidden'
        this.$axios.get('/requesttest/t1/').then(
            (response) => {
                console.log("axios.get('/requesttest/t1/').then response.data:",response.data);
                return response
            }
        )       
    },
    upload() {
      this.can_show = 0
      this.loading_text = '文件上传中...'
      this.show_load()
      // 判断文件后缀
      var doc = document.getElementById('file3');
      for(var i=0;i<doc.files.length;i++){
        var name = doc.files[i].name;
        var hz = name.substring(name.lastIndexOf(".")+1);
        if(hz!="mp4" && hz!="3gp" && hz!="mov" && hz!="MP4" && hz!="3GP" && hz!="MOV"){
          alert("错误信息","请上传mp4、3gp、mov视频格式！！",'error');
          return false;
        }
      }
      // 获取文件并上传
      var formData = new FormData($('#uploadForm')[0]);
      console.log('$(\'#uploadForm\')[0]',$('#uploadForm')[0])
      console.log('formData',formData)
      $.ajax({
            type: 'post',
            url: "/base/api/fileUpload/upload/",
            data: formData,
            cache: false,       //是否在缓存中读取数据的读取
            processData: false, //用于对data参数进行序列化处理
            contentType: false, //发送信息至服务器时内容编码类型,上传文件时设置为false
      }).then((data) => {
        console.log(data)
        console.log(data.msg)
          if(data.msg=='Success'){
            alert("上传成功！");
          }else if(data==1){
            alert("错误信息，上传失败！");
          }else{ 		
            alert("错误信息,请选择需要上传的文件！");
          }
          this.video_time = data.videotime
          // 将video_time显示在前端
          this.run_end = data.videotime
          this.stop_load()
          this.step1 = 1
      });
    },
    rundance(){
      if(this.lock && !this.step1){
        alert('请先上传文件')
        return 0
      }

      // this.video_time = 10

      console.log("this.run_begin",this.run_begin)
      console.log("this.run_end",this.run_end)
      var t_begin = Number(this.run_begin)
      var t_end = Number(this.run_end)
      this.can_show = 0
      if((t_begin < 0)||(t_end < 0)){
        alert("输入时间不能小于0")
        return 0
      }else if(t_end > Number(this.video_time)){
        var alert_str = "输入时间需要小于视频总时长" + String(this.video_time) + "s"
        alert(alert_str)
        return 0
      }else if(t_begin >= t_end){
        alert("开始时间必须小于结束时间")
        return 0
      }
      // 运行算法，这里要考虑以上和下面的是否是按时间顺序的
      this.loading_text = '算法运行中...'
      this.show_load()
      runDance(this.run_begin, this.run_end).then(data=>{
        this.stop_load()
        this.step2 = 1
      })
    },
    download(){
      if(this.lock && !this.step2){
        alert('请先运行算法')
        return 0
      }
      this.can_show = 0
      this.loading_text = '请将视频下载到./src/assets/dance.gif'
      this.show_load()
      downloadFile().then(res=>{
        this.stop_load()
        alert("请将视频下载到该项目下的./src/assets/dance.gif位置，然后手动刷新页面后再点击播放！")
        this.step3 = 1
      })
    },
    myshow(){
      if(this.can_show == 1){
        var gif = document.getElementById('in_gif');
        gif.src = require('../assets/dance.gif'.replace('on','off'))
        gif.style.visibility = 'visible' // 另一个是hidden
        alert('若显示的不是您的视频，请执行所有流程，并且手动刷新页面后，再点击播放！')
      }else{
        var gif = document.getElementById('in_gif');
        gif.style.visibility = 'hidden' // 另一个是hidden
        if(this.step1 && this.step2 && this.step3){
          alert('请手动刷新页面后点击播放！')
        }else{
          alert('请执行所有流程,再手动刷新页面后点击播放！')
        }
      }
    },
    show_load(){
      // 隐藏gif
      var gif = document.getElementById('in_gif');
      gif.style.visibility = 'hidden' // 另一个是hidden
      // 显示加载中
      var loading = document.getElementById('loading');
      loading.style.visibility = 'visible'
      var loading_text = document.getElementById('loading-text');
      loading_text.style.visibility = 'visible'
    },
    stop_load(){
      console.log("-----stop_load_begin")
      var loading = document.getElementById('loading');
      loading.style.visibility = 'hidden'
      var loading_text = document.getElementById('loading-text');
      loading_text.style.visibility = 'hidden'
      console.log("-----stop_load_end")
    },
  }
}


</script>
<style>
.home{
  position: absolute;
  width: 210vh;
  height: 100vh;
  background: url("~@/assets/my_fg.png") center center no-repeat;
  background-size: 100% 100%;
}
.bg{
  position: absolute;
  width: 210vh;
  height: 100vh;
  background: url("~@/assets/my_bg.png") center center no-repeat;
  background-size: 100% 100%;
}
#file3{
  position: absolute;
  top: 37%;;
  left: 15%;
}
#submit{
  position: absolute;
  top: 37%;;
  left: 40%;
}
#run_time{
  font-size: 13.5px;
  position: absolute;
  top: 50.8%;
  left: 15%;
}
#run_begin{
  font-size: 13px;
  position: absolute;
  width: 3.9%;
  top: 50.3%;
  left: 26.8%;
}
#run_to{
  font-size: 10px;
  position: absolute;
  top: 52%;
  left: 31.8%;
}
#run_end{
  font-size: 13px;
  position: absolute;
  width: 4.5%;
  top: 50.3%;
  left: 32.9%;
}
#run_danwei{
  font-size: 13px;
  position: absolute;
  top: 51.5%;
  left: 38.5%;
}
#run{
  position: absolute;
  top: 50%;
  left: 40%;
}
#download{
  position: absolute;
  top: 63%;
  left: 15%;
}
#button_img{
  position: absolute;
  top: 23%;
  left: 71%;
  width: 12%;
  height: 12%;
}
.primary-btn {

font-size: 19px;
color: #4cd2ff;
height: 44px;
/* background-color: #07c160; */
border: 5px solid #4cd2ff;
line-height: 1.2;
text-align: center;
border-radius: 2px;
cursor: pointer;
transition: opacity 0.2s;
outline: none;
/* position: relative; */

  position: absolute;
  top: 21.3%;
  left: 70.3%;
  width: 13.4%;
  height: 12.3%;
text-emphasis-color: #4cd2ff;
}
.button-text{
  color: #4cd2ff;
}
.primary-btn::before {
position: absolute;
top: 50%;
left: 50%;
width: 100%;
height: 100%;
background-color: #000;
border: inherit;
/* border-color: #000; */
border-radius: inherit;
transform: translate(-50%, -50%);
opacity: 0;
content: ' ';
}

.primary-btn:active::before {

opacity: 0.1;

}
.test{
  position: absolute;
  top: 53.3%;
  left: 59.4%;
  width: 12%;
  height: 12%;
}
#gif{
  position: absolute;
  top: 56.6%;
  left: 57.9%;
opacity: 1;
width:39%;
height:37%;
}
#in_gif{
  position: absolute;
  top: 48%;
  left: 53%;
  opacity: 1;
  width:47.5%;
  height:49%;

}
#loading{
  position: absolute;
  top: 70%;
  left: 75%;
  opacity: 1;
  width:5%;
}
#loading-text{
  color: #5e7d87;
  position: absolute;
  top: 60%;
  left: 68.5%;
  opacity: 1;
  width:20%;
}
#mote{
  position:absolute;
  top: 23.15%;
  left: 89.58%;
  opacity: 1;
  width:7.92%;
}
</style>