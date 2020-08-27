// pages/recipelist/recipelist.js
import {
  vague,
  find
} from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [],
    ismenu: false,
    pages: 0,
    pageSize: 10
  },

 //加载页面时进行查询数据库
  async onLoad(e) {
    let menuName = e.id
    //当用户在主页或者搜索页面进行搜索的时候
    if (menuName) {
      let {
        pages,
        pageSize
      } = this.data
      let res = await vague("menu", menuName, pages, pageSize)
      wx.setNavigationBarTitle({
        title: menuName
      })
      this.setData({
        menuList: this.data.menuList.concat(res.data),
        ismenu: true
      })
    }else if(e._id){//当用户在菜谱分类里搜索的时候
      let {
        pages,
        pageSize
      } = this.data
      let id = e._id;
      let name = e.name
      let res = await find("menu", {typeId:id}, pages, pageSize)
      wx.setNavigationBarTitle({
        title: name
      })
      this.setData({
        menuList: this.data.menuList.concat(res.data),
        ismenu: true
      })
    }else{
      //当什么都没有找到的时候
      wx.setNavigationBarTitle({
        title: e.name
      })
    }
  },
  //触底刷新
  async onReachBottom() {
    let {
      pageSize
    } = this.data
    this.data.pages += 1
    let res = await vague("menu", menuName, this.data.pages, pageSize)
    this.setData({
      menuList: this.data.menuList.concat(res.data),
      ismenu: true
    })
  },
  //去详情页
  toDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  }
})