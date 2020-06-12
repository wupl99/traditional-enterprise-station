import axios from 'axios';
import qs from 'qs';

var require = axios.create({//axios的实例对象
  baseURL: '/api/v1',
  timeout: 60000,//60秒后台无响应则超时报错
  withCredentials: true,//跨域时转发cookie信息
});

require.interceptors.request.use(function (config) {
  // Do something before request is sent
  //console.log(config,123456)

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export default require;