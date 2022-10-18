// 数据库
const DB = require(process.cwd() + '/mysql/serve')

// 日期格式化
const { TimeDate } = require(process.cwd() + '/Time/setTime')

// 加密
const bcrypt = require('bcrypt')

module.exports = {
    // 添加
    insert: async function(el) {
        el.data.push(TimeDate()) //获取日期时间
        const sql = `insert into ${el.table} (${el.name},create_time) value(${el.option},?)`
        DB.query(sql, el.data, (err, res) => {
            el.success(err, res)
        })
    },
    // 删除
    del: function(el) {
        const sql = `delete from ${el.table} ${el.option}`
        DB.query(sql, el.data, (err, res) => {
            el.success(err, res)
        })
    },
    // 修改
    update: function(el) {
        const sql = `update ${el.table} set ${el.name} ${el.option}`
        console.log(sql);
        DB.query(sql, el.data, (err, res) => {
            el.success(err, res)
        })
    },
    // 查询
    select: function(el) {
        const sql = `SELECT ${el.name || '*'} FROM ${el.table} ${el.option || ''}`
        DB.query(sql, el.data, (err, res) => {
            el.success(err, res)
        })
    }
}