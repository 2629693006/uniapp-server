module.exports = {
    // tisp
    msg: function(status, msg, data = null) {
        return { status: status, msg: msg, data: data }
    },
    Tmsg: function(status, msg, token = null, data = null, ) {
        return { status: status, msg: msg, data: data, token: token }
    }
}