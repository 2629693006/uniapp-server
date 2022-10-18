const express = require('express')

const order = express.Router()

// 验证
const Joi = require('joi')

// 数据库操作
const { insert, select, del, update } = require('../../../mysql/DB')
    // 令牌验证
const rules = require(process.cwd() + '/rules/rules')

// 信息处理
const { msg } = require(process.cwd() + '/message/msg')

// 获取订单数据
order.get('/order/list', (req, res) => {
    if (!req.query.userId) return res.send(msg(400, '获取数据失败'))
    var size = req.query.pagesize || 10
    var num = req.query.pagenum || 1
    var Sum = size * (num - 1)
    var Total = 0;
    select({
        table: 'order_info',
        name: 'count(*) as total',
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            Total = val[0].total
        }
    })
    select({
        table: 'order_info',
        option: `order by create_time desc limit ${Sum},${size}`,
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取数据成功', { rows_data: val, total: Total }))
        }
    })
})

// 删除订单数据
order.delete('/order/remove', (req, res) => {
    if (!req.body.userId && !req.body.order_num) return res.send(msg(400, '删除失败'))
    del({
        table: 'order_info',
        option: 'where order_num=?',
        data: [req.body.order_num],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '删除失败'))
            del({
                table: 'order_item',
                option: 'where order_num=?',
                data: [req.body.order_num],
                success: (err, val) => {
                    if (err !== null || !val) return res.send(msg(400, '删除失败'))
                    res.send(msg(200, '删除成功'))
                }
            })
        }
    })
})


// 获取订单详情信息
order.get('/order/info', (req, res) => {
    if (!req.query.userId || !req.query.order_num) return res.send(msg(400, '获取数据失败'))
    var data = {}
        // 查询订单数据
    select({
        table: 'order_info',
        option: 'where order_num=?',
        data: [req.query.order_num],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            data['rows_order'] = val[0]
                // 查询完毕调用函数查询订单相关地址
            address(val[0].address_id)
        }
    })
    var str = `
    t1.id,
    t1.order_num,
    t1.goods_id,
    t1.quantity,
    t1.create_time,
    t1.goods_type,
    t2.goods_name,
    t2.goods_discount_price,
    t2.goods_small_img
    `;
    var sql = `left join goods as t2 on t1.goods_id=t2.id where t1.order_num=?`

    // 查询订单商品
    select({
        table: 'order_item as t1',
        name: str,
        option: sql,
        data: [req.query.order_num],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            data['children'] = val

        }
    })

    function address(id) {
        // 查询订单地址
        select({
            table: 'address',
            option: 'where id=?',
            data: [id],
            success: (err, val) => {
                if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
                val[0].rece_address = val[0].rece_address.split('|')
                data['address'] = val[0]
                    // 响应
                res.send(msg(200, '获取数据成功', data))
            }
        })
    }

})

// 设置发货
order.put('/order/deliver', (req, res) => {
    if (!req.body.userId || !req.body.order_num) return res.send(msg(400, '更新失败'))
    update({
        table: 'order_info',
        name: 'order_not_shipped_state=?',
        option: 'where order_num=?',
        data: [1, req.body.order_num],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '更新失败'))
            res.send(msg(201, '更新成功'))
        }
    })
})

// 订单搜索
order.get('/order/search', (req, res) => {
    var { userId, pagenum, pagesize, order_num } = req.query
    if (!userId || !order_num) return res.send(msg(400, '搜索失败'))
    var size = pagesize || 10
    var num = pagenum || 1
    var Sum = size * (num - 1)
    var Total = 0
    select({
        table: 'order_info',
        name: 'count(*) as total',
        option: `where order_num like "%${order_num}%"`,
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            Total = val[0].total
        }
    })
    select({
        table: 'order_info',
        option: `where order_num like "%${order_num}%" limit ${Sum},${size}`,
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '搜索成功', { rows_data: val, total: Total }))
        }
    })
})


module.exports = order