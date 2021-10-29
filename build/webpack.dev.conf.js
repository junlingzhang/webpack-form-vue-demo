/**
 * @author zhangjunling
 * @date 2020/9/2/0002 17:28
 */
const {merge} = require("webpack-merge");
const common = require("./webpack.base.conf");

module.exports = merge(common, {
	mode: 'development',
	optimization: {

	},
	module: {
		rules: [
		]
	},
	plugins: [

	]
});