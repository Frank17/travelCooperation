import * as mock from './miniprogram_npm/mockjs/index.js'

let API_HOST = 'https://traval.com/activities/'

let DEBUG = true

const getData = function(url) {
  if (!DEBUG) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'get',
        data: {},
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(res)
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      let res = mock.mock({
        'error_code': '',
        'error_msg': '',
        'data|10': [{
          'id|+1': 1,
          'bg': "@image('960x480', '#4A7BF7','#fff','pic')",
          'status': '@integer(0, 4)',
          'address': '@ctitle(3,8)',
          'title': '@ctitle(3,8)',
          'ownerId': '@title(3,16)',
          'detail': "@cparagraph(20,100)",
          'start': '@datetime(yyyy/MM/dd)',//库存数量  
          'end': '@datetime(yyyy/MM/dd)',
          'members': '@integer(10, 1000)',
        }]
      })
      resolve(res)
    })
  }
}

export { getData }