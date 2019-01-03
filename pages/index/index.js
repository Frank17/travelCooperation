//index.js
//获取应用实例
import { BAR_ITEMS } from '../../resources/sortable-items.js'
import { getData } from '../../api.js'
import { Base64 } from '../../miniprogram_npm/js-base64/index.js'
// import * as _ from '../../miniprogram_npm/lodash/index.js'
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxSearchData: {},
    searchfocused: false,
    barItems: BAR_ITEMS,
    activities: [],
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
  onLoad: function () {
    getData('https://traval.com/activities/')
      .then(res => {
        this.setData({
          activities: res.data
        })
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
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
      hasUserInfo: true
    })
  }
})
