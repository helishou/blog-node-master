/*
 * @Author: helishou 
 * @Date: 2021-05-31 10:33:14 
 * @Last Modified by:   helishou 
 * @Last Modified time: 2021-05-31 10:33:14 
 */

const path = require('path');
const { argv } = require('yargs');
// const package = require('package')

exports.APP = {
	LIMIT: 10,
	PORT: 3000,
	ROOT_PATH: __dirname,
	NAME: 'helishou',
	URL: 'https://wangxinyang.xyz/main.html',
	FRONT_END_PATH: path.join(__dirname, '..', 'helishou'),
};

exports.STOREDIR={
	IMAGE:"/www/wwwroot/blog/cloudDisk/"
}
exports.MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/blogNode`,
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password',
};



exports.GITHUB = {
	username: 'helishou',
	oauth_uri: 'https://github.com/login/oauth/authorize',
	access_token_url: 'https://github.com/login/oauth/access_token',
	// 获取 github 用户信息 url // eg: https://api.github.com/user?access_token=****&scope=&token_type=bearer
	user_url: 'https://api.github.com/user',
	redirect_uri: "https://wangxinyang.xyz/login",
	client_id: "51854bed29b55e611d18",
	client_secret: "fab69f559b39a49929102ad67acf0f89d1c6720c",

	// 开发环境 （参数可以直接用，公供测试）
// 	redirect_url: "http://localhost:3001/login",
//   client_id: "502176cec65773057a9e",
// 	client_secret: "65d444de381a026301a2c7cffb6952b9a86ac235",
	
};

exports.INFO = {
	// name: package.name,
	// version: package.version,
	// author: package.author,
	// site: exports.APP.URL,
	github: 'https://github.com/helishou',
	powered: ['react', 'Nodejs', 'MongoDB', 'Express', 'Nginx'],
};
