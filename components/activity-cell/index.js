// components/activity-cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: String,
    activity: Object,
  },

  ready() {
    let title = this.getTagTitle()
    let type = this.getTagType()
    this.setData({
      tagTitle: title,
      tagType: type
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    tagType: 'default',
    tagTitle: '已结束'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event) {
      // event.prevent()
      this.triggerEvent('cell-tap', {...event.detail, ...this.data.activity})
    }, 
    onLongTap(event) {
      this.triggerEvent('cell-longpress', { ...event.detail, ...this.data.activity })
    },
    getTagType() {
      let type = this.data.activity.status
      if (null === type) {
        return 'default'
      } else if (type === 0) {
        return 'default'
      } else {
        let members = this.data.activity.members
        if (null === members) {
          members = 0;
        }
        if (200 < members) {
          return 'danger'
        } else {
          return 'success'
        }
      }
    },
    getTagTitle() {
      let type = this.data.activity.status
      if (null === type) {
        return '已结束'
      } else if (type === 0) {
        return '已结束'
      } else {
        let members = this.data.activity.members
        if (null === members) {
          members = 0;
        }
        if (50 < members) {
          return '火热招募中'
        } else {
          return '正在招募'
        }
      }
    },
  }
})
