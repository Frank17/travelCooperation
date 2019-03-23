// pages/checkin/checkin.js
import { getRequest, server, post, getOpenId } from '../../utils/util.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog.js'
import _ from '../../miniprogram_npm/lodash/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members: [],
    activityId: null
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      activityId: options.id
    })
    getRequest(`${server}/members/${options.id}`)
      .then(res => {
        console.log(res)
        let members = res.data.param
        this.setData({
          members: members
        })
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
  checkClicked(e) {
    console.log(e)
    if (e.currentTarget.dataset.checkedin) {
      return;
    } else {
      Dialog.confirm({
        title: '签到确认',
        message: '是否确认为该用户签到？',
        selector: '#dlg-checkin',
        onConfirm: confirmE => {
          console.log(e)
          getOpenId()
            .then(openid => {
              post(`${server}/attend/${this.data.activityId}/${openid}/${e.currentTarget.dataset.member}/`)
                .then(attendRes => {
                  if (attendRes.data.status) {
                    wx.showToast({
                      title: '签到成功',
                    })
                    _.each(this.data.members, member => {
                      if (member.openid === openid) {
                        member.attend = true
                        return false
                      }
                    })
                    this.setData({
                      members: this.data.members
                    })
                  } else {
                    wx.showToast({
                      title: attendRes.data.reason,
                    })
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            })
          
        },
        onCancel: e => {

          console.log(e)
        },
        onClose: e => {

          console.log(e)
        }
      })
    }
    
  },
  checkInComfirmed(r) {

  },
  checkInCanceled(e) {

  },
  checkInClosed(e) {

  }
})