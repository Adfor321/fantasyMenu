// pages/typelist/typelist.js
import {find} from "../../utils/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[],
    typeSearch:""
  },


 async onLoad(){
   //页面加载时渲染菜谱列表
      let res = await find("sort")
      this.setData({
        typeList:res.data
      })
  },
  //点击菜谱列表进行的跳转
  toList(e){
    let id = e.currentTarget.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `../recipelist/recipelist?_id=${id}&&name=${name}`,
    })
  },
  //点击搜索跳转页面
 async toSearch(){
      let searchName = this.data.typeSearch;
      let res = await find("sort",{
        typeName:searchName
      })
      //获取到数据长度大于0时才进行带有id的跳转
      if(res.data.length>0){
        let id = res.data[0]._id
        wx.navigateTo({
          url: `../recipelist/recipelist?_id=${id}&&name=${searchName}`,
        })
      }else{
        //用户输入数据库中不存在的菜谱名字时所进行的跳转
        let id = ""
        wx.navigateTo({
          url: `../recipelist/recipelist?_id=${id}&&name=${searchName}`,
        })
      }
  },
  //返回来的时候清空搜索
  onShow(){
    this.setData({
      typeSearch:""
    })
  }
})