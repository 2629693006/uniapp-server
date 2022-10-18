// 框架模块
const express = require('express')

// 路由实例化
const user = express.Router()

// 数据验证模块
const Joi = require('joi')

// 令牌验证
const rules = require(process.cwd() + '/rules/rules')

//bcrypt
const bcrypt = require('bcrypt')

// DB
const { insert, select, del, update } = require(process.cwd() + '/mysql/DB')

// 信息处理
const { msg } = require(process.cwd() + '/message/msg')

// 注册用户信息
user.post('/register', async(req, res) => {
    // 数据验证
    const schema = Joi.object({
        username: Joi.string().required().min(2).max(24),
        password: Joi.string().required().min(6).max(26)
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(422).send(error.details[0])
    }
    // inset
    insert('user', req.body, async data => {
        if (data == null) {
            res.send(msg(201, '注册成功'))
        } else {
            res.send(msg(400, '注册失败'))
        }
    })
})

// 登录
user.post('/login', (req, res) => {
    // 数据验证
    const schema = Joi.object({
        username: Joi.string().required().min(2).max(24),
        password: Joi.string().required().min(6).max(26)
    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(422).send(error.details[0])
    }
    select({
        table: 'user',
        name: '*',
        option: 'where username=?',
        data: [req.body.username],
        success: async function(err, val) {
            if (val == '') {
                return res.send(msg(400, '用户不存在!'))
            }
            if (val[0].state != '1') return res.send(msg(400, '当前账号已被禁用，有需要即可联系管理员：2629693006'))
                // 匹配
            const bool = await bcrypt.compare(req.body.password, val[0].password)
            if (!bool) {
                return res.send(msg(400, '账号或密码错误!'))
            }
            // 定义登录token
            const Salt = await bcrypt.genSalt(10)
            const token = await bcrypt.hash('15278548406', Salt)
                // 存储session
            req.sessionStore.user = val
            req.sessionStore.token = token
            var user = {}
            var obj = val[0]
            for (var item in obj) {
                if (item !== 'password') {
                    user[item] = obj[item]
                }
            }
            res.send({ status: 200, data: user, msg: '登录成功', token })
        }
    })
})

// 用户列表信息
user.get('/user', rules, (req, res) => {
    // 相关数据项
    var params = req.query
    params.pagesize = params.pagesize || 10
    params.pagenum = params.pagenum || 1
    var num = params.pagesize * (params.pagenum - 1)
    var Total = 0
    select({
        table: 'user',
        success: (err, val) => {
            if (err !== null && !val) {
                return res.send(msg(400, '获取失败'))
            }
            Total = val.length
        }
    })
    select({
        table: 'user',
        name: '*',
        option: 'order by create_time desc limit ?,?',
        data: [num, Number(params.pagesize)],
        success: (err, val) => {
            console.log(err);
            console.log(val);
            if (err !== null && !val) {
                return res.send({ status: 400, msg: '获取失败', data: null })
            }
            res.send({ status: 200, msg: '获取成功', data: val, total: Total })
        }
    })
})

// 退出登录
user.delete('/back', (req, res) => {
    req.sessionStore.user = null
    if (req.sessionStore.user == null) {
        res.send(msg(200, '退出成功'))
    }
})

// 删除用户
user.delete('/del', rules, (req, res) => {
    if (req.query.id == null) {
        return res.send(msg(400, '删除失败'))
    }
    del({
        table: 'user',
        name: '*',
        data: [req.query.id],
        option: 'where id=?',
        success: (err, val) => {
            if (err !== null && !val) {
                return res.send(msg(400, '删除失败'))
            }
            res.send(msg(200, '删除成功'))
        }
    })
})

// 修改用户数据
user.put('/user/edit', rules, (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required().min(2).max(24),
        id: Joi.number().required(),
        userId: Joi.number().required().error(new Error('请求失败'))

    })
    const { error } = schema.validate(req.body)
    if (error) {
        return res.send(msg(400, error.details[0]))
    }
    select({
        table: 'user',
        data: [req.body.username],
        option: 'where username=?',
        success: (err, val) => {
            if (val[0]) {
                return res.send(msg(400, '用户名已存在'))
            }
            update({
                table: 'user',
                data: [req.body.username, req.body.id],
                name: 'username=?',
                option: 'where id=?',
                success: (err, val) => {
                    if (err !== null && !val) {
                        return res.send(msg(400, '更新失败'))
                    }
                    res.send(msg(200, '更新成功'))
                }
            })
        }
    })

})

// 添加用户
user.post('/user/add', rules, (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required().min(2).max(24).error(new Error('请求失败')),
        password: Joi.string().required().min(6).max(26).error(new Error('请求失败')),
        userId: Joi.number().required().error(new Error('请求失败'))
    })
    const { error } = schema.validate(req.body)
    console.log(error);
    if (error) {
        return res.send(msg(400, error.message))
    }
    select({
        table: 'user',
        option: 'where username=?',
        data: [req.body.username],
        success: async(err, val) => {
            if (val[0]) {
                return res.send(msg(400, '用户名已存在'))
            }
            // 加密
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
            insert({
                table: 'user',
                name: 'username,password',
                option: '?,?',
                data: [req.body.username, req.body.password],
                success: (err, val) => {
                    console.log(err);
                    if (err !== null && !val) {
                        res.send(msg(400, '添加失败'))
                    }
                    res.send(msg(201, '添加成功'))
                }
            })
        }
    })
})


// 向外导出
module.exports = user