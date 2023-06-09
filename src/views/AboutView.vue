<template>
  <div class="about">
    
    <div class="upload">
      <form class="form-horizontal" id="uploadForm" method="post" action="" enctype="multipart/form-data">
        <input type="file" id="file3"  name="file" multiple='' accept=".mp4"/>
        <input type="button" value="上传" id="submit" @click="check()">
      </form>
      <button @click="test()">test</button>
<!-- 以上为https://blog.csdn.net/CloseMountain/article/details/82458620 -->

    <button @click="rundance()">开始运行</button>
    <a href="http://127.0.0.1:8000/api/download">下载</a>
    <button @click="download()">下载文件</button>
    <!-- <button @click="myshow()">显示</button> -->
    <div class="show">
      <img 
        id="gif"
        style="display:block;width:400px;height:200px;"
      />
    </div>


    <form accept-charset="UTF-8" action="/api/api/fileUpload/upload/" method="post" enctype="multipart/form-data">
        <div>
          <input type="file" name="file" accept=".doc,.docx,.txt">
          <input type="submit" value="登录">
        </div>
      </form>



        <form enctype="multipart/form-data">
            {{ name }}
            <br><br>
            <input type="file" value="" id="file"  accept=".doc,.docx,.txt" @change="getFile($event)">
            <button @click="submitForm($event)">提交</button>
            <br>
            {{ checkStatus }}
        </form>
    </div>
    <!-- <app-head/> -->
    <!-- 显示视频流 -->
    <!-- <img src="http://127.0.0.1:8000/api/cv/display"> -->
    <h1>This is an about page</h1>
    <h1>{{ responseData }}</h1>
    <button @click="changeresponseData()">responseData</button>

    <div>{{ book }}</div>
    <div v-bind:value="book"></div>
    <input type="text" v-model="book">
  </div>
</template>

<script>
import {getTest,postTargetYear,postFile,downloadFile,runDance} from "../api/api";
function check() {
	//mp4   3gp    mov
	var doc = document.getElementById('file');
	for(var i=0;i<doc.files.length;i++){
		var name = doc.files[i].name;
		var hz = name.substring(name.lastIndexOf(".")+1);
		if(hz!="mp4" && hz!="3gp" && hz!="mov" && hz!="MP4" && hz!="3GP" && hz!="MOV"){
			$.messager.alert("错误信息","请上传mp4、3gp、mov视频格式！！",'error');
			return false;
		}
	}
	upload();	
}
 
function upload(){
	 var formData = new FormData($('#uploadForm')[0]);
     $.ajax({
          type: 'post',
          // url: "<%=path%>/shipin/ftpupload.do",
          url: "/api/api/fileUpload/upload/",
          data: formData,
          cache: false,       //是否在缓存中读取数据的读取
          processData: false, //用于对data参数进行序列化处理
          contentType: false, //发送信息至服务器时内容编码类型,上传文件时设置为false
     }).then(function (data) {
      console.log(data)
      console.log(data.msg)
    	 if(data.msg=='Success'){
    		 alert("上传成功！");
    	 }else if(data==1){
    		 $.messager.alert("错误信息","上传失败！",'error',function(){});
    	 }else{ 		
    		 $.messager.alert("错误信息","请选择需要上传的文件！",'error',function(){});   		
    	 }    	
     });
}			

export default{
  name:'AboutView',
  data(){
    return{
      book:1,
      responseData:`123`,
      year:0,
      // fileupload
      name: "上传文件",
      checkStatus: "",
    }
  },
  methods:{
    rundance(){
      runDance()
    },
    download(){
      downloadFile()
    },
    check() {
      //mp4   3gp    mov
      var doc = document.getElementById('file3');
      for(var i=0;i<doc.files.length;i++){
        var name = doc.files[i].name;
        var hz = name.substring(name.lastIndexOf(".")+1);
        if(hz!="mp4" && hz!="3gp" && hz!="mov" && hz!="MP4" && hz!="3GP" && hz!="MOV"){
          $.messager.alert("错误信息","请上传mp4、3gp、mov视频格式！！",'error');
          return false;
        }
      }
      upload();	
    },
    
    upload(){
      var formData = new FormData($('#uploadForm')[0]);
        $.ajax({
            type: 'post',
            // /api/api/fileUpload/upload/
            // url: "<%=path%>/shipin/ftpupload.do",
            url: "/api/api/fileUpload/upload/",
            data: formData,
            cache: false,       //是否在缓存中读取数据的读取
            processData: false, //用于对data参数进行序列化处理
            contentType: false, //发送信息至服务器时内容编码类型,上传文件时设置为false
        }).success(function (data) {
          if(data==0){
            $.messager.alert("提示信息","上传成功！",'info',function(){});
          }else if(data==1){
            $.messager.alert("错误信息","上传失败！",'error',function(){});
          }else{ 		
            $.messager.alert("错误信息","请选择需要上传的文件！",'error',function(){});   		
          }    	
        });
    }	,		
    // 以上为新的,要导入jquery
    changeresponseData(){
      console.log('changeresponseData()')
      // getTest().then(response => {
      //   this.responseData = response.data
      //   console.log('response:',response)
      // })
      postTargetYear(1949).then(response => {
        console.log('postTargetYear response.data:',response)
      })
    },
    // fileupload
    getFile(event) {
      this.file = event.target.files[0],
      console.log("this.file",this.file)

      let formData = new FormData();
      formData.append('file', this.file);
      console.log("formData",formData)
      console.log(formData.get('file'))
    },
    submitForm(event) {
      let formData = new FormData();
      formData.append('file', this.file);
      console.log("formData",formData)
      this.checkStatus = postFile(formData)
    },
  },
  mounted() {
    this.responseData = getTest();
  }
}
// Promise 形式实现
// resolve 解决  函数类型的数据
// reject 拒绝  函数类型的数据
// const p = new Promise((resolve,reject) => {
//     setTimeout(() => {
//         //获取1-100的一个随机数
//         let n  = Math.round(Math.random()*100);
//         console.log(n)
//         //判断
//         if(n <= 30){
//             resolve(n) // 将 promise 对象的状态设置为 【成功】
//         }else{
//             reject(n) // 将 promise 对象的状态设置为 【失败】
//         }
//     },100)
// })

//调用then 方法
// p.then((value) => {
//     console.log(value)
//     alert('恭喜你中奖了！中奖数字为：{{value}}','str(value)')
// },(reason) => {
//     console.log(reason)
//     alert('再接再厉，您的数字为：','str(reason)')
// })
</script>
