# AirLog

[![NPM version](https://img.shields.io/npm/v/airlog.svg?style=flat-square)](https://npmjs.com/package/airlog) 
[![NPM downloads](https://img.shields.io/npm/dm/airlog.svg?style=flat-square)](https://npmjs.com/package/airlog)

基于 WebSocket 和 Vue 的前端远程实时 LOG 工具，适用于手机调试和远程调试

- 远程实时查看和筛选 LOG 信息
- 查看网页性能信息
- 可将 LOG 导出为 JSON 格式的文件

![](http://7xq3d5.com1.z0.glb.clouddn.com/airlog-2.png?imageView2/2/w/600)

## Install

```
npm install airlog
```

## Run

### Server

启动 airlog server , 可自定义端口号，默认为 3000

```
cd node_modules/airlog
node airlog-server.js 3000
```
![](http://7xq3d5.com1.z0.glb.clouddn.com/airlog-2-server.png?imageView2/2/w/600)

### Client


根据提示信息添加 script 标签，你可以配置 al-level , 默认为 default ,当设置为 error 时，将只打印错误信息

```
<script id="airlog" al-level="default" src="//{your_host}:{your_port}/airlog-client.js"></script>
```

打开你配置的地址，如 [localhost:3000](localhost:3000) 查看 LOG 信息。


