// 解析上传文件中间件
var Formidable = require('formidable')
module.exports = (req, res) => {
    // new
    var Form = new Formidable.IncomingForm()

    // 开启多个文件上传
    Form.multiples = true

    // 配置文件存储目录
    Form.uploadDir = process.cwd() + '/public/upload'

    // 保留上传文件的后缀名
    Form.keepExtensions = true

    // 返回图片路径
    Form.parse(req, (err, fields, files) => {
        // 转换
        var FileMoer = []
        console.log(files.file.length);
        if (files.file.length == undefined) {
            FileMoer.push(files.file)
        } else if (files.file.length > 5) {
            return res.send({ status: 400, msg: '上传文件不能超过5个!' })
        } else {
            FileMoer = files.file
        }

        // 允许上传的格式
        var ImgType = ['image/jpeg', 'image/png', 'image/jpg']

        // 存储文件路劲
        var smallarr = []

        // 循环判断多个文件的格式和大小
        FileMoer.forEach(item => {
            // 格式
            var TyBool = ImgType.find(i => i == item.type)
            if (!TyBool) res.send({ status: 400, msg: '文件格式错误!' });
            // 计算上传文件的大小
            var size = (item.size / 1024) / 1024
            if (Math.floor(size) > 5) return res.send({ status: 400, msg: '文件大小不能超过5MB!' })
                // 路径
            smallarr.push(item.path.split('public')[1])
        })

        if (smallarr == []) return res.send({ status: 400, msg: '上传失败' })
        res.send({ status: 200, msg: '上传成功', data: smallarr })
    })
}