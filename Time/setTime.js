module.exports = {
    // 完整日期
    TimeDate: () => {
        var time = new Date()
        var y = time.getFullYear()
        var m = ((time.getMonth() + 1) + '').padStart(2, 0)
        var d = (time.getDate() + '').padStart(2, 0)
        var h = (time.getHours() + '').padStart(2, 0)
        var f = (time.getMinutes() + '').padStart(2, 0)
        var sec = (time.getSeconds() + '').padStart(2, 0)
        var msec = time.getMilliseconds()
        return `${y}-${m}-${d} ${h}:${f}:${sec}`
    },
    // 年月日
    Time: () => {
        var time = new Date()
        var y = time.getFullYear()
        var m = (time.getMonth() + 1 + '').padStart(2, 0)
        var d = (time.getDate() + '').padStart(2, 0)
        return `${y}-${m}-${d}`
    }
}