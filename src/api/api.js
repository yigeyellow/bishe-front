import axiosInstance from './index'

// var backendUrl = '106.15.170.138' //远程的后端服务器
const backendUrl = 'localhost'; //远程的后端服务器

const axios = axiosInstance

export const getBooks = () => {
  return axios.get('http://' + backendUrl + ':8000/api/books/')
}

export const postBook = (bookName, bookAuthor) => {
  return axios.post('http://' + backendUrl + ':8000/api/books/', {'name': bookName, 'author': bookAuthor})
}

export const getTest = () => {
    // return axios.get('http://' + backendUrl + ':8080/requesttest/t1/').then(
    return axios.get('/requesttest/t1/').then(
      (response) => {
        console.log("axios.get('/requesttest/t1/').then response.data:",response.data);
        return response
      }
    )
  }

export const postTargetYear = (year) => {
  // return axios.post('http://' + backendUrl + ':8000/requesttest/year/', {'year': year}).then(
  return axios.post('/requesttest/year/', {'year': year}).then(
    (response) => {
      try {
        return response.data;
      } catch (e) {
        window.console.log(e);
      }
    }
  )
}
// 没用上，用了$.ajax
// 这种使用axios的方式应该是错的
// 记录在这里是因为aboutView.vue中用了，但是应该错了
export const postFile = (formData) => {
  return axios({
    method: 'post',
    url: '/api/fileUpload/upload/',
    withCredentials: true,      // 如果发送请求的时候需要带上token 验证之类的也可以写在这个对象里
    headers: {
      'Content-Type':'multipart/form-data'
    }
  }, formData).then(res=>{
    if(res.data.code === 200) {
      alert(res.data.msg)
      return res.data;
    }else if(res.data.code === 2) {
      alert(res.data.msg)
    }else{
      alert(res.data.code)
      alert(res.data.msg);
    }
    return res.data;
  })

}

export const runDance = (time_begin, time_end) => {
  return axios.post('/base/api/rundance/', {
    "time_begin":time_begin, "time_end":time_end
  }).then(res => {
    if(res.data.code === 200){
      alert("迁移成功，此次算法运行时间为：" + String(res.data.total_time.toFixed(2)) + '秒')
    }else{
      alert("迁移出错")
    }
    return res.data;
  })
}

export const downloadFile = () => {
  return axios({
    method:'get',
    url:'/base/api/download/',
  }).then(res => {
    console.log('/api/download/的responce',res)
    const fileName = 'output.gif'
    if ('download' in document.createElement('a')) { // 非IE下载
      console.log("非IE下载")
      const elink = document.createElement('a')
      console.log("elink",elink)
      elink.style.display = 'none'
      elink.href = 'http://127.0.0.1:8000/api/download'
      console.log("elink.href",elink.href)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      console.log("IE10+下载")
      navigator.msSaveBlob(blob, fileName)
    }
  })
}

