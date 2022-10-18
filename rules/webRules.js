module.exports = async(req, res, next) => {
    // 客户端令牌验证
    var strToken = req.sessionStore.webToken
    if (req.headers.authorization == strToken) {
        next()
    } else {
        res.status(200).send({ status: 400, msg: '请先登录!', data: null })
    }
    // next()
}