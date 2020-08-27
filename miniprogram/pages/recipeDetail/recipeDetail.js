import {
  find,
  adds,
  del,
  updateAdd
} from "../../utils/utils"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    isfollow: false,
    menuId: "",
    someMenu: "",
    followClick: false
  },

  async onLoad(e) {
    let id = e.id
    var res = await find("menu", {
      _id: id
    })
    //查询并渲染数据同时让访问量views+1
    this.data.detail = res.data[0]
    await updateAdd("menu", id, "views", 1)
    this.data.detail.views = this.data.detail.views + 1
    this.setData({
      detail: this.data.detail,
      menuId: id
    })
    let menuName = this.data.detail.menuName
    wx.setNavigationBarTitle({
      title: menuName
    })
    if (app.globalData.userInfo != null) {
      this.realfollow()
    }
  },
  async realfollow() {
    let id = app.globalData.openid
    let menuId = this.data.menuId
    var res = await find("follow", {
      _openid: id,
      menuId: menuId
    })
    if (res.data.length > 0) {
      this.setData({
        isfollow: true
      })
    }else{
      //若是没有关注则设置关注可点击属性为true
      this.data.followClick = true
    }
  },
  async follow() {
    //当关注可点击的属性没有为true时不可点击
    if (this.data.followClick) {
      let time = new Date().getTime()
      let id = this.data.menuId
      this.data.someMenu = id
      await adds("follow", {
        menuId: id,
        addtime: time
      })
      wx.showToast({
        title: '关注成功',
        icon: 'success',
        duration: 1000
      })
      await updateAdd("menu", id, "follows", 1)
      this.data.detail.follows = this.data.detail.follows + 1
      this.setData({
        isfollow: true,
        detail: this.data.detail
      })
    }

  },
  //取消关注
  async unfollow() {
    let id = this.data.menuId
    let result = await find("follow", {
      menuId: id
    })

    let removeId = result.data[0]._id
    await del("follow", removeId)
    wx.showToast({
      title: '取消关注',
      icon: 'success',
      duration: 1000
    })
    await updateAdd("menu", id, "follows", -1)
    this.data.detail.follows = this.data.detail.follows - 1
    this.setData({
      isfollow: false,
      detail: this.data.detail
    })
  }

})