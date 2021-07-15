/*
 * @Author       : helishou
 * @Date         : 2021-07-15 12:21:17
 * @LastEditTime : 2021-07-15 12:27:53
 * @LastEditors  : helishou
 * @Description  : 服务端渲染
 * @FilePath     : \routes\ssr.js
 * 你用你的指尖,阻止我说再见,在bug完全失去之前
 */

// 关于react
import React from 'react';
import { StaticRouter } from 'react-router-dom';//react的路由换成这个
import { renderToString } from 'react-dom/server';//这个是渲染react组件的
import Home from './ssr/home';//这个是首页，需要渲染的页面
// //关于koa
// // 关于node
import fs from 'fs';
import path from 'path';

exports.ssr = async (ctx) => {
    //我也不知道这个context是干什么用的
    const context = {};
    //把你react App组件内的东西放到这里来！你可以尝试直接返回出结果，就是root内容
    const reactAppString = await renderToString(
        (
            <div className="App">
                <h1>react-example</h1>
                <StaticRouter
                    location={ctx.url}
                    context={context}
                >
                    <Home />
                </StaticRouter>
            </div>
        )
    );
    //indexFile先把文件读取出来
    const indexFile = await path.resolve(__dirname + 'build/index.html').replace('server', '');
    const data = await fs.readFileSync(indexFile, 'utf8', function (err, data) {
        return data;
    });
    //替换root内容为之前的reactAppString
    let dataReplaced = await data.replace('<div id="root"></div>', `<div id="root">${reactAppString}</div>`);
    console.log(dataReplaced)
    //最后返回出去
    ctx.body = dataReplaced;
}