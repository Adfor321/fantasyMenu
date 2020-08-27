import {
  find
} from "../../utils/utils"
Page({
  data: {
    menus: [],
    pages: 0,
    pageSize: 10,
    menuName: "",
    recent: [],
    noList: false
  },
  async onLoad() {
    var res = await find("menu", {}, 0, 10)
    this.setData({
      menus: res.data
    })
  },
  //触底刷新
  async onReachBottom() {
    if (!this.data.noList) {
      let {
        pageSize
      } = this.data
      this.data.pages += 1
      var res = await find("menu", {}, this.data.pages, pageSize)
      this.setData({
        menus: this.data.menus.concat(res.data)
      })
    } else {
      this.setData({
        noList: true
      })
      return
    }
  },
  //点击首页图片进入详情
  goDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  },
  //首页搜索时
  search() {
    let menuName = this.data.menuName
    //查找是否有本地缓存
    if (wx.getStorageSync('recentSearch')) {
      let recent = wx.getStorageSync('recentSearch');
      //查找近期搜索中是否有该搜索
      let res = recent.some(item => {
        return item == menuName
      })
      //有则直接跳页面
      if (res) {
        let first = recent.indexOf(menuName)
        recent.splice(first, 1)
        recent.unshift(menuName)
        wx.setStorageSync('recentSearch', recent)
        wx.navigateTo({
          url: '../recipelist/recipelist?id=' + menuName,
        })
        return
      } else {
        recent.unshift(menuName)
        wx.setStorageSync('recentSearch', recent)
        wx.navigateTo({
          url: '../recipelist/recipelist?id=' + menuName,
        })
      }

    } else {
      //没有本地缓存的时候就创建本地缓存
      let recentSearch = [];
      recentSearch.push(menuName)
      wx.setStorageSync('recentSearch', recentSearch)
      wx.navigateTo({
        url: '../recipelist/recipelist?id=' + menuName,
      })
    }
  },
  //去儿童菜谱
  async goGhild() {
    let res = await find("sort", {
      typeName: "儿童菜谱"
    })
    let id = res.data[0]._id
    wx.navigateTo({
      url: `../recipelist/recipelist?_id=${id}&&name=儿童菜谱`,
    })
  },
  //去养生菜谱
  async goLive() {
    let res = await find("sort", {
      typeName: "养生菜谱"
    })
    let id = res.data[0]._id
    wx.navigateTo({
      url: `../recipelist/recipelist?_id=${id}&&name=养生菜谱`,
    })
  },
  //去家常菜谱
  async goHomeFood() {
    let res = await find("sort", {
      typeName: "家常菜谱"
    })
    let id = res.data[0]._id
    wx.navigateTo({
      url: `../recipelist/recipelist?_id=${id}&&name=家常菜谱`,
    })
  },
  //去分类集合
  toSortList() {
    wx.navigateTo({
      url: "../typelist/typelist",
    })
    
  },
  onHide() {
    this.setData({
      menuName: ""
    })
  },
  async onShow() {
    var res = await find("menu", {}, 0, 10)
    this.setData({
      menus: res.data,
    })
  }
})