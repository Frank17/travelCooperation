// pages/myattend/myattend.js
import { getMyPublishedActivities } from '../../api.js'
import { server, post, getRequest, getOpenId } from '../../utils/util.js'
import _ from '../../miniprogram_npm/lodash/index.js'
import moment from '../../miniprogram_npm/moment/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getOpenId()
      .then(openid => {
        getRequest(`${server}/activities/detail/${openid}`)
          .then(res => {
            console.log(res)
            if (200 === res.statusCode && res.data.status) {
              let { data } = res
              let activities = _.orderBy(data.param, ['status'], ['desc'])
              _.each(activities, item => {
                item.start = moment(item.start).format('YYYY/MM/DD HH:mm')
                item.end = moment(item.end).format('YYYY/MM/DD HH:mm')
                item.createDate = moment(item.createDate).format('YYYY/MM/DD HH:mm')
              })
              this.setData({
                activities: activities
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(console.log)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})