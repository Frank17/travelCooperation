// pages/publication/publication.js
import moment from '../../miniprogram_npm/moment/index.js'
import _ from '../../miniprogram_npm/lodash/index.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog.js'
import { post, server, getOpenId } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxMemberPickerShown: false,
    maxMemebersValues: [],
    maxMember: 10,
    startDatePickerShown: false,
    endDatePickerShown: false,
    startDate: moment().format('YYYY/MM/DD HH:mm'),
    startDateValue: moment().millisecond(),
    endDate: moment().add(12, 'h').format('YYYY/MM/DD HH:mm'),
    endDateValue: moment().add(12, 'h').millisecond(),
    images: [],
    imagesEncoded: [],
    activityValue: {
      title: null,
      detail: null,
      location: null
    },
    isLoadingShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let values = []
    for (let i = 1; i <= 140; i++) {
      values.push(i);
    }
    this.setData({
      maxMemebersValues: values
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
  showPicker(event) {
    let { currentTarget } = event
    let pickerType = currentTarget.dataset.pickerType
    if (pickerType === 'maxMember') {
      this.setData({
        maxMemberPickerShown: true,
      })
    } else if (pickerType === 'startDatePicker') {
      this.setData({
        startDatePickerShown: true,
      })
    } else if (pickerType === 'endDatePicker') {
      this.setData({
        endDatePickerShown: true,
      })
    } else if (pickerType === 'addressPicker') {
      wx.chooseLocation({
        success: addr => {
          this.setData({
            activityValue: {
              ...this.data.activityValue,
              location: addr.address
            }
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },
  onClosePicker(event) {
    let { currentTarget } = event
    let pickerType = currentTarget.dataset.forPicker
    if (pickerType === 'maxMember') {
      this.setData({
        maxMemberPickerShown: false,
      })
    } else if (pickerType === 'startDatePicker') {
      this.setData({
        startDatePickerShown: false,
      })
    } else if (pickerType === 'endDatePicker') {
      this.setData({
        endDatePickerShown: false,
      })
    } else if (pickerType === 'addressPicker') {

    }
  },
  onDatePickerConfirm(e) {
    let { currentTarget } = e
    let pickerType = currentTarget.dataset.forPicker
    if (pickerType === 'maxMember') {
      this.setData({
        maxMember: e.detail.value,
        maxMemberPickerShown: false,
      })
    } else if (pickerType === 'startDatePicker') {
      // this.setData({})
      this.setData({
        startDateValue: e.detail,
        startDatePickerShown: false,
        startDate: moment(e.detail).format('YYYY/MM/DD HH:mm')
      })
    } else if (pickerType === 'endDatePicker') {
      this.setData({
        endDateValue: e.detail,
        endDate: moment(e.detail).format('YYYY/MM/DD HH:mm'),
        endDatePickerShown: false,
      })
    } else if (pickerType === 'addressPicker') {

    }
  },
  onDatePickerChange(e) {

  },
  onCloseMaxMemberPicker() {
    this.setData({
      maxMemberPickerShown: false,
    })
  },
  onMaxMemberChange() {

  },
  onMaxMemberConfirm(event) {
    let { detail } = event
    console.log(detail)
    this.setData({
      maxMember: detail.value,
      maxMemberPickerShown: false,
    })
  },
  onMaxMemberCancel() {
    this.setData({
      maxMemberPickerShown: false
    })
  },
  onCloseStartDatePicker() {
    this.setData({
      startDatePickerShown: false,
    })
  },
  nowDate() {
    return new Date().getTime()
  },
  onChooseImageTap(e) {
    wx.chooseImage({
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: base64Str => { //成功的回调
            let { images, imagesEncoded } = this.data
            images = _.concat(images, res.tempFiles)
            // images.push(res.tempFiles)
            this.setData({
              images: images
            })
            imagesEncoded.push(base64Str)
            this.setData({
              imagesEncoded: imagesEncoded
            })
            console.log(imagesEncoded)
          }
        })
      },
    })
  },
  onPublished(e) {
    let { activityValue, maxMember, startDateValue, endDateValue, startDate, endDate } = this.data
    activityValue.maxMembers = maxMember
    activityValue.start = moment(startDate).format('YYYY-MM-DD HH:mm:ss')
    activityValue.end = moment(endDate).format('YYYY-MM-DD HH:mm:ss') 
    activityValue.address = activityValue.location ? activityValue.location : ""
    activityValue.imgs = []
    console.log(activityValue)
    if (null === this.data.activityValue.title || 0 >= this.data.activityValue.title.trim().length) {
      Dialog.alert({
        title: '信息不完整',
        message: '请输入完整的标题信息，否则无法创建活动',
        selector: '#van-dlg-info-incomplete'
      })
      return;
    }

    this.setData({
      isLoadingShow: true
    })
    getOpenId()
    .then(openid => {
      post(`${server}/activities/add/${openid}/`, activityValue)
      .then(addRes => {
        this.setData({
          isLoadingShow: false
        })
        wx.navigateBack({
          success: (e) => {
            console.log(e)
            let pages = getCurrentPages()
            let currentPage = pages[pages.length -1]
            if (currentPage && currentPage.onRefresh) {
              currentPage.onRefresh()
            }
          }
        })
      })
      .catch(err => {
        console.log(err)
        wx.showToast({
          title: 'err 1',
        })
        this.setData({
          isLoadingShow: false
        })
      })
    })
    .catch(err => {
      this.setData({
        isLoadingShow: false
      })
      console.log(err)
      wx.showToast({
        title: 'err 2',
      })
    })
  },
  loadingComplete(e) {
    wx.navigateBack({
      
    })
  },
  onTitleChanged(val) {
    this.setData({
      activityValue: {
        ...this.data.activityValue,
        title: val.detail,
      }
    })
  },
  onDetailChanged(e) {
    this.setData({
      activityValue: {
        ...this.data.activityValue,
        detail: e.detail
      }
    })
  },

})