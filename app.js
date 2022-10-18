// 框架模块
const express = require('express')

// 路径模块
var path = require('path');

// 创建实例
const app = express()

// 配置post传递的参数
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 静态资源托管
app.use(express.static(process.cwd() + '/public'))

// 路由接口
const router = require('./router/index')

// session
const session = require('express-session')
app.use(session({
    secret: 'secret key',
    name: 'sessionId',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

// 处理跨域
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    if (req.method == 'OPTIONS') res.sendStatus(200)
        /*让options请求快速返回*/
    else next()
});

// 监听路由接口
app.use('/', router)

// 监听连接端口
app.listen(3001, function() {
    console.log('服务器连接成功');
})