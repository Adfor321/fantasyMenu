const db = wx.cloud.database();
const _ = db.command
//普通查询
async function find(collectionName, _where = {},pages=0,pageSize=10) {
  var result = await db.collection(collectionName).where(_where).skip(pages*pageSize).limit(pageSize).get();
  return result
}
//模糊查询
async function vague(collectionName, value,pages=0,pageSize=10) {
  var result = await db.collection(collectionName).where({
    menuName: db.RegExp({
      //从搜索栏中获取的value作为规则进行匹配。
      regexp: value,
      //大小写不区分
      options: 'i',
    })
  }).skip(pages*pageSize).limit(pageSize).get();
  return result
}

//降序查询
async function findSortDesc(collectionName, descName,pages=0,pageSize=10) {
  var result = await db.collection(collectionName).orderBy(descName, "desc").skip(pages*pageSize).limit(pageSize).get();
  return result
}
//普通添加
async function adds(_add, data = {}) {
  var result = await db.collection(_add).add({
    data: data
  });
  return result
}
//多个图片添加
async function addsMany(tem) {
  var arr = [];
  tem.forEach(item => {
    var nowTime = new Date().getTime()
    var ext = item.url.split(".").pop()
    var fileArr = wx.cloud.uploadFile({
      cloudPath: "image/" + nowTime + "." + ext,
      filePath: item.url
    })
    arr.push(fileArr)
  })
  var res = await Promise.all(arr)
  return res
}
//删除
async function del(collectionName, _id) {
  var result = await db.collection(collectionName).doc(_id).remove()
  return result
}
//更新记录
async function update(collectionName, _id, data = {}) {
  var result = await db.collection(collectionName).doc(_id).update({
    data: data
  })
  return result
}
//数据自增
async function updateAdd(collectionName, _id,views,num) {
  var result = await db.collection(collectionName).doc(_id).update({
    data: {
      [views]:_.inc(num)
    }
  })
  return result
}
module.exports = {
  adds: adds,
  find: find,
  addsMany: addsMany,
  del: del,
  update: update,
  updateAdd:updateAdd,
  findSortDesc: findSortDesc,
  vague: vague
}