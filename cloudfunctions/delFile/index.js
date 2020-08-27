// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const fileIDs = event.fileIDs
  const result = await cloud.deleteFile({
    fileList: fileIDs,
  })
  return result.fileList
}