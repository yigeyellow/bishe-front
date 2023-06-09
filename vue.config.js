const { defineConfig } = require('@vue/cli-service')
var webpack = require('webpack'); 
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    host:'localhost',//本地域名
    port:8080,//本地接口
    proxy:{
      '/base':{//本地接口后跟的
        target:'http://127.0.0.1:8000',//请求地址
        changeOrigin:true,
        pathRewrite:{  // 路径重写，
          '^/base': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
        }
      }
    },
  },
  configureWebpack:{
    plugins: [
      new webpack.ProvidePlugin({ 
        $:"jquery", 
        jQuery:"jquery", 
        "window.jQuery":"jquery" 
      }) 
    ]
  },
})
