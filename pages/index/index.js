//index.js
//获取应用实例
import { BAR_ITEMS } from '../../resources/sortable-items.js'
import { getData } from '../../api.js'
import { getRequest, server, post, getOpenId } from '../../utils/util.js'
import { Base64 } from '../../miniprogram_npm/js-base64/index.js'
import _ from '../../miniprogram_npm/lodash/index.js'
import moment from '../../miniprogram_npm/moment/index.js'
import moment_localed from '../../miniprogram_npm/moment/zh-cn.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxSearchData: {},
    searchfocused: false,
    barItems: BAR_ITEMS,
    activities: [],
    byId: 1,
    asc: true,
    showAuth: false,
    currentPage: 1,
    pageSize: 50,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onSearchFocused(e) {
    this.setData({ searchfocused: true })
  },
  onSearchUnfocused(e) {
    this.setData({ searchfocused: false })
  },
  onSearchCanceled(e) {
    this.setData({ searchfocused: false })
  },
  onOrdered(e) {
    // 对数据进行排序
    wx.showToast({
      title: `${e.detail.byTitle}, ${e.detail.byId}, ${e.detail.asc ? '升序' : '降序'}排列`,
    })
    this.setData({
      byId: e.detail.byId,
      asc: e.detail.asc
    })
    let data = this.sortData(e.detail)
    this.setData({
      activities: data
    })
    console.log(e.detail)
  },
  sortData(param, data) {
    let { byTitle, byId, asc } = param
    data = data || this.data.activities
    if (byId === 1) {
      data = _.orderBy(data, [item => {
        return item.status
      }, item => {
        return item.createDate
      }], ['desc', asc ? 'asc' : 'desc'])
    } else if (byId === 2) {
      data = _.orderBy(data, [item => {
        return item.status
      }, item => {
        return item.members
      }], ['desc', asc ? 'asc' : 'desc'])
    } else if (byId === 3) {
      data = _.orderBy(data, [item => {
        return item.status
      }, item => {
        return item.address
      }], ['desc', asc ? 'asc' : 'desc'])
    }
    return data
  },
  onActivityTap(e) {
    console.log(e)
    let { detail } = e
    let detailEncoded = Base64.encode(JSON.stringify(detail))
    console.log(detailEncoded)
    wx.navigateTo({
      url: `../detail/index?detail=${detailEncoded}`,
    })
  },
  onPublishButtonTap() {
    wx.navigateTo({
      url: '../publication/publication',
    })
  },
  onRefresh() {
    getRequest(`${server}/activities/${this.data.currentPage}/${this.data.pageSize}`, null)
      .then(res => {
        let { data } = res
        if (data.status) {
          data = this.sortData({ byId: this.data.byId, asc: this.data.asc }, data.param)
          _.each(data, item => {
            // console.log(item)
            let { start, end } = item
            let starttime = moment(start)
            let endtime = moment(end)
            let days = starttime.diff(moment(), 'days')
            if (1 > days && 0 <= days) {
              item.start = starttime.format('HH:mm')
            } else {
              item.start = starttime.format('YYYY/MM/DD HH:mm')
            }
            days = moment(endtime - moment()).format('H')
            if (1 > days && 0 < days) {
              item.end = endtime.format('HH:mm')
            } else {
              item.end = endtime.format('YYYY/MM/DD HH:mm')
            }
            let createdtime = moment(item.createDate)
            let day_diff = createdtime.diff(moment(), 'days')
            if (0 > day_diff) {
              day_diff = -day_diff
            }
            if (day_diff > 3) {
              item.createDataFormatted = createdtime.format('YYYY/MM/DD') + ' 发布'
            } else {
              item.createDataFormatted = createdtime.locale('zh-cn').fromNow() + ' 发布'
            }
            // item.createDate = moment(item.createDate).format('YYYY/MM/DD HH:mm')
            // console.log(Number.parseInt(days))
          })
          this.setData({
            activities: data
          })
        }

        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },
  onLoad: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          
        } else {
          this.setData({
            showAuth: true,
          })
        }
      }
    })
    this.onRefresh()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // 更新用户信息
        getOpenId()
        .then(openid => {
          console.log(openid)
          post(`${server}/user/update/${openid}/`, {
            nickname: res.userInfo.nickName,
            face: res.userInfo.avatarUrl
          }).then(updateRes => {
            console.log(updateRes)
          })
          .catch(err => {

          })
        })
        .catch(err => {

        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      showAuth: false
    })

  }
})
