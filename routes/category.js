/*
 * @Author       : helishou
 * @Date         : 2021-05-26 19:46:35
 * @LastEditTime : 2021-06-15 21:01:18
 * @LastEditors  : helishou
 * @Description  : 目录
 * @FilePath     : d:\desk\sakura\express\routes\category.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */
import { responseClient } from '../util/util';
import Category from '../models/category';

//获取全部分类
exports.getCategoryList = (req, res) => {
  let keyword = req.query.keyword || null;
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  let conditions = {};
  if (keyword) {
    const reg = new RegExp(keyword, 'i');
    conditions = {
      $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }],
    };
  }
  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };
  Category.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error:' + err);
    } else {
      responseData.count = count;
      let fields = { name: 1, desc: 1, create_time: 1 }; // 待返回的字段
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
      };
      Category.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error('Error:' + error);
          // throw error;
        } else {
          responseData.list = result;
          responseClient(res, 200, 0, 'success', responseData);
        }
      });
    }
  });
};
exports.addCategory = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }
  let { name, desc } = req.body;
  Category.findOne({
    name,
  })
    .then(result => {
      if (!result) {
        let category = new Category({
          name,
          desc,
        });
        category
          .save()
          .then(data => {
            responseClient(res, 200, 0, '添加成功', data);
          })
          .catch(err => {
            throw err;
          });
      } else {
        responseClient(res, 200, 1, '该分类已存在');
      }
    })
    .catch(err => {
      console.error('err :', err);
      responseClient(res);
    });
};
exports.delCategory = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, "您还没登录,或者登录信息已过期，请重新登录！");
    return;
  }
  let { id } = req.body;
  Category.deleteMany({ _id: id })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, 0, '操作成功!');
      } else {
        responseClient(res, 200, 1, '分类不存在');
      }
    })
    .catch(err => {
      console.error('err :', err);
      responseClient(res);
    });
};
