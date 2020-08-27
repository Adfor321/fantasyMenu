
import {
  adds,
  find,
  del,
  update
} from "../../utils/utils"
Page({

  data: {
    add: false,
    edit: false,
    typeName: "",
    typeArr: [],
    editTypeName: "",
    editId:null,
    pagesize:2
  },
  async onLoad() {
    let res = await find("sort");
    this.setData({
      typeArr: res.data
    })
  },
//点击添加
  addSort() {
    this.setData({
      add: true
    })
  },
  //添加分类
  async addType() {
    let datas = this.data.typeName
    this.data.typeArr.push({
      typeName: datas
    })
    await adds("sort", {
      typeName: datas
    })
    let result = await find("sort");
    this.setData({
      add: false,
      typeName: "",
      typeArr: result.data
    })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1000
    })
  },
  //取消添加
  blur() {
    this.setData({
      add: false
    })
  },
  //点击删除
  del(e) {
    let id = e.target.dataset.id
    let index = e.target.id
    wx.showModal({
      cancelColor: 'red',
      title: "你确定要删除吗",
      success: res => {
        if (res.confirm == true) {
          var res = del("sort", id)
          let arr = this.data.typeArr
          arr.splice(index, 1)
          this.setData({
            typeArr: arr
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      },
    })
  },
  //点击修改
edit(e) {
  let id = e.target.dataset.id
    this.setData({
      edit: true,
      editId:id,
      editTypeName: e.target.dataset.id.typeName
    })

  },
  //点击提交修改
 async editType(){
   let id = this.data.editId._id;
    await update("sort",id,{
      typeName:this.data.editTypeName
    })
    wx.showToast({
      title: '修改成功',
      icon: 'success'
    })
    let res = await find("sort");
    this.setData({
      typeArr: res.data,
      edit:false
    })
  }
})