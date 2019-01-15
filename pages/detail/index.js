// pages/detail/index.js
import { Base64 } from '../../miniprogram_npm/js-base64/index.js'
import { getRequest, server, post, getOpenId } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: null,
    showLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = JSON.parse(Base64.decode(options.detail))
    // console.log(JSON.parse(detail))
    this.setData({
      activity: detail,
    })
    wx.setNavigationBarTitle({
      title: detail.title
    })
    getRequest(`${server}/activities/${this.data.activity.id}`)
    .then(res => {
      console.log(res.data)
      let { data } = res
      if (data.status) {
        let members = data.param.members
        let activity = this.data.activity
        activity.members = members
        this.setData({
          activity: activity
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
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

  },
  onAttendTap(e) {
    console.log(e)
    getOpenId()
    .then(openid => {
      this.setData({
        showLoading: true,
      })
      post(`${server}/activities/${openid}/${e.currentTarget.dataset.activityId}/attend/`)
      .then(res => {
        console.log(res)
        this.setData({
          showLoading: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setData({
          showLoading: false,
        })
      })
    })
    .catch(err => {
      console.log(err)
      this.setData({
        showLoading: false,
      })
    })
  }
})