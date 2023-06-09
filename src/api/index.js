import Vue from 'vue'
import Axios from 'axios'

const axiosInstance = Axios.create({
  withCredentials: true
})

// 通过拦截器处理csrf问题，这里的正则和匹配下标可能需要根据实际情况小改动
axiosInstance.interceptors.request.use((config) => {
  return config
})

axiosInstance.interceptors.response.use(
  response => {
    console.log('axio response is:',response)
    return response
  },
  error => {
    console.log('axio response error is:',error)
    return Promise.reject(error)
  }
)

Vue.prototype.axios = axiosInstance

export default axiosInstance
