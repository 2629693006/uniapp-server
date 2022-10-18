// 导入express
const express = require('express')

// 数据库
const { select, insert, update, del } = require('../../mysql/DB')

// 信息处理
const { msg } = require('../../message/msg')
const Joi = require('joi')
const DB = require('../../mysql/serve')
const { init } = require('../admin/cate/cate')

// 构建实例化路由
const cart = express.Router()

// 添加购物车
cart.post('/cart/add', (req, res) => {
    const schema = Joi.object({
        goods_id: Joi.number().required(),
        quantity: Joi.required(),
        goods_type: Joi.string().required(),
        userId: Joi.number().required()
    })
    const { error } = schema.validate(req.body)
    if (error) return res.send(msg(400, '添加失败!'))
    select({
        table: 'cart',
        option: 'where goods_id=? and goods_type=?',
        data: [req.body.goods_id, req.body.goods_type],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '添加失败!'))
            if (val.length > 0) {
                var count = Number(val[0].quantity) + Number(req.body.quantity)
                update({
                    table: 'cart',
                    option: `where goods_id=? and goods_type=?`,
                    name: `quantity=?`,
                    data: [count, req.body.goods_id, req.body.goods_type],
                    success: (err, val) => {
                        if (err !== null && !val) return res.send(msg(400, '添加失败'))
                        res.send(msg(201, '添加成功'))
                    }
                })
            } else {
                insert({
                    table: 'cart',
                    name: 'goods_id,quantity,goods_type,userId',
                    option: '?,?,?,?',
                    data: [req.body.goods_id, req.body.quantity, req.body.goods_type, req.body.userId],
                    success: (err, val) => {
                        if (err !== null && !val) return res.send(msg(400, '添加失败'))
                        res.send(msg(201, '添加成功'))
                    }
                })
            }

        }
    })

})

// 获取购物车数据
cart.get('/cart/list', (req, res) => {
    if (!req.query.userId) return res.send(msg(400, '获取数据失败'))
    select({
        table: 'cart',
        option: 'where userId=?',
        data: [req.query.userId],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            select({
                table: 'goods',
                success: (err, goodsVal) => {
                    if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
                    val.forEach(item => {
                        item.children = []
                        goodsVal.forEach(goods => {
                            if (item.goods_id == goods.id) {
                                item.children.push(goods)
                            }
                        })
                    })
                    res.send(msg(200, '获取数据成功', val))
                }
            })
        }
    })
})

// 修改商品个数
cart.post('/cart/count', (req, res) => {
    if (!req.body.quantity && !req.body.id && !req.body.userId) return res.send(msg(400, '添加失败'))
    update({
        table: 'cart',
        name: 'quantity=?',
        option: 'where id=? and userId',
        data: [req.body.quantity, req.body.id],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '添加失败'))
            return res.send(msg(200, '添加成功'))
        }
    })
})

// 修改状态
cart.post('/cart/state', (req, res) => {
    if (!req.body.id && !req.body.userId) return res.send(msg(400, '选中失败'))
    select({
        table: 'cart',
        option: 'where id=? and userId=?',
        data: [req.body.id, req.body.userId],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '选中失败'))
            var num = null
            if (val[0].state == 1) {
                num = false
            } else {
                num = true
            }
            update({
                table: 'cart',
                name: 'state=?',
                option: 'where id=?',
                data: [num, req.body.id],
                success: (err, val) => {
                    if (err !== null && !val) return res.send(msg(400, '选中失败'))
                    res.send(msg(200, '选中成功'))
                }

            })
        }
    })
})

// 全选或反选
cart.post('/cart/checked', (req, res) => {
    if (!req.body.userId) return res.send(msg(400, '全选失败'))
    console.log(req.body.state);
    update({
        table: 'cart',
        option: 'where userId=?',
        name: `state=${req.body.state}`,
        data: [req.body.userId],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '全选失败'))
            res.send(msg(200, '全选成功'))
        }
    })
})

// 删除购物车
cart.post('/cart/remove', (req, res) => {
    if (!req.body.id && !req.body.userId) return res.send(msg(400, '删除失败'))
    del({
        table: 'cart',
        option: 'where id=? and userId=?',
        data: [req.body.id, req.body.userId],
        success: (err, val) => {
            if (err !== null, !val) return res.send(msg(400, '删除失败'))
            res.send(msg(200, '删除成功'))
        }
    })
})

// 提交订单
cart.post('/ply/order', (req, res) => {
    // 解构数据
    var { userId, addressId, status, state, orderData, price } = req.body
        // 控制
    if (!userId || !addressId || !orderData || !price) return res.send(msg(400, '提交订单失败'))

    // 生成单号
    var num = '';
    for (var i = 0; i <= 15; i++) {
        num += Math.floor(Math.random() * 10)
    }
    // 循环添加订单商品数据
    orderData.forEach((item) => {
        if (item.quantity == 0 || !item.goods_id) return res.send(msg(400, '提交订单失败'))
        insert({
            table: 'order_item',
            name: 'order_num,goods_id,quantity,goods_type',
            option: '?,?,?,?',
            data: [num, item.goods_id, item.quantity, item.goods_type],
            success: (err, val) => {
                console.log(err);
                console.log(val);
                if (err !== null && !val) return res.send(msg(400, '提交订单失败'))

                // 订单生成之后删除对应的购物车商品
                if (status) {
                    del({
                        table: 'cart',
                        option: 'where goods_id=? && goods_type=?',
                        data: [item.goods_id, item.goods_type],
                        success: (err, val) => {
                            if (err !== null && !val) return res.send(msg(400, '提交订单失败'))
                                // res.send(msg(200, '删除成功'))
                        }
                    })
                }
            }
        })
    })

    // 添加订单数据
    insert({
        table: 'order_info',
        name: 'order_num,order_state,order_not_shipped_state,order_pay_state,userId,address_id,price',
        option: '?,?,?,?,?,?,?',
        data: [num, 1, 0, state, userId, addressId, price],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '订单生成失败'))
            res.send(msg(201, state ? '支付成功' : '订单生成成功'))
        }
    })
})

// 获取订单数据
cart.get('/order/list', (req, res) => {
    if (!req.query.userId && !req.query.type) return res.send(msg(400, '获取数据失败'))
    var Str = ''
    var arr = [];
    switch (req.query.type) {
        case 'pay':
            Str = 'order_pay_state=?'
            arr = [0]
            break
        case 'not':
            Str = 'order_pay_state=? and order_not_shipped_state=?'
            arr = [1, 0]
            break
        case 'goods':
            Str = 'order_pay_state=? and order_not_shipped_state=? and order_received_state=?'
            arr = [1, 1, 0]
            break
    }
    select({
        table: 'order_info',
        option: `where userId=? and ${Str} order by create_time desc`,
        data: [req.query.userId, ...arr],
        success: (err, val) => {
            if (val.length == 0) return res.send(msg(200, '您没有相关订单..'))
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            val.forEach((item, index) => {
                select({
                    table: 'order_item as t1',
                    name: `t1.id,
                    t1.order_num,
                    t1.goods_id,
                    t1.quantity,
                    t1.create_time,
                    t1.goods_type,
                    t2.goods_name,
                    t2.goods_small_img,
                    t2.goods_discount_price
                    `,
                    option: `left join goods as t2 on t1.goods_id=t2.id where order_num=?`,
                    data: [item.order_num],
                    success: (err, _val) => {
                        if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
                        item['children'] = _val

                        // 调用函数传递数据
                        init(item, index)
                    }
                })
            })

            // 收集相应的数据
            var arr = []

            // 收集数据函数
            function init(dataVal, index) {
                arr.push(dataVal)
                    // 判断控制
                if (index == val.length - 1) {
                    res.send(msg(200, '获取数据成功', arr))
                }
            }
        }
    })
})

// 获取订单数量
cart.get('/order/count', (req, res) => {
    // 控制
    if (!req.query.userId) return res.send(msg(400, '获取数据失败'))
        // SQL语句拼接
    var sql = `where userId=? and order_pay_state=0`
    var str = `count(*) as order_pay_total,
    (select count(*) from order_info where userId=${req.query.userId} 
    and order_pay_state=1 and order_not_shipped_state=0) as order_not_shipped_total,
    (select count(*) from order_info where userId=${req.query.userId} and order_not_shipped_state=1 and order_received_state=0) as order_received_total
    `
        // 查询
    select({
        table: 'order_info',
        option: sql,
        name: str,
        data: [req.query.userId],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取数据成功', val[0]))
        }
    })
})

// 取消订单
cart.post('/order/del', (req, res) => {
    if (!req.body.order_num && !req.body.userId) return res.send(msg(400, '取消订单失败'))
    del({
        table: 'order_info',
        option: ' where order_num=? and userId=?',
        data: [req.body.order_num, req.body.userId],
        success: (err, val) => {
            console.log(err);
            console.log(val);
            if (err !== null && !val) return res.send(msg(400, '取消订单失败'))
            del({
                table: 'order_item',
                option: 'where order_num=?',
                data: [req.body.order_num],
                success: (err, _val) => {
                    if (err !== null && !_val) return res.send(msg(400, '取消订单失败'))
                    res.send(msg(200, '取消成功'))
                }
            })
        }
    })

})

// 未支付的订单再次进行支付
cart.post('/order/pay', (req, res) => {
    if (!req.body.userId && !req.body.order_num) return res.send(msg(400, '支付失败!'))
    update({
        table: 'order_info',
        name: 'order_pay_state=?',
        option: 'where userId=? and order_num=?',
        data: [1, req.body.userId, req.body.order_num],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '支付失败!'))
            res.send(msg(200, '支付成功'))
        }
    })
})

// 对外抛出
module.exports = cart