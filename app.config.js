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
	PORT: 8000,
	ROOT_PATH: __dirname,
	NAME: 'helishou',
	URL: 'http://wangxinyang.xyz/main.html',
	FRONT_END_PATH: path.join(__dirname, '..', 'helishou'),
};

exports.CROSS_DOMAIN = {
	allowedOrigins: [
		'http://wangxinyang.xyz/main.html',
		'http://wangxinyang.xyz',
		'https://github.com/helishou',
	],
	allowedReferer: 'helishou',
};

exports.MONGODB = {
	uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/blogNode`,
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password',
};
exports.AUTH = {
	data: argv.auth_data || { user: 'root' },
	jwtTokenSecret: argv.auth_key || 'blog-node',
	defaultPassword: argv.auth_default_password || 'root',
};

exports.EMAIL = {
	account: argv.email_account || 'your email address like : i@helishou',
	password: argv.email_password || 'your email password',
	from: 'https://github.com/helishou',
	admin: 'helishou',
};

exports.AKISMET = {
	key: argv.akismet_key || 'your akismet Key',
	blog: argv.akismet_blog || 'your akismet blog site, like: http://helishou.cn/main.html',
};

exports.GITHUB = {
	username: 'helishou',
	oauth_uri: 'https://github.com/login/oauth/authorize',
	access_token_url: 'https://github.com/login/oauth/access_token',
	// 获取 github 用户信息 url // eg: https://api.github.com/user?access_token=****&scope=&token_type=bearer
	user_url: 'https://api.github.com/user',

	// 请把生产环境的 redirect_url，client_id 和 client_secret 中的 "****", 换成自己创建的 OAuth App 的具体参数即可。
	// // 生产环境
	redirect_uri: "http://wangxinyang.xyz/login",
	client_id: "eeb6852852645a7bc976",
	client_secret: "22e834508732cf7720884db5cd939e1f33a3f4e9",

	// 开发环境 （参数可以直接用，公供测试）
// 	redirect_url: "http://localhost:3001/login",
//   client_id: "502176cec65773057a9e",
// 	client_secret: "65d444de381a026301a2c7cffb6952b9a86ac235",
	
};

exports.ALIYUN = {
	ip: argv.aliyun_ip_auth,
};

exports.BAIDU = {
	site: argv.baidu_site || 'your baidu site domain like : helishou',
	token: argv.baidu_token || 'your baidu seo push token',
};

exports.QINIU = {
	accessKey: argv.qn_accessKey || 'your access key',
	secretKey: argv.qn_secretKey || 'your secret key',
	bucket: argv.qn_bucket || 'your bucket name',
	origin: argv.qn_origin || 'http://nodepress.u.qiniudn.com',
	uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/',
};

exports.INFO = {
	// name: package.name,
	// version: package.version,
	// author: package.author,
	// site: exports.APP.URL,
	github: 'https://github.com/helishou',
	powered: ['react', 'Nodejs', 'MongoDB', 'Express', 'Nginx'],
};
