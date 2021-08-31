/*
 * @Author       : helishou
 * @Date         : 2021-07-13 23:46:18
 * @LastEditTime : 2021-08-31 22:50:50
 * @LastEditors  : helishou
 * @Description  :
 * @FilePath     : f:\桌面\front do\blog-node-master\blog-node-master\util\imgSpider.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
const fs = require("fs");
const http = require("http");
var webp = require("webp-converter");
// var gm = require('gm');
// const { url } = require('inspector')
const CONFIG =require('../app.config')
let src = CONFIG.STOREDIR.IMAGE;
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
const cookie =
  "__yjs_duid=1_d2e90dd9423720235fb02211aa9751dd1626244512341; yjs_js_security_passport=4e1767e15d7e78523b259330da8b11ce52741d84_1626245048_js; td_cookie=2035685763";
const host = "img.netbian.com";

/**
 * 图片下载器
 * @param {string} url - 图片的网络地址
 * @param {string} dest - 保存图片的地址
 * @param {number} timeout - 超时时间，默认 3 分钟
 * @param {number} retries - 重试次数，默认重试 2 次
 */
function imgSpider(url, dest = "", timeout = 1000 * 3 * 60, retries = 2,callback) {
  if(url.indexOf('wangxinyang')!==-1){
    return url
  }
  // imageProcessing
  // .webp()
  // .pipe(someWritableStream);
  // console.log(url)
  let tempArr = url.split("/");
  dest = dest + tempArr[tempArr.length - 1];
  console.log("保存在：", dest);
  let isRetry = false;
  let req = http.request(url, (res) =>
    res.pipe(fs.createWriteStream(dest)).on("finish", ()=> {
      imgToWebp(dest);
      callback&&callback()
    })
  );
  req.setTimeout(timeout, () => {
    req.abort();
    isRetry = true;
  });
  req.setHeader("User-Agent", userAgent);
  req.setHeader("Referer", "http://www.netbian.com/");
  req.setHeader("Cookie", cookie);
  req.setHeader("Host", host);
  // req.setHeader("If-Modified-Since", 'Thu, 08 Jul 2021 14:09:02 GMT');
  // req.setHeader("If-None-Match", "60e706fe-1e8fd");
  // console.log(req)
  req.on("error", () => {
    isRetry = true;
    console.log("失败", url);
  });
  req.on("close", () => {
    // 重试时，将超时时间递增 1 分钟
    if (isRetry && retries > 0)
      imgSpider(url, dest, timeout + 60 * 1000, retries - 1);
  });
  req.end();
  return "https://www.wangxinyang.xyz/cloudDisk/" + dest + ".webp";
}

/**
 * @description :
 * @param        {string} dest图片路径
 * @return       {undefined}
 */
const imgToWebp = (dest) => {
  console.log(dest);
  let qulity=100
  if(dest.indexOf('small')!=-1){
    qulity=95
  }
  const result = webp.cwebp(dest, dest + ".webp", "-q "+qulity);
  result.then((response) => {
    // console.log(response);
  });
};

//图片目录
/**
 * @description : 将网络图片存到服务器
 * @param        {string} url
 * @return       {string} newWebp
 */
const imgSaver = (url) => {
  if(!url.indexOf('netbian')) return url
  let tempUrl = url.split("/");
  tempUrl = tempUrl[tempUrl.length - 1];
  console.log("tempUrl", src + tempUrl);
  // 检测服务器是否存在这个图片，如果存在返回原来url
  fs.access(src + tempUrl, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("不存在路径", src + tempUrl);
      imgSpider(url, src); //服务器的保存目录I是大写
      if (tempUrl.indexOf("small") != -1) {
        //说明可以放大
        let newImgUrl = url.replace("small", "");
        newImgUrl = newImgUrl.slice(0, newImgUrl.length - 14) + ".jpg";
        imgSpider(newImgUrl, src);
      }
    }
  });
  return "https://www.wangxinyang.xyz/cloudDisk/" + tempUrl + ".webp";
};
/**
 * @description : 将服务器图片删除
 * @param        {string} url
 * @return       {undefined}
 */
const imgDelete = (url) => {
  if (typeof url !== "string") {
    return;
  }
  let tempUrl = url.split("/");
  tempUrl = tempUrl[tempUrl.length - 1];
  fs.access(src + tempUrl, fs.constants.F_OK, (err) => {
    //如果可以执行到这里那么就表示存在了
    if (!err) {
      try {
        fs.unlink(src + tempUrl);
        fs.unlink(src + tempUrl.slice(0, tempUrl.length - 5));
      } catch (e) {
        return false;
      }
      if (tempUrl.indexOf("small") != -1) {
        //说明可以放大
        let newImgUrl = tempUrl.replace("small", "");
        newImgUrl = newImgUrl.slice(0, 32) + ".jpg";
        try {
          fs.unlink(src + newImgUrl);
          fs.unlink(src + newImgUrl + ".webp");
        } catch (e) {
          return false;
        }
      }
    }
  });
};

module.exports = {imgSpider,imgSaver,imgDelete};
// getCookie(
//   "http://img.netbian.com/file/2021/0708/small328c217f576e240194847ad9c56e73741625753341.jpg"
// );
// request('http://img.netbian.com/file/2021/0708/small328c217f576e240194847ad9c56e73741625753341.jpg').pipe(fs.createWriteStream('doodle.jpg'))
// imgToWebp('F:/图片/壁纸/70150501_p0.jpg')