// 数据库模块
const mysql = require('mysql');

// 系统路径模块
const path = require('path')

// 配置文件
const config = require(process.cwd() + '/config/config.json')

// 配置连接数据库参数
const DB = mysql.createConnection({
    host: config.database.host, //URL地址
    port: config.database.port, //数据库端口
    user: config.database.user, //数据库用户名
    password: config.database.password, //数据库密码
    database: config.database.database, //连接的数据库名称
})

// 连接数据库并判断连接状态
DB.connect(err => {
    if (err != null) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
    }
})

// 向外抛出
module.exports = DB