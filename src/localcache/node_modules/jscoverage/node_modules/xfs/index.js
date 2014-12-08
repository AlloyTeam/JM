var Fs = require('fs');
var fAsync = require('./lib/async');
var fSync = require('./lib/sync');

var syncFunc = {};
/**
 * extends function from Fs, exclude override
 */
for (var i in Fs) {
  if (Fs.hasOwnProperty(i)) {
    exports[i] = Fs[i];
    if (i.indexOf('Sync') !== -1) {
      syncFunc[i] = Fs[i];
    }
  }
}

syncFunc.save = fSync.writeFile;
syncFunc.mkdir = fSync.mkdir;
syncFunc.rmdir = fSync.rm;
syncFunc.rm = fSync.rm;

/**
 * rmdir 递归删除目录，异步回调
 *         支持dir / file删除, 如果文件不存在，则默认删除成功
 * @param path    file path
 * @param callback
 */
exports.rmdir = fAsync.rm;
exports.rm = fAsync.rm;
/**
 * mkdir 递归的创建目录，异步回调
 *         如果文件目录存在，则默认返回成功
 * @param path
 * @param callback
 */
exports.mkdir = fAsync.mkdir;
/**
 * rename 移动文件,异步回调，支持跨device移动
 * @param {path} src 
 * @param {path} dest 
 * @param {function} cb
 **/
exports.rename = fAsync.mv;
exports.mv = fAsync.mv;

/**
 * save 保存到文件，如果目录不存在自动创建
 * @param {path} path
 * @param {String|Buffer} data
 * @param {Function} cb(err);
 */
exports.save = fAsync.writeFile;
exports.writeFile = fAsync.writeFile;

exports.walk = fAsync.walk;

exports.sync = function () {
  return syncFunc;
};
