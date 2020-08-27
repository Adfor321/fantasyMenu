// pages/personal/personal.js
const app = getApp()

import {
  find,
  del
} from "../../utils/utils"
Page({

  data: {
    userInfo: [],
    isLogin: false,
    tabArr: ["菜单", "菜谱", "关注"],
    selectId: 0,
    menuSort: [],
    openid: "",
    menus: [],
    followList:[],
    pages:0,
    pageSize:10,
    resLength:1
  },

  async onLoad() {
    if (app.globalData.userInfo != null) {
      let userInfo = app.globalData.userInfo;
      this.setData({
        userInfo,
        isLogin: true
      })
      if (app.globalData.openid != null) {
        let openid = app.globalData.openid
        this.setData({
          openid: openid
        })
        return
      } else {
        app.userOpenid = res => {
          this.setData({
            openid: res.result.openid
          })
          return
        }
      }
      this.menuFirst(0,10)
      
    } else {
      app.userapp = res => {
        let userInfo = res.userInfo;
        this.setData({
          userInfo,
          isLogin: true
        })
        if (app.globalData.openid != null) {
          let openid = app.globalData.openid
          this.setData({
            openid: openid
          })
        } else {
          app.userOpenid = res => {
            this.setData({
              openid: res.result.openid
            })
          }
        }
        this.menuFirst(0,10)
      }
    }


  },
  async menuFirst(pages,pageSize) {
    if (this.data.isLogin && this.data.selectId == 0) {
      var res = await find("menu", {
        _openid: this.data.openid
      },pages,pageSize)
      this.setData({
        menus: this.data.menus.concat(res.data)
      })
    }
  },
  //获取关注列表
  async followList(){
    wx.showLoading()
    wx.cloud.callFunction({
      name:'find',
      data:{
        collection:'follow',
        from:'menu',
        localField:'menuId',
        foreignField:'_id',
        as:'many',
        match:{_openid:app.globalData.openid}
      },
      success:res=>{
      this.setData({
        followList:res.result.list
      })
      wx.hideLoading()
      }
    })
   },
   //点击关注中的图片
   toDetail(e){
     let id = e.currentTarget.id
     wx.navigateTo({
       url: '../recipeDetail/recipeDetail?id='+id,
     })
   },
  //点击选项卡
  async tab(e) {
    let id = e.target.id;
    this.setData({
      selectId: id
    })
    if (this.data.isLogin && this.data.selectId == 1) {
      if (this.data.menuSort.length < 1) {
        wx.showLoading()
        var res = await find("sort")
        this.setData({
          menuSort: res.data
        })
        wx.hideLoading()
      }
    }
    if (this.data.isLogin && this.data.selectId == 2){
        this.followList()
    }
  },
  //登录
  login(e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let userInfo = e.detail.userInfo
          this.setData({
            userInfo,
            isLogin: true
          })
          this.menuFirst()
        }
      }
    })
  },
  //返回页面时重新获取添加后的列表
  onShow(){
    this.data.menus = []
    this.menuFirst();
    this.followList()
  },
  release() {
    wx.navigateTo({
      url: '../pbmenutype/pbmenutype',
    })
  },
  //触底刷新
async onReachBottom(){
    if(this.data.resLength>0){
      let {
        pageSize
      } = this.data
      this.data.pages += 1
      var res = await find("menu", {
        _openid: this.data.openid
      },this.data.pages,pageSize)
      this.data.resLength = res.data.length
      this.setData({
        menus: this.data.menus.concat(res.data)
      })
    }
  },
  pbmenu() {
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  //删除菜单列表项
  delCdlb(e) {
    let id = e.target.dataset.id
    let files = e.target.dataset.files
    let index = e.target.dataset.index
    wx.showModal({
      cancelColor: 'red',
      title: "你确定要删除吗",
      success:async res => {
        if (res.confirm == true) {
          //删除菜单列表
          var res = await del("menu", id)
          //删除文件
          wx.cloud.deleteFile({
            fileList:files,
          })
          //删除关注列表中的对应项
          wx.cloud.callFunction({
            name:"detailAll",
            data:{
              _collection:"follow",
              _where:{
                menuId:id
              }
            }
          })
          let arr = this.data.menus
          //页面上显示的删除对应下标项
          arr.splice(index, 1)
          this.setData({
            menus: arr
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      },
    })
  }
})