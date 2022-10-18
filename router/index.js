// 框架模块
const express = require('express')

// 路由实例化
const router = express.Router()

// 令牌验证
const rules = require(process.cwd() + '/rules/rules')
const webRules = require(process.cwd() + '/rules/webRules')



/**
 * 后台管理
 */

// 用户路由组
const user = require('./admin/user/user')

// 商品路由组
const goods = require('./admin/goods/goods')

// 分类路由组
const cate = require('./admin/cate/cate')

// 订单路由组
const order = require('./admin/order/order')

/**
 * 用户路由组
 */
router.use('/admin', user)


/**
 * 商品路由组
 */
router.use('/admin', rules, goods)

/**
 * 分类路由组
 */
router.use('/admin', rules, cate)

/**
 * 订单路由组
 */
router.use('/admin', rules, order)

/**
 * 前端管理
 */

const Index = require('./web/index')
const Cate = require('./web/cate')
const Cart = require('./web/cart')
const User = require('./web/user')

// 主页数据
router.use('/api/v1', Index)

// 分类数据
router.use('/api/v1', Cate)

// 购物车
router.use('/api/v1/admin', webRules, Cart)

// 用户信息
router.use('/api/v1', User)








/**
 * 文件上传
 */

const Upload = require(process.cwd() + '/router/admin/upload/uploadKey')
const UploadMoer = require(process.cwd() + '/router/admin/upload/uploadMoer')

// 单个上传
router.post('/admin/upload', rules, Upload)

// 多个文件上传
router.post('/admin/upload/moer', rules, UploadMoer)

// 向外导出
module.exports = router