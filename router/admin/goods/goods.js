// 导入express
const express = require('express')

// 验证
const Joi = require('joi')

// 数据库操作
const { insert, select, del, update } = require('../../../mysql/DB')


// 模块化路由
const goods = express.Router()

// 令牌验证
const rules = require(process.cwd() + '/rules/rules')

// 信息处理
const { msg } = require(process.cwd() + '/message/msg')

// 添加商品
goods.post('/goods/add', (req, res) => {
    var params = req.body

    // Joi验证
    var schema = Joi.object({
        contnt: Joi.string(),
        editor_content: Joi.string(),
        goods_discount_price: Joi.number().required(),
        goods_img_arr: Joi.string().required(),
        goods_mode: Joi.string().required(),
        goods_name: Joi.string().required(),
        goods_number: Joi.number().required(),
        goods_origin: Joi.string().required(),
        goods_price: Joi.number().required(),
        goods_small_img: Joi.string().required(),
        goods_type: Joi.string().required(),
        goods_weight: Joi.number().required(),
        goods_cate_id: Joi.string().required(),
        goods_cate_name: Joi.string().required(),
        goods_keyword: Joi.string().required()
    })

    // 判断控制
    const { error } = schema.validate(req.body)
    if (error) return res.send(msg(400, '添加失败'))

    // 定义变量拼接SQL语句
    var strName = ''
    var Data = []
    var ps = ''
    for (var item in params) {
        strName += item + ','
        Data.push(params[item])
        ps += '?,'
    }
    insert({
        table: 'goods',
        name: strName.slice(0, -1),
        data: Data,
        option: ps.slice(0, -1),
        success: (err, val) => {
            if (err != null && !val) {
                res.send(msg(400, '添加失败'))
            }
            res.send(msg(201, '添加成功'))
        }
    })
})

// 删除商品
goods.delete('/goods/remove', (req, res) => {
    if (!req.query.id) return res.send(msg(400, '删除失败'))
    del({
        table: 'goods',
        option: 'where id=?',
        data: [req.query.id],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '删除失败'))
            res.send(msg(200, '删除成功'))
        }
    })
})

// 获取商品数据
goods.get('/goods/list', (req, res) => {
    var pagesize = req.query.pagesize || 10
    var pagenum = req.query.pagenum || 1
    var num = pagesize * (pagenum - 1)
    var GoodsTotal = 0

    // 总数
    select({
        table: 'goods',
        success: (err, val) => {
            GoodsTotal = val.length
        }
    })

    // 分页
    select({
        table: 'goods',
        option: `order by create_time desc limit ${num},${pagesize}`,
        success: (err, val) => {
            console.log(val);
            if (err !== null && !val) return res.send(msg(400, '获取失败'))

            res.send({ status: 200, msg: '获取成功', data: val, total: GoodsTotal })
        }
    })
})

// 上架或下架
goods.post('/goods/lower', (req, res) => {
    if (!req.body.id) return res.send(msg(400, '下架失败'))
    var state = req.body.goods_state == 1 ? '0' : '1'
    update({
        table: 'goods',
        name: 'goods_state=?',
        option: 'where id=?',
        data: [state, req.body.id],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '失败'))

            // 客户端传递1的话为上架状态所有取反进行下架，反之上架
            if (state != '1') {
                res.send(msg(200, '下架成功'))
            } else {
                res.send(msg(200, '上架成功'))
            }
        }
    })
})

// 获取单个商品数据
goods.get('/goods/info', (req, res) => {
    if (!req.query.goodsId) return res.send(msg(400, '获取失败'))
    select({
        table: 'goods',
        data: [req.query.goodsId],
        option: 'where id=?',
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取失败'))
            var cate_id = val[0].goods_cate_id.split('-')
            val[0].goods_cate_id = [Number(cate_id[0]), Number(cate_id[1])]
            val[0].goods_img_arr = val[0].goods_img_arr.split(',')
            val[0].goods_type = val[0].goods_type.split('|')
            val[0].goods_keyword = val[0].goods_keyword.split('-')
            res.send(msg(200, '获取成功', val[0]))
        }
    })
})

// 修改商品
goods.put('/goods/edit', (req, res) => {
    var params = req.body

    // Joi验证
    var schema = Joi.object({
        contnt: Joi.string(),
        editor_content: Joi.string(),
        goods_discount_price: Joi.number().required(),
        goods_img_arr: Joi.string().required(),
        goods_mode: Joi.string().required(),
        goods_name: Joi.string().required(),
        goods_number: Joi.number().required(),
        goods_origin: Joi.string().required(),
        goods_price: Joi.number().required(),
        goods_small_img: Joi.string().required(),
        goods_type: Joi.string().required(),
        goods_weight: Joi.number().required(),
        goods_cate_id: Joi.string().required(),
        goods_cate_name: Joi.string().required(),
        goods_keyword: Joi.string().required(),
        goods_id: Joi.number().required()
    })

    // 判断控制
    const { error } = schema.validate(req.body)
    if (error) return res.send(msg(400, '修改失败'))

    // 定义变量拼接SQL语句
    var strName = ''
    var Data = []
    var ps = ''
    for (var item in params) {
        if (item == 'goods_id') {
            continue
        }
        strName += item + '=?,'
        Data.push(params[item])
        ps += '?,'
    }
    Data.push(req.body.goods_id)
    update({
        table: 'goods',
        name: strName.slice(0, -1),
        data: Data,
        option: `where id=?`,
        success: (err, val) => {
            console.log(err);
            if (err != null && !val) {
                res.send(msg(400, '添加失败'))
            }
            res.send(msg(201, '添加成功'))
        }
    })
})

// 商品搜索
goods.post('/goods/search', (req, res) => {
    var text = req.body.text
    var pagesize = req.body.pagesize || 10
    var pagenum = req.body.pagenum || 1
    var num = pagesize * (pagenum - 1)
    var SearchTotal = 0

    // 搜索条件
    if (!text) return res.send(msg(400, '请输入搜索关键字'))

    // 统计搜索数据总数
    select({
        table: 'goods',
        option: `where goods_name like "%${text}%" or goods_cate_name like "%${text}%"`,
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '查询失败'))
            SearchTotal = val.length
        }
    })

    // 分页搜索数据
    select({
        table: 'goods',
        option: `where goods_name like "%${text}%" or goods_cate_name like "%${text}%" order by create_time desc limit ?,?`,
        data: [num, pagesize],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '查询失败'))
            res.send({ status: 200, msg: '查询成功', data: val, total: SearchTotal })
        }
    })
})

// 添加焦点图
goods.post('/swi/add', (req, res) => {
    var { goods_id, goods_name, swi_img } = req.body
    if (!goods_id || !goods_name || !swi_img)
        return res.send(msg(400, '添加失败'))
    insert({
        table: 'swi',
        name: 'goods_id,goods_name,swi_img',
        option: '?,?,?',
        data: [goods_id, goods_name, swi_img],
        success: (err, val) => {
            if (err !== null || !val) return res.send(400, '添加失败')
            res.send(msg(201, '添加成功'))
        }
    })
})

// 获取轮播图数据
goods.get('/swi/list', (req, res) => {
    select({
        table: 'swi',
        option: 'order by create_time desc',
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取数据成功', val))
        }
    })
})

// 获取商品数据(焦点图)
goods.get('/relation/goods/list', (req, res) => {
    select({
        table: 'goods',
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取数据成功', val))
        }
    })
})

// 删除轮播图
goods.delete('/swi/remove', (req, res) => {
    if (!req.query.id) return res.send(msg(400, '删除失败'))
    del({
        table: 'swi',
        option: 'where id=?',
        data: [req.query.id],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '删除失败'))
            res.send(msg(200, '删除成功'))
        }
    })
})

// 获取焦点图编辑数据
goods.get('/swi/info', (req, res) => {
    if (!req.query.id) return res.send(msg(400, '获取数据失败'))
    select({
        table: 'swi',
        option: 'where id=?',
        data: [req.query.id],
        success: (err, val) => {
            if (err !== null || !val) return res.send(400, '获取数据失败')
            res.send(msg(200, '获取数据成功', val[0]))
        }
    })
})

// 提交焦点图信息
goods.put('/swi/edit', (req, res) => {
    var { goods_name, goods_id, id, swi_img } = req.body
    if (!goods_name || !swi_img || !goods_id || !id) return res.send(msg(400, '更新失败'))
        // 编辑
    update({
        table: 'swi',
        name: 'goods_name=?,goods_id=?,swi_img=?',
        option: 'where id=?',
        data: [goods_name, goods_id, swi_img, id],
        success: (err, val) => {
            if (err !== null || !val) return res.end(msg(400, '更新失败'))
            res.send(msg(200, '更新成功'))
        }
    })
})

// 向外导出
module.exports = goods