// pages/search/search.js
import {
  findSortDesc
} from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchName: "",
    hotSearch: [],
    recent: [],
    pages: 0,
    pageSize: 9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    let {
      pages,
      pageSize
    } = this.data
    let res = await findSortDesc("menu", "views", pages, pageSize);
    let recent = wx.getStorageSync('recentSearch')
    this.setData({
      hotSearch: res.data,
      recent: recent
    })
  },
  //点击搜索
  searchMenu() {
    let menuName = this.data.searchName
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
  //点击近期搜索进入
  toList(e) {
    let recent = this.data.recent
    let id = e.currentTarget.id
    let first = recent.indexOf(id)
    recent.splice(first, 1)
    recent.unshift(id)
    wx.setStorageSync('recentSearch', recent)
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id
    })
  },
  //回退页面时请求搜索数据
  onShow() {
    let recent = wx.getStorageSync('recentSearch')
    this.setData({
      recent
    })
  },
  //点击热门搜索进入
  toDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  }
})