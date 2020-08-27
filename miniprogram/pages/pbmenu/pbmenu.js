// pages/pbmenu/pbmenu.js
import {
  find,
  addsMany,
  adds
} from "../../utils/utils"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuSort: [],
    files: [],
    menuName: "",
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    var res = await find("sort")
    this.setData({
      menuSort: res.data
    })
    wx.getUserInfo({
      success: res => {
        let userInfo = res.userInfo
        this.setData({
          userInfo
        })
      }
    })

  },
  //点击图片选择
  bindselect(e) {
    var filesPath = e.detail.tempFilePaths;
    var files = filesPath.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      files
    })
  },
  //点击发布
async  submitMenu(e) {
  wx.showLoading()
    let {nickName,avatarUrl}=this.data.userInfo
    var nowTime = new Date().getTime()
    let menuName = this.data.menuName
    var res = await addsMany(this.data.files)
    var arr = res.map(item => {
      return item.fileID
    })
    await adds("menu", {
      menuName: menuName,
      typeId: e.detail.value.recipeTypeid,
      files: arr,
      make: e.detail.value.recipesMake,
      addtime: nowTime,
      nickName:nickName,
      avatarUrl:avatarUrl,
      follows:0,
      views:0,
    })
    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: '发布成功',
          icon:"success",
          success:res=>{
            //返回上一个页面
            wx.navigateBack({
              delta: 1,
            })
          }
        })
        
      },
    })

  },

})