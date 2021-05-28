/**
 * Environment module.
 * @file Environment 环境配置
 * @module environment
 * @author helishou
 */

const environment = process.env.NODE_ENV;
const isDevMode = Object.is(environment, 'development');
const isProdMode = Object.is(environment, 'production');

module.exports = {
	isDevMode,
	isProdMode,
	environment,
};
