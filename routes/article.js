import Article from "../models/article";
import User from "../models/user";
import { responseClient, timestampToTime } from "../util/util";
const imgSpider = require("../util/imgSpider");
var fs = require("fs");

let src = "/www/wwwroot/blog/cloudDisk/";
//图片目录
/**
 * @description : 将网络图片存到服务器
 * @param        {string} url
 * @return       {string} newWebp
 */
 const imgSaver = (url) => {
  let newWebp
  let tempUrl = url.split("/");
  tempUrl = tempUrl[tempUrl.length - 1];
  let exit = false;
  console.log("tempUrl", src + tempUrl);
  // 检测服务器是否存在这个图片，如果存在返回原来url
  fs.access(src + tempUrl, fs.constants.F_OK, (err) => {
    if (err) {
      exit=true
      console.log("不存在路径", src + tempUrl);
      newWebp =
        "https://www.wangxinyang.xyz/cloudDisk/" + tempUrl + ".webp";
      imgSpider(url, src); //服务器的保存目录I是大写
      if (tempUrl.indexOf("small") != -1) {
        //说明可以放大
        let newImgUrl = url.replace("small", "");
        newImgUrl = newImgUrl.slice(0, newImgUrl.length - 14) + ".jpg";
        imgSpider(newImgUrl, src);
      }
      return newWebp;
    } else {
      return url;
    }
  });
  return exit?url:newWebp
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
  try {
    fs.stat(src + tempUrl);
    //如果可以执行到这里那么就表示存在了
    try {
      fs.unlink(src + tempUrl);
      fs.unlink(src + tempUrl.slice(0, tempUrl.length - 5));
    } catch (e) {}
    if (tempUrl.indexOf("small") != -1) {
      //说明可以放大
      let newImgUrl = tempUrl.replace("small", "");
      newImgUrl = newImgUrl.slice(0, 32) + ".jpg";
      try {
        fs.unlink(src + newImgUrl);
        fs.unlink(src + newImgUrl + ".webp");
      } catch (e) {}
    }
  } catch (e) {
    // 不存在
    console.log(e);
  }
};

exports.addArticle = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }
  const {
    title,
    author,
    keyword,
    content,
    desc,
    img_url,
    tags,
    category,
    state,
    type,
    origin,
  } = req.body;
  try {
    img_url = imgSaver(img_url);
  } catch (e) {
    console.log("webp转换失败");
  }
  let tempArticle = null;
  if (img_url) {
    tempArticle = new Article({
      title,
      author,
      keyword: keyword ? keyword.split(",") : [],
      content,
      numbers: content.length,
      desc,
      img_url,
      tags: tags ? tags.split(",") : [],
      category: category ? category.split(",") : [],
      state,
      type,
      origin,
    });
  } else {
    tempArticle = new Article({
      title,
      author,
      keyword: keyword ? keyword.split(",") : [],
      content,
      numbers: content.length,
      desc,
      tags: tags ? tags.split(",") : [],
      category: category ? category.split(",") : [],
      state,
      type,
      origin,
    });
  }

  tempArticle
    .save()
    .then((data) => {
      // let article = JSON.parse(JSON.stringify(data));
      // console.log('article :', article);
      // article.create_time = timestampToTime(article.create_time);
      // article.update_time = timestampToTime(article.update_time);
      // console.log('timestampToTime :', timestampToTime(data.create_time));
      responseClient(res, 200, 0, "保存成功", data);
    })
    .catch((err) => {
      console.log(err);
      responseClient(res);
    });
};

exports.updateArticle = (req, res) => {
  // if (!req.session.userInfo) {
  //   console.log(req.session);
  //   responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
  //   return;
  // }
  const {
    title,
    author,
    keyword,
    content,
    desc,
    img_url,
    tags,
    category,
    state,
    type,
    origin,
    id,
  } = req.body;
  try {
    img_url = imgSaver(img_url);
  } catch (e) {
    console.log("22");
  }
  console.log("continue");
  console.log(img_url);
  Article.update(
    { _id: id },
    {
      title,
      author,
      keyword: keyword ? keyword.split(",") : [],
      content,
      desc,
      img_url,
      tags: tags ? tags.split(",") : [],
      category: category ? category.split(",") : [],
      state,
      type,
      origin,
      update_time: Date.now(),
    }
  )
    .then((result) => {
      responseClient(res, 200, 0, "操作成功", result);
    })
    .catch((err) => {
      console.error(err);
      responseClient(res);
    });
};

exports.delArticle = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }
  let { id } = req.body;
  Article.find(
    { _id: id },
    {
      img_url: 1,
    },
    (error, result) => {
      for (let i = 0; i < result.length; i++) {
        // s删除服务器上的图
        imgDelete(result[i].img_url);
      }
    }
  );
  Article.deleteMany({ _id: id })
    .then((result) => {
      if (result.n === 1) {
        responseClient(res, 200, 0, "删除成功!");
      } else {
        responseClient(res, 200, 1, "文章不存在");
      }
    })
    .catch((err) => {
      console.error("err :", err);
      responseClient(res);
    });
};

// 前台文章列表
exports.getArticleList = (req, res) => {
  let keyword = req.query.keyword || null;
  let state = req.query.state || "";
  let type = req.query.type || 1;
  let likes = req.query.likes || "";
  let origin = req.query.origin || null;
  let tag_id = req.query.tag_id || "";
  let category_id = req.query.category_id || "";
  let article = req.query.article || "";
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  // 如果是文章归档 返回全部文章
  if (article) {
    pageSize = 1000;
  }
  let conditions = {};
  let stateCondition = {};
  if (!state) {
    if (keyword) {
      const reg = new RegExp(keyword, "i"); //不区分大小写
      conditions = {
        $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
      };
    }
  } else if (state) {
    state = parseInt(state);
    stateCondition = { state };
    if (keyword) {
      const reg = new RegExp(keyword, "i");
      conditions = {
        $and: [
          { $or: [{ state: state }] },
          {
            $or: [
              { title: { $regex: reg } },
              { desc: { $regex: reg } },
              { keyword: { $regex: reg } },
            ],
          },
        ],
      };
    } else {
      conditions = { state };
    }
  }
  if (category_id) {
    // console.log('category_id :', category_id);
    // 根据 分类 id 返回数据
    conditions = { $and: [{ category: category_id }, conditions] };
  }
  //根据 type 返回数据
  conditions = { $and: [{ type: type }, conditions] };
  // console.log("conditions", conditions);
  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };
  Article.countDocuments(stateCondition, (err, count) => {
    if (err) {
      console.log("Error:" + err);
    } else {
      responseData.count = count;
      // 待返回的字段
      let fields = {
        title: 1,
        desc: 1,
        img_url: 1,
        tags: 1,
        category: 1,
        meta: 1,
        create_time: 1,
        origin: 1,
      };
      if (article) {
        fields = {
          title: 1,
          create_time: 1,
        };
      }
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
      };
      Article.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error("Error:" + error);
          // throw error;
        } else {
          let newList = [];
          if (likes) {
            // 根据热度 likes 返回数据
            result.sort((a, b) => {
              return b.meta.likes - a.meta.likes;
            });
            responseData.list = result;
          }
          // else if (category_id) {
          //   // console.log('category_id :', category_id);
          //   // 根据 分类 id 返回数据
          //   result.forEach((item) => {
          //     if (item.category.indexOf(category_id) > -1) {
          //       newList.push(item);
          //     }
          //   });
          //   let len = newList.length;
          //   responseData.count = len;
          //   responseData.list = newList;
          // }
          else if (tag_id) {
            // console.log('tag_id :', tag_id);
            // 根据标签 id 返回数据
            result.forEach((item) => {
              if (item.tags.indexOf(tag_id) > -1) {
                newList.push(item);
              }
            });
            let len = newList.length;
            responseData.realcount = len;
            responseData.list = newList;
          } else if (origin !== null) {
            // console.log('tag_id :', tag_id);
            // 根据标签 id 返回数据
            result.forEach((item) => {
              if (item.origin == origin) {
                newList.push(item);
              }
            });
            let len = newList.length;
            responseData.realcount = len;
            responseData.list = newList;
          } else if (article) {
            const archiveList = [];
            let obj = {};
            // 按年月份归档 文章数组
            result.forEach((e) => {
              let year = e.create_time.getFullYear();
              let month = e.create_time.getMonth();
              let yearMonth = parseInt(year + "" + month);
              if (!obj[yearMonth]) {
                obj[yearMonth] = [];
                obj[yearMonth].push(e);
              } else {
                obj[yearMonth].push(e);
              }
            });
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                let item = {};
                item.yearMonth = key;
                item.list = element;
                archiveList.push(item);
              }
            }
            archiveList.sort((a, b) => {
              return b.yearMonth - a.yearMonth;
            });
            responseData.list = archiveList;
          } else {
            responseData.list = result;
          }
          responseData.realcount = responseData.list.length;
          responseClient(res, 200, 0, "操作成功！", responseData);
        }
      })
        .populate([{ path: "category" }])
        .exec((err, doc) => {
          // console.log("doc:");          // aikin
          // console.log("doc.tags:",doc.tags);          // aikin
          // console.log("doc.category:",doc.category);           // undefined
        });
    }
  });
};

// 后台文章列表
exports.getArticleListAdmin = (req, res) => {
  let keyword = req.query.keyword || null;
  let state = req.query.state || "";
  let likes = req.query.likes || "";
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {};
  if (!state) {
    if (keyword) {
      const reg = new RegExp(keyword, "i"); //不区分大小写
      conditions = {
        $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
      };
    }
  } else if (state) {
    state = parseInt(state);
    if (keyword) {
      const reg = new RegExp(keyword, "i");
      conditions = {
        $and: [
          { $or: [{ state: state }] },
          {
            $or: [
              { title: { $regex: reg } },
              { desc: { $regex: reg } },
              { keyword: { $regex: reg } },
            ],
          },
        ],
      };
    } else {
      conditions = { state };
    }
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };
  Article.countDocuments({}, (err, count) => {
    if (err) {
      console.log("Error:" + err);
    } else {
      responseData.count = count;
      // 待返回的字段
      let fields = {
        title: 1,
        author: 1,
        keyword: 1,
        // content: 1,
        desc: 1,
        img_url: 1,
        tags: 1,
        category: 1,
        state: 1,
        type: 1,
        origin: 1,
        comments: 1,
        like_User_id: 1,
        meta: 1,
        create_time: 1,
        // update_time: 1,
      };
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
      };
      Article.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error("Error:" + error);
          // throw error;
        } else {
          if (likes) {
            result.sort((a, b) => {
              return b.meta.likes - a.meta.likes;
            });
          }
          responseData.list = result;
          responseClient(res, 200, 0, "操作成功！", responseData);
        }
      })
        .populate([
          { path: "tags" },
          { path: "comments" },
          { path: "category" },
        ])
        .exec((err, doc) => {
          // console.log("doc:");          // aikin
          // console.log("doc.tags:",doc.tags);          // aikin
          // console.log("doc.category:",doc.category);           // undefined
        });
    }
  });
};

// 文章点赞
exports.likeArticle = (req, res) => {
  if (!req.session.userInfo) {
    console.log(req.session);
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }
  let { id, user_id } = req.body;
  Article.findOne({ _id: id })
    .then((data) => {
      let fields = {};
      data.meta.likes = data.meta.likes + 1;
      fields.meta = data.meta;
      let like_users_arr = data.like_users.length ? data.like_users : [];
      User.findOne({ _id: user_id })
        .then((user) => {
          let new_like_user = {};
          new_like_user.id = user._id;
          new_like_user.name = user.name;
          new_like_user.avatar = user.avatar;
          new_like_user.create_time = user.create_time;
          new_like_user.type = user.type;
          new_like_user.introduce = user.introduce;
          like_users_arr.push(new_like_user);
          fields.like_users = like_users_arr;
          Article.update({ _id: id }, fields)
            .then((result) => {
              responseClient(res, 200, 0, "操作成功！", result);
            })
            .catch((err) => {
              console.error("err :", err);
              throw err;
            });
        })
        .catch((err) => {
          responseClient(res);
          console.error("err 1:", err);
        });
    })
    .catch((err) => {
      responseClient(res);
      console.error("err 2:", err);
    });
};

// 文章详情
exports.getArticleDetailByType = (req, res) => {
  let { type } = req.body;
  if (!type) {
    responseClient(res, 200, 1, "文章不存在 ！");
    return;
  }
  Article.findOne({ type: type }, (Error, data) => {
    if (Error) {
      console.error("Error:" + Error);
      // throw error;
    } else {
      data.meta.views = data.meta.views + 1;
      Article.updateOne({ type: type }, { meta: data.meta })
        .then((result) => {
          responseClient(res, 200, 0, "操作成功 ！", data);
        })
        .catch((err) => {
          console.error("err :", err);
          throw err;
        });
    }
  })
    .populate([
      //通过一个外键与另一张表建立关联
      { path: "tags", select: "-_id" },
      { path: "category", select: "-_id" },
      { path: "comments", select: "-_id" },
    ])
    .exec((err, doc) => {
      // console.log("doc:");          // aikin
      // console.log("doc.tags:",doc.tags);          // aikin
      // console.log("doc.category:",doc.category);           // undefined
    });
};

// 文章详情
exports.getArticleDetail = (req, res) => {
  let { id } = req.body;
  let type = Number(req.body.type) || 1; //文章类型 => 1: 普通文章，2: 项目
  let filter = Number(req.body.filter) || 1; //文章的评论过滤 => 1: 过滤，2: 不过滤
  // console.log('type:', type);
  if (type === 1) {
    if (!id) {
      responseClient(res, 200, 1, "文章不存在 ！");
      return;
    }
    Article.findOne({ _id: id }, (Error, data) => {
      if (Error) {
        console.error("Error:" + Error);
        responseClient(res, 500, 1, Error);
        // throw error;
      } else {
        if (data) {
          data.meta.views = data.meta.views + 1;
          Article.updateOne({ _id: id }, { meta: data.meta })
            .then((result) => {
              // console.log('data:',data)
              if (filter === 1) {
                const arr = data.comments;
                for (let i = arr.length - 1; i >= 0; i--) {
                  const e = arr[i];
                  if (e.state !== 1) {
                    arr.splice(i, 1);
                  }
                  const newArr = e.other_comments;
                  const length = newArr.length;
                  if (length) {
                    for (let j = length - 1; j >= 0; j--) {
                      const item = newArr[j];
                      if (item.state !== 1) {
                        newArr.splice(j, 1);
                      }
                    }
                  }
                }
              }
              responseClient(res, 200, 0, "操作成功 ！", data);
            })
            .catch((err) => {
              console.error("err :", err);
              throw err;
            });
        } else {
          responseClient(res, 200, 1, "文章不存在 ！");
        }
      }
    })
      .populate([{ path: "tags" }, { path: "category" }, { path: "comments" }])
      .exec((err, doc) => {
        // console.log("doc:");          // aikin
        // console.log("doc.tags:",doc.tags);          // aikin
        // console.log("doc.category:",doc.category);           // undefined
      });
  } else {
    Article.findOne({ type: type }, (Error, data) => {
      if (Error) {
        console.log("Error:" + Error);
        // throw error;
      } else {
        data.meta.views = data.meta.views + 1;
        Article.updateOne({ type: type }, { meta: data.meta })
          .then((result) => {
            if (filter === 1) {
              const arr = data.comments;
              for (let i = arr.length - 1; i >= 0; i--) {
                const e = arr[i];
                if (e.state !== 1) {
                  arr.splice(i, 1);
                }
                const newArr = e.other_comments;
                const length = newArr.length;
                if (length) {
                  for (let j = length - 1; j >= 0; j--) {
                    const item = newArr[j];
                    if (item.state !== 1) {
                      newArr.splice(j, 1);
                    }
                  }
                }
              }
            }
            responseClient(res, 200, 0, "操作成功 ！", data);
          })
          .catch((err) => {
            console.error("err :", err);
            throw err;
          });
      }
    })
      .populate([{ path: "tags" }, { path: "category" }, { path: "comments" }])
      .exec((err, doc) => {
        // console.log("doc:");          // aikin
        // console.log("doc.tags:",doc.tags);          // aikin
        // console.log("doc.category:",doc.category);           // undefined
      });
  }
};
