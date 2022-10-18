module.exports = async(req, res, next) => {
    // 后台令牌验证
    var strToken = '"' + req.sessionStore.token + '"'
    if (req.headers.authorization == strToken) {
        next()
    } else {
        res.status(200).send({ status: 400, msg: '请先登录!', data: null })
    }
}