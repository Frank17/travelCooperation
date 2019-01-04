// pages/publication/publication.js
import moment from '../../miniprogram_npm/moment/index.js'
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
})