let __DEBUG__ = true

const getServer = () => {
  if (__DEBUG__) {
    return 'http://'
  } else {
    return 'http://'
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const post = (url, param) => {
  return new Promise((resolve, reject) => {
      wx.request({
      url: url,
      data: param,
      method: 'POST',
      header: 'application/json;charset=utf-8',
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(res)
      } 
    })
  })
}

const getRequest = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: param,
      method: 'GET',
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(res)
      }
    })
  })
}

const login = () => {
  let loginPromise = new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(true)
      },
      fail() {
        reject(false)
      }
    })
  })
  loginPromise.then(status => {
    console.log('logined')
  })
  .catch(status => {
    wx.login({
      success(res) {
        console.log(res)
        let { code } = res
        post(`${getServer()}/user/login/${code}`)
        .then(loginResult => {

        })
        .catch(err => {

        })
      },
      fail(err) {
        console.log(err)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  login: login,
  post: post,
  getRequest: getRequest
}
