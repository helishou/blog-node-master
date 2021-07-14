/*
 * @Author       : helishou
 * @Date         : 2021-07-14 14:50:50
 * @LastEditTime : 2021-07-14 16:22:01
 * @LastEditors  : helishou
 * @Description  :
 * @FilePath     : \util\test.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */

const imgSpider = require("./../imgSpider");
const mongodb = require("../../core/mongodb");
// data server
mongodb.connect();
const mongoose = mongodb.mongoose;
const Article = require("../../models/article");
updateArticle = () => {
  Article.find(
    {},
    {
      img_url: 1,
    },
    (error, result) => {
      console.log(result.length);
      for (let i = 0; i < result.length; i++) {
        //   console.log(result[i].img_url)
        if (
          result[i].img_url.indexOf &&
          result[i].img_url.indexOf("jpg") != -1
        ) {
          let newImgUrl;
          let tempArr = result[i].img_url.split("/");
          let newWebp =
            "https://www.wangxinyang.xyz/cloudDIsk/" +
            tempArr[tempArr.length - 1] +
            ".webp";
          //   console.log(newWebp)
          Article.findOneAndUpdate(
            { img_url: result[i].img_url },
            { img_url: newWebp },
            (err, res) => {
              console.log(res, "成功");
            }
          );
          //   if(result[i].img_url.indexOf('small')!=-1){
          //       newImgUrl = result[i].img_url.replace("small", "");
          //       newImgUrl = newImgUrl.slice(0, newImgUrl.length - 14) + ".jpg";
          //       console.log('可以放大',newImgUrl)
          //     //   imgSpider(result[i].img_url)
          //     //   imgSpider(newImgUrl)
          //     Model.findOneAndUpdate({img_url:result[i].img_url},{img_url:},(err,res)=>{
          //         console.log(res,'成功')
          //     })
          //   }else{
          //     //   imgSpider(result[i].img_url)
          //       console.log('不可放大',result[i].img_url)
          //   }
        }
      }
    }
  );

  // update(
  //   { _id: id },
  //   {
  //     title,
  //     author,
  //     keyword: keyword ? keyword.split(",") : [],
  //     content,
  //     desc,
  //     img_url,
  //     tags: tags ? tags.split(",") : [],
  //     category: category ? category.split(",") : [],
  //     state,
  //     type,
  //     origin,
  //     update_time: Date.now(),
  //   }
  // )
  //   .then((result) => {

  //   })
  //   .catch((err) => {
  //     console.error(err);

  //   });
};
updateArticle();

