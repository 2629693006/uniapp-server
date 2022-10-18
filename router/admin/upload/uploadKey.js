// 导入处理文件中间件
const Formidable = require('formidable')
module.exports = (req, res) => {
    //new实例
    var File = new Formidable.IncomingForm()

    // 配置文件存储地址
    File.uploadDir = process.cwd() + '/public/upload'

    // 保留上传文件后缀
    File.keepExtensions = true

    // 返回数据
    File.parse(req, (err, fields, files) => {
        // 控制文件上传类型
        var ImgType = ['image/jpeg', 'image/png', 'image/jpg']
        var TyBool = ImgType.find(item => item == files.file.type)
        if (!TyBool) res.send({ status: 400, msg: '文件格式错误!' });

        // 计算上传文件的大小
        var size = (files.file.size / 1024) / 1024
        if (Math.floor(size) > 5) return res.send({ status: 400, msg: '文件大小不能超过5MB!' })

        // 截取文件路径返回
        var path = {
            goods_small_img: files.file.path.split('public')[1]
        }
        res.send({ status: 200, msg: '上传成功', data: path })
    })
}