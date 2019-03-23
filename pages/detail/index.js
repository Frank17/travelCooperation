// pages/detail/index.js
import { Base64 } from '../../miniprogram_npm/js-base64/index.js'
import { getRequest, server, post, getOpenId } from '../../utils/util.js'
import _ from '../../miniprogram_npm/lodash/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: null,
    showLoading: false,
    attended: null,
    loadingText: '正在加载...',
    isOwner: null,
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
      let a = this.data.activity
      a.owner = data.param.owner
      this.setData({
        activity: a
      })
      getOpenId().then(openid => {
        _.each(data.param.members, member => {
          if (member.openid === openid) {
            this.setData({
              attended: true
            })
          }
          return false
        })
        if (openid === data.param.owner.openid) {
          this.setData({
            isOwner: true
          })
        }
        if (null === this.data.attended) {
          this.setData({
            attended: false
          })
        }
      }).catch(err => {

      })
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
  onCancelAttendTap(e) {
    this.setData({
      showLoading: true,
      loadingText: '正在取消...'
    })
    getOpenId()
      .then(openid => {
        post(`${server}/activities/${openid}/${e.currentTarget.dataset.activityId}/cancel/`)
          .then(res => {
            console.log(res)
            this.setData({
              showLoading: false,
            })
            this.setData({
              attended: false
            })
            // 获取列表
            getRequest(`${server}/members/${this.data.activity.id}`)
              .then(res => {
                console.log(res)
                let members = res.data.param
                this.data.activity.members = members
                this.setData({
                  activity: this.data.activity
                })
              })
              .catch(err => {
                console.log(err)
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
  },
  onAttendTap(e) {
    console.log(e)
    this.setData({
      showLoading: true,
      loadingText: '正在报名...'
    })
    getOpenId()
    .then(openid => {
      post(`${server}/activities/${openid}/${e.currentTarget.dataset.activityId}/attend/`)
      .then(res => {
        console.log(res)
        this.setData({
          showLoading: false,
        })
        this.setData({
          attended: true
        })

        // 获取列表
        getRequest(`${server}/members/${this.data.activity.id}`)
          .then(res => {
            console.log(res)
            let members = res.data.param
            this.data.activity.members = members
            this.setData({
              activity: this.data.activity
            })
          })
          .catch(err => {
            console.log(err)
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