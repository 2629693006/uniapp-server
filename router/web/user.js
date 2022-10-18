// 导入express
const express = require('express')

// 构建路由
const user = express.Router()

// 数据库
const { select, insert, update, del } = require('../../mysql/DB')

// 信息处理
const { msg, Tmsg } = require('../../message/msg')

// 令牌验证
const webRules = require(process.cwd() + '/rules/webRules')


// 加密
const bcrypt = require('bcrypt')
const Joi = require('joi')

// 用户登录
user.post('/login', (req, res) => {
    if (req.body.username.length == 0 || req.body.password.length == 0)
        return res.send(msg(400, '登录失败'))
    select({
        table: 'user',
        option: 'where username=?',
        data: [req.body.username],
        success: async(err, val) => {
            if (err !== null && !val) return res.send(msg(400, '登录失败'))
            if (val.length == 0) return res.send(msg(400, '用户不存在'))
            var bool = await bcrypt.compare(req.body.password, val[0].password)
            if (!bool) return res.send(msg(400, '账号或密码错误!'))
            var str = await bcrypt.genSalt(10)
            var token = await bcrypt.hash(req.body.username + 'ajian', str)
            var user = val[0]
            req.sessionStore.webUser = user
            req.sessionStore.webToken = token
            var webDate = {}
            for (var item in user) {
                if (item == 'password') {
                    continue
                }
                webDate[item] = user[item]
            }
            res.send(Tmsg(200, '登录成功', token, webDate))
        }
    })
})

// 获取收货地址信息
user.get('/admin/address', webRules, (req, res) => {
    console.log(req.query.userId);
    if (!req.query.userId) return res.send(msg(400, '获取数据失败'))
    select({
        table: 'address',
        option: 'where userId=? order by state desc',
        data: [req.query.userId],
        success: (err, val) => {
            val.forEach(item => {
                item.rece_address = item.rece_address.split('|')
            })
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            res.send(msg(200, '获取数据成功', val))
        }
    })
})

// 添加收货地址
user.post('/admin/address/add', webRules, (req, res) => {
    var data = req.body
    const schemaa = Joi.object({
        username: Joi.string().required().min(1).max(100),
        mobile: Joi.string().required(),
        rece_address: Joi.string().required(),
        details_address: Joi.string().required(),
        userId: Joi.number().required(),
        state: Joi.required(),
    })
    const { error } = schemaa.validate(data)
    console.log(error)
    if (error) return res.send(msg(400, '添加失败'))
    if (data.state) {
        update({
            table: 'address',
            option: 'where userId=?',
            name: `state=${!data.state}`,
            data: [data.userId],
            success: (err, val) => {
                if (err !== null && !val) return res.send(msg(400, '添加失败'))
                int()
            }
        })
    } else {
        int()
    }

    function int() {
        var arr = []
        var opt = ''
        var StrName = ''
        for (var item in data) {
            arr.push(data[item])
            opt += '?,'
            StrName += item + ','
        }
        opt = opt.slice(0, -1)
        StrName = StrName.slice(0, -1)
        insert({
            table: 'address',
            name: StrName,
            option: opt,
            data: arr,
            success: (err, val) => {
                if (err !== null && !val) return res.send(msg(400, '添加失败'))
                res.send(msg(200, '添加成功'))
            }
        })
    }
})

// 修改收货地址
user.post('/admin/address/edit', webRules, (req, res) => {
    var data = req.body
    var schema = Joi.object({
        username: Joi.string().required(),
        userId: Joi.number().required(),
        mobile: Joi.string().required(),
        rece_address: Joi.string().required(),
        id: Joi.number().required(),
        details_address: Joi.string().required(),
        state: Joi.required()
    })
    const { error } = schema.validate(data)
    if (error) return res.send(400, '更新失败')
    if (data.state) {
        update({
            table: 'address',
            option: 'where userId=?',
            name: `state=${!data.state}`,
            data: [data.userId],
            success: (err, val) => {
                if (err !== null && !val) return res.send(msg(400, '更新失败'))
                edit()
            }
        })
    } else {
        edit()
    }

    function edit() {
        update({
            table: 'address',
            name: `state=${data.state},username=?,mobile=?,rece_address=?,details_address=?`,
            option: 'where id=? and userId=?',
            data: [data.username, data.mobile, data.rece_address, data.details_address, data.id, data.userId],
            success: (err, val) => {
                if (err !== null && !val) return res.send(msg(400, '更新失败'))
                res.send(msg(200, '更新成功'))
            }
        })
    }
})

// 设置收货地址默认状态
user.post('/admin/address/state', webRules, (req, res) => {
    console.log(req.body);
    const schema = Joi.object({
        id: Joi.number().required(),
        userId: Joi.number().required(),
        state: Joi.number().required()
    })
    const { error } = schema.validate(req.body)
    if (error) return res.send(msg(400, '设置失败'))
    update({
        table: 'address',
        name: `state=${false}`,
        option: 'where userId=?',
        data: [req.body.userId],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '设置失败'))
            update({
                table: 'address',
                name: `state=${true}`,
                option: 'where userId=? and id=?',
                data: [req.body.userId, req.body.id],
                success: (err, val) => {
                    if (err !== null && !val) return res.send(msg(400, '设置失败'))
                    res.send(msg(201, '设置成功'))
                }
            })
        }
    })
})

// 删除收货地址
user.post('/admin/address/del', webRules, (req, res) => {
    if (!req.body.id || !req.body.userId) return res.send(msg(400, '删除失败'))
    del({
        table: 'address',
        option: 'where id=? and userId=?',
        data: [req.body.id, req.body.userId],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '删除失败'))
            return res.send(msg(200, '删除成功'))
        }
    })
})

// 获取默认收货地址
user.get('/admin/address/default', webRules, (req, res) => {
    if (!req.query.userId) return res.send(msg(400, '获取数据失败'))
    select({
        table: 'address',
        option: 'where userId=? and state=?',
        data: [req.query.userId, 1],
        success: (err, val) => {
            if (err !== null && !val) return res.send(msg(400, '获取数据失败'))
            val.forEach(item => {
                item.rece_address = item.rece_address.split('|')

            })
            res.send(msg(200, '获取数据成功', val))
        }
    })
})


module.exports = user