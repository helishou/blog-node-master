/*
 * @Author       : helishou
 * @Date         : 2021-07-15 13:21:52
 * @LastEditTime : 2021-07-15 14:03:13
 * @LastEditors  : helishou
 * @Description  : 将小图转base64
 * @FilePath     : \util\webpToBase64.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */

const imgSpider = require("./imgSpider");
const mongodb = require("../core/mongodb");
// data server
mongodb.connect();
const mongoose = mongodb.mongoose;
const Article = require("../models/article");
const fs = require("fs");
function getImageType(str) {
    var reg = /\.(png|jpg|gif|jpeg|webp)$/;
    return str.match(reg)[1];
  }
webpToBase64 =async (fileName) =>await new Promise((resolve,reject)=>{
    let result;
  fs.readFile(fileName, "binary", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("数据读取成功");
      const buffer = Buffer.from(data, "binary");
      result =
        "data: image/" +
        getImageType(fileName) +
        ";base64," +
        buffer.toString("base64");
      console.log(result.slice(0,40))
      resolve(result)
    }
  });
})
  
const main = async () => {
  Article.find(
    {},
    {
      img_url: 1,
    },
    (error, result) => {
    //   console.log(result.length);
      for (let i = 0; i < result.length; i++) {
        //   console.log(result[i].img_url)
        if (
          result[i].img_url.indexOf &&
          result[i].img_url.indexOf("data:image") != -1
        ) {
          (async function a() {
            let newImgUrl;
            //   console.log(newWebp)
            let newUrl = await webpToBase64(result[i].img_url);
            Article.findOneAndUpdate(
              { img_url: result[i].img_url },
              { img_url: newUrl, origin_url: result[i].img_url },
              (err, res) => {
                console.log(result[i].img_url, "成功");
              }
            );
          })();
        }
      }
    }
  );
};
// main();
// webpToBase64(__dirname + "/list_091.jpg").then((value=>{
//     console.log('value');
// }));

main()