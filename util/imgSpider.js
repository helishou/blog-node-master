/*
 * @Author       : helishou
 * @Date         : 2021-07-13 23:46:18
 * @LastEditTime : 2021-07-14 00:58:30
 * @LastEditors  : helishou
 * @Description  :
 * @FilePath     : f:\桌面\front do\blog-node-master\blog-node-master\util\imgSpider.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
const fs = require("fs");
const http = require("http");
// const { url } = require('inspector')
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
const cookie =
  "__yjs_duid=1_e78758ba8eb8abdc4912b53e67d9eba71622563085537; yjs_js_security_passport=930696995000b6c7c36e98e1602f28fb4cbca4f2_1626193598_js";
const host = "img.netbian.com";
/**
 * 图片下载器
 * @param {string} url - 图片的网络地址
 * @param {string} dest - 保存图片的地址
 * @param {number} timeout - 超时时间，默认 3 分钟
 * @param {number} retries - 重试次数，默认重试 2 次
 */
function imgSpider(url, dest = "", timeout = 1000 * 3 * 60, retries = 2) {
  dest = dest + url.split("file")[1].split("/")[3];
  let isRetry = false;
  let req = http.request(url, (res) => res.pipe(fs.createWriteStream(dest)));
  req.setTimeout(timeout, () => {
    req.abort();
    isRetry = true;
  });
  req.setHeader("User-Agent", userAgent);
  // req.setHeader('Referer', url)
  req.setHeader("Cookie", cookie);
  req.setHeader("Host", host);
  // console.log(req)
  req.on("error", () => {
    isRetry = true;
  });
  req.on("close", () => {
    // 重试时，将超时时间递增 1 分钟
    if (isRetry && retries > 0)
      pictureDownloader(url, dest, timeout + 60 * 1000, retries - 1);
  });
  req.end();
}
imgSpider(
  "http://img.netbian.com/file/2021/0708/small328c217f576e240194847ad9c56e73741625753341.jpg"
);
// request('http://img.netbian.com/file/2021/0708/small328c217f576e240194847ad9c56e73741625753341.jpg').pipe(fs.createWriteStream('doodle.jpg'))
