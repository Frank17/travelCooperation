// components/sort-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemFocused: function(event) {
      let id = event.currentTarget.dataset.id
      this.data.items.map((item, index) => {
        if (item.id === id) {
          this.setData({
            currentId: id
          })
          return false
        }
      })
      this.triggerEvent('item-order', {...event.detail, byId: id})
    }
  }
})
