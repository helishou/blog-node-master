/*
 * @Author       : helishou
 * @Date         : 2021-07-14 19:25:11
 * @LastEditTime : 2021-07-14 19:36:23
 * @LastEditors  : helishou
 * @Description  : 
 * @FilePath     : \util\liuxTest.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
const fs = require("fs");
const imgSpider = require("./imgSpider");
src='/www/wwwroot/blog/cloudDisk/'
tempUrl='smallf27b49517d6436c5bdc301fd711631e41625305469.jpg'
url=''
fs.access(src + tempUrl, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("不存在路径", src + tempUrl);
      let newWebp =
        "https://www.wangxinyang.xyz/cloudDisk/" + tempUrl + ".webp";
      imgSpider(url, src); //服务器的保存目录I是大写
      if (tempUrl.indexOf("small") != -1) {
        //说明可以放大
        let newImgUrl = tempUrl.replace("small", "");
        newImgUrl = newImgUrl.slice(0, newImgUrl.length - 14) + ".jpg";
        imgSpider(newImgUrl, src);
      }
      return newWebp;
    } else {
      return url;
    }
})