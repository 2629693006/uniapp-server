// 导入express
const express = require('express')

// 数据库
const { select } = require('../../mysql/DB')

// 信息处理
const { msg } = require('../../message/msg')

// 构建实例化路由
const cate = express.Router()

// 获取分类数据
cate.get('/cate', (req, res) => {
    select({
        table: 'category',
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取失败'))
            select({
                table: 'er_category',
                success: (err, erval) => {
                    if (err !== null && !erval) return res.send(msg(400, '获取失败'))
                    val.forEach(item => {
                        item.children = []
                        erval.forEach(eritem => {
                            if (item.id == eritem.one_id) {
                                item.children.push(eritem)
                            }
                        })
                    })
                    console.log(val);
                    res.send(msg(200, '获取成功', val))
                }
            })
        }
    })
})

// 获取分类商品数据
cate.get('/er/cate/goods', (req, res) => {
    if (!req.query.name) return res.send(msg(400, '获取失败'))
    select({
        table: 'goods',
        option: 'where goods_cate_name=?',
        data: [req.query.name],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取数据成功', val))
        }
    })
})

// 对外抛出
module.exports = cate