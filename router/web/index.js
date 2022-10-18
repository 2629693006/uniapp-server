// 导入express
const express = require('express')

// 数据库
const { select } = require('../../mysql/DB')

// 信息处理
const { msg } = require('../../message/msg')
const { number } = require('joi')

// 构建实例化路由
const index = express.Router()

// 获取焦点图数据
index.get('/swi', (req, res) => {
    select({
        table: 'swi',
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取成功', val))
        }
    })
})

// 获取商品数据
index.get('/goods/like', (req, res) => {
    var pagesize = req.query.pagesize || 10
    var pagenum = req.query.pagenum || 1
    var num = pagesize * (pagenum - 1)
    var GoodsTotal = 0
    select({
        table: 'goods',
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            GoodsTotal = val.length
        }
    })
    select({
        table: 'goods',
        option: `limit ${num},${pagesize}`,
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            res.send({ status: 200, msg: '获取数据成功', data: val, total: GoodsTotal })
        }
    })
})

// 获取商品详细数据
index.get('/goods/info', (req, res) => {
    if (!req.query.id) return res.send(msg(400, '获取数据失败'))
    select({
        table: 'goods',
        option: 'where id=?',
        data: [req.query.id],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            var arr = val[0].goods_img_arr.split(',')
            var ty = val[0].goods_type.split('|')
            var tyArr = []
            var swiArr = []
            arr.forEach(item => {
                var obj = {}
                obj.swi_img = item
                swiArr.push(obj)
            })
            ty.forEach(item => {
                var obj = {}
                obj.name = item
                tyArr.push(obj)
            })
            val[0].goods_img_arr = swiArr
            val[0].goods_type = tyArr
            res.send(msg(200, '获取数据成功', val[0]))
        }
    })
})

// 搜索商品
index.get('/goods/search', (req, res) => {
    console.log(req.query)
    if (!req.query.searchText) return res.send(msg(400, '搜索失败'))
        // 页面数量
    var size = Number(req.query.pagesize) || 1
        // 页码
    var num = req.query.pagenum || 1
        // 计算查询位置
    var count = size * (num - 1)
        // 记录
    var Total = 0;
    // 查询关键字总数
    select({
        table: 'goods',
        option: `where goods_name like "%${req.query.searchText}%" 
        or goods_cate_name like "%${req.query.searchText}%" 
        or goods_keyword like "%${req.query.searchText}%"`,
        success: (err, sum) => {
            if (err !== null && !sum) return res.send(400, '获取数据失败')
            Total = sum.length
        }
    })

    // 关键字查询
    select({
        table: 'goods',
        option: `where goods_name like "%${req.query.searchText}%" 
        or goods_cate_name like "%${req.query.searchText}%" 
        or goods_keyword like "%${req.query.searchText}%" limit ?,?`,
        data: [count, size],
        success: (err, val) => {
            console.log(Total);
            if (err !== null && !val) return res.send(msg(400, '搜索失败'))
            res.send(msg(200, '获取数据成功', { rows_data: val, total: Total }))
        }
    })
})

// 对外抛出
module.exports = index