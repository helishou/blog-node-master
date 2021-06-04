/*
 * @Author       : helishou
 * @Date         : 2021-06-04 19:30:31
 * @LastEditTime : 2021-06-04 23:18:34
 * @LastEditors  : helishou
 * @Description  : 后台转发解决跨域
 * @FilePath     : d:\desk\sakura\express\routes\transmit.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
const fetch = require("node-fetch");
const fs = require("fs");
import { responseClient } from "../util/util.js";
exports.getMusic = (req, res) => {
  // let { id } = req.body;
  const path =
    "https://m7.music.126.net/20210603215250/f29813d418f56f7088e956c5aea627cb/ymusic/6ffd/dd57/24d7/4cd039ba64c6646f4b9e21450b156852.mp3&proxy=http://121.196.226.246:84";
  fetch(path)
    .then((body) => {
      console.log(body);
      responseClient(res, 200, 0, "请求成功", body);
    })
    .catch((error) => {
      responseClient(res, 200, 1, "请求失败", error);
    });
};
