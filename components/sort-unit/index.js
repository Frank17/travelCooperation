// components/sort-unit/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    activate: Boolean,
    asc: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    if (this.data.activate) {
      this.setData({
        asc: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOrdered: function (event) {
      if (this.data.activate) {
        this.setData({
          asc: !this.data.asc
        })
      } else {
        this.setData({
          activate: true,
          asc: true,
        })
      }
      this.triggerEvent('ordered', {...event.detail, asc: this.data.asc, byTitle: this.data.title})
    }
  }
})
