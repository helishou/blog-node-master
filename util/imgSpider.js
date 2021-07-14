/*
 * @Author       : helishou
 * @Date         : 2021-07-13 23:46:18
 * @LastEditTime : 2021-07-14 16:30:40
 * @LastEditors  : helishou
 * @Description  :
 * @FilePath     : \util\imgSpider.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
const fs = require("fs");
const http = require("http");
var webp = require("webp-converter");
// const { url } = require('inspector')
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
function imgSpider(url, dest = "", timeout = 1000 * 3 * 60, retries = 2) {
  // imageProcessing
  // .webp()
  // .pipe(someWritableStream);
  // console.log(url)
  let tempArr=url.split("/")
  dest = dest + tempArr[tempArr.length-1];
  let isRetry = false;
  let req = http.request(url, (res) => res.pipe(fs.createWriteStream(dest)));
  req.setTimeout(timeout, () => {
    req.abort();
    isRetry = true;
  });
  req.setHeader("User-Agent", userAgent);
  req.setHeader("Referer", 'http://www.netbian.com/');
  req.setHeader("Cookie", cookie);
  req.setHeader("Host", host);
  // req.setHeader("If-Modified-Since", 'Thu, 08 Jul 2021 14:09:02 GMT');
  // req.setHeader("If-None-Match", "60e706fe-1e8fd");
  // console.log(req)
  req.on("error", () => {
    isRetry = true;
  });
  req.on("close", () => {
    // 重试时，将超时时间递增 1 分钟
    if (isRetry && retries > 0)
      pictureDownloader(url, dest, timeout + 60 * 1000, retries - 1);
  });
  req.on("finish", () => {
    console.log(dest);
    try{
      imgToWebp(dest)
    }catch{
      console.log('转换失败',dest)
    }
  });
  req.end();
}

/**
 * @description : 
 * @param        {string} dest图片路径
 * @return       {undefined}
 */
imgToWebp=(dest)=>{
  const result = webp.cwebp(
    dest,
    dest + ".webp",
    "-q 80",
    (logging = "-v")
  );
  result.then((response) => {
    console.log(response);
  });
}


module.exports=imgSpider
// getCookie(
//   "http://img.netbian.com/file/2021/0708/small328c217f576e240194847ad9c56e73741625753341.jpg"
// );
// request('http://img.netbian.com/file/2021/0708/small328c217f576e240194847ad9c56e73741625753341.jpg').pipe(fs.createWriteStream('doodle.jpg'))
