function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatObjectTime(object, fields){
    console.log(fields)
    for (var index in fields){
        var field = fields[index]
        var date = new Date(object[field])
        object[field] = formatTime(date)
    }
    return object
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatObjectTime: formatObjectTime
}
