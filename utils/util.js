let __DEBUG__ = true

const getServer = () => {
  if (__DEBUG__) {
    return 'http://139.224.117.148:8000'
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
      header: 'application/json',
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

const saveStorage = (key, value) => {
  return new Promise((resolve, reject) => {
      wx.setStorage({
      key: key,
      data: value,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
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
    console.log('logined: ')
    console.log(status)
  })
  .catch(status => {
    
    wx.login({
      success(res) {
        // console.log(res)
        let { code } = res
        console.log('code：' + code)
        post(`${getServer()}/user/login/${code}`)
        .then(loginResult => {
          console.log(loginResult)
          // saveStorage('loginKey', )
          if (200 === loginResult.statusCode && loginResult.data.status) {
            saveStorage('loginKey', loginResult.data.param)
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  })
}

const getOpenId = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'loginKey',
      success: function(res) {
        resolve(res.data.openid)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

const getSessionKey = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'loginKey',
      success: function (res) {
        resovle(res.session_key)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  login: login,
  post: post,
  getRequest: getRequest,
  getOpenId: getOpenId,
  getSession: getSessionKey,
  saveStorage: saveStorage,
  server: getServer()
}
