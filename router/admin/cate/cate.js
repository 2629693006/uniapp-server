// 导入express
const express = require('express')
    // 验证
const Joi = require('joi')

// 数据库操作
const { insert, select, del, update } = require('../../../mysql/DB')

// 信息处理
const { msg } = require(process.cwd() + '/message/msg')

// 构建路由
const cate = express()

// 添加商品分类
cate.post('/cate/add', (req, res) => {
    var parasm = {
        cate_name: req.body.cate_name,
        userId: req.body.userId
    }
    var schema = Joi.object({
        cate_name: Joi.string().required().min(1).max(10),
        userId: Joi.number().required()
    })
    const { error } = schema.validate(parasm)
    if (error) return res.send(msg(400, '添加失败'))
    select({
        table: 'category',
        option: 'where cate_name=?',
        data: [parasm.cate_name],
        success: (err, val) => {
            if (val[0]) return res.send(msg(400, '分类已存在!'))
            insert({
                table: 'category',
                name: 'cate_name',
                data: [parasm.cate_name],
                option: '?',
                success: (err, val) => {
                    console.log(err);
                    if (err != null || !val) return res.send(msg(400, '添加失败'))
                    res.send(msg(201, '添加成功'))
                }
            })
        }
    })

})

// 添加商品二级分类
cate.post('/cate/er/add', (req, res) => {
    const schema = Joi.object({
        cate_name: Joi.string().required().min(1).max(10),
        cate_img: Joi.string().required(),
        one_id: Joi.number().required(),
        userId: Joi.number().required()
    })
    const { error } = schema.validate(req.body)
    if (error) return res.send(msg(400, '添加失败'))
    insert({
        table: 'er_category',
        name: 'cate_name,cate_img,one_id',
        option: '?,?,?',
        data: [req.body.cate_name, req.body.cate_img, req.body.one_id],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '添加失败'))
            res.send(msg(201, '添加成功'))
        }
    })
})

// 获取分类
cate.get('/cate/list', (req, res) => {
    select({
        table: 'category',
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '获取失败'))
            select({
                table: 'er_category',
                success: (err, erval) => {
                    if (err !== null || !erval) return res.send(msg(400, '获取失败'))
                    val.forEach(item => {
                        item.children = []
                        erval.forEach(eritem => {
                            if (item.id == eritem.one_id) {
                                item.children.push(eritem)
                            }
                        })
                    })
                    res.send(msg(200, '获取成功', val))
                }
            })
        }
    })
})

// 删除一级分类
cate.delete('/cate/remove', (req, res) => {
    if (!req.body.id || !req.body.userId) return res.send(msg(400, '删除失败'))
    del({
        table: 'category',
        option: 'where id=?',
        data: [req.body.id],
        success: (err, val) => {
            if (err != null || !val) return res.send(msg(400, '删除失败'))
            del({
                table: 'er_category',
                option: 'where one_id=?',
                data: [req.body.id],
                success: (err, val) => {}
            })
            res.send(msg(200, '删除成功'))
        }
    })
})

// 删除二级分类
cate.delete('/er/cate/remove', (req, res) => {
    if (!req.body.id || !req.body.userId) return res.send(msg(400, '删除失败'))
    del({
        table: 'er_category',
        option: 'where id=?',
        data: [req.body.id],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '删除失败'))
            res.send(msg(200, '删除成功'))
        }
    })
})

// 修改分类
cate.put('/cate/edit', (req, res) => {
    var params = {
        cate_name: req.body.cate_name,
        id: req.body.id,
        userId: req.body.userId
    }
    var schema = Joi.object({
        cate_name: Joi.string().required().min(1).max(10),
        id: Joi.number().required(),
        userId: Joi.number().required()
    })
    const { error } = schema.validate(params)
    if (error) return res.send(msg(400, '修改失败'))
    select({
        table: 'category',
        option: 'where cate_name=?',
        data: [params.cate_name],
        success: (err, val) => {
            if (val[0]) return res.send(msg(400, '分类已存在!'))
            update({
                table: 'category',
                name: 'cate_name=?',
                option: 'where id=?',
                data: [params.cate_name, params.id],
                success: (err, val) => {
                    if (err !== null || !val) return res.send(msg(400, '修改失败'))
                    res.send(msg(200, '修改成功'))
                }
            })
        }
    })
})

// 修改二级分类
cate.put('/er/cate/edit', (req, res) => {
    const schema = Joi.object({
        id: Joi.number().required(),
        cate_name: Joi.string().required().min(1).max(10),
        cate_img: Joi.string().required(),
        userId: Joi.number().required()
    })
    const { error } = schema.validate(req.body)
    if (error) return res.send(msg(400, '修改失败'))
    update({
        table: 'er_category',
        name: 'cate_name=?,cate_img=?',
        option: 'where id=?',
        data: [req.body.cate_name, req.body.cate_img, req.body.id],
        success: (err, val) => {
            if (err !== null || !val) return res.send(msg(400, '更新失败!'))
            return res.send(msg(200, '更新成功!'))
        }
    })
})

module.exports = cate