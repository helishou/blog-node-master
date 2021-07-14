/*
 * @Author       : helishou
 * @Date         : 2021-07-14 19:47:12
 * @LastEditTime : 2021-07-14 20:52:59
 * @LastEditors  : helishou
 * @Description  :
 * @FilePath     : \util\ttt.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
// import 等语法要用到 babel 支持
// const Article =require("../models/article");
const imgSpider = require("../util/imgSpider");
var fs = require("fs");
var webp = require("webp-converter");
let src = "D:/desk/sakura/express/";
// let src = "/www/wwwroot/blog/cloudDisk/";
const imgSaver = (url) => {
  let newWebp = url;
  let tempUrl = url.split("/");
  tempUrl = tempUrl[tempUrl.length - 1];
  console.log("tempUrl", src + tempUrl);
  // 检测服务器是否存在这个图片，如果存在返回原来url
  fs.access(src + tempUrl, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("不存在路径", src + tempUrl);
    //   newWebp = "https://www.wangxinyang.xyz/cloudDisk/" + tempUrl + ".webp";
      imgSpider(url, src); //服务器的保存目录I是大写
      if (tempUrl.indexOf("small") != -1) {
        //说明可以放大
        let newImgUrl = url.replace("small", "");
        newImgUrl = newImgUrl.slice(0, newImgUrl.length - 14) + ".jpg";
        imgSpider(newImgUrl, src);
      }
    }
  });
  return "https://www.wangxinyang.xyz/cloudDisk/" + tempUrl + ".webp"
};
const value = imgSaver(
  "http://img.netbian.com/file/2020/1113/small6726872bddca923ccad6f4ec40d3c9f11605282585.jpg"
);
console.log(value);
const imgToWebp = (dest) => {
  console.log(dest);
  const result = webp.cwebp(dest, dest + ".webp", "-q 80", (logging = "-v"));
  result.then((response) => {
    // console.log(response);
  });
};

// imgToWebp('/www/wwwroot/blog/cloudDisk/smallf27b49517d6436c5bdc301fd711631e41625305469.jpg');
