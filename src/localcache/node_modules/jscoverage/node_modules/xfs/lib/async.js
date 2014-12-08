var Fs = require('fs');
var Path = require('path');

exports.rm = rm;
exports.mkdir = mkdir;
exports.mv = mv;
exports.save = writeFile;
exports.writeFile = writeFile;
exports.walk = walk;

/**
 * ========================================
 * remove file/dir
 * equal: rm -rf /a/b/c
 * @param  {String}   path  file or dir
 * @param  {Function} cb(err|null)
 */
function rm(path, cb) {

  Fs.readdir(path, function (e, files) {
    if (e) {
      if (e.code === 'ENOENT') {
        cb(null);
      } else if (e.code === 'ENOTDIR') {
        Fs.unlink(path, cb);
      } else {
        cb(e);
      }
      return;
    }
    var len = files.length;

    if (!len) {
      return Fs.rmdir(path, cb);
    }
    var count = 0;
    var tmp_path = Path.join(path, files[count]);
    _delFile(tmp_path, function _delcb(err) {
      if (err) {
        return cb(err);
      }
      count ++;
      if (count === len) {
        //finish dir child delete , then delete dir itself
        Fs.rmdir(path, function (err) {
          if (err && err.code === 'ENOENT') {
            return cb(null);
          }
          cb(err);
        });
        return;
      }
      tmp_path = Path.join(path, files[count]);
      _delFile(tmp_path, _delcb);
    });
  });
  function _delFile(path, cb) {
    Fs.stat(path, function (e, st) {
      if (e) {
        return cb(e);
      }
      if (st.isDirectory()) {
        rm(path, cb);
      } else if (st.isFile()) {
        Fs.unlink(path, function (err) {
          if (err && err.code === 'ENOENT') {
            return cb(null);
          }
          cb(err);
        });
      }
    });
  }
}
/**
 * mkdir
 * ================================
 * equal  mkdir -p path
 * @return {[type]} [description]
 */
function mkdir(path, mode, callback) {
  if (callback === undefined) {
    callback = mode;
    mode = 0755;
  }
  if (!path) {
    return callback(new Error('path not found'));
  }
  // take of ../ ./
  path = Path.normalize(path);
  path = path.replace(/\\/g, '/').replace(/\/$/, '');

  var arr = [];
  _test(path, function (err, arr) {
    if (err) {
      callback(err);
    } else if (arr.length) {
      _mk(arr, arr.length - 1, callback);
    } else {
      callback();
    }
  });
  //check path
  function _test(path, cb) {
    Fs.stat(path, function (err, stat) {
      if (err) {
        if (err.code === 'ENOENT') {
          arr.push(path);
          path = Path.dirname(path);
          if (path == '.' || path == '..') {
            return cb(null, arr);
          }
          _test(path, cb);
        } else {
          cb(err);
        }
      } else if (stat.isFile()) {
        cb(new Error('file with same name alrady exist!', path));
      } else {
        cb(null, arr);
      }
    });
  }
  function _mk(arr, i, cb) {
    var p = arr[i];
    Fs.mkdir(p, mode, function (err) {
      if (err && err.code !== 'EEXIST') {
        cb(err);
      } else {
        if (i === 0) return cb(null);
        i --;
        _mk(arr, i, cb);
      }
    });
  }
}
/**
 * move file cross different device
 * @param  {[type]}   src  [description]
 * @param  {[type]}   dest [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
function mv(src, dest, cb) {
  Fs.rename(src, dest, function (err) {
    if (err) {
      // test if err is called by cross device rename
      if (err.code === "UNKNOW" || err.code === "ENOENT" || err.code === "EXDEV") {
        var _src, _dest;
        try {
          _src = Fs.createReadStream(src);
          _dest = Fs.createWriteStream(dest);
        } catch (e) {
          return cb(e);
        }
        _src.on('end', function () {
          Fs.unlink(src, function (err) {
            cb(err);
          });
        });
        _src.pipe(_dest);
      } else {
        cb(err);
      }
    } else {
      cb(null);
    }
  });
}

function writeFile(path, data, cb) {
  var dir = Path.dirname(path);
  mkdir(dir, function (err) {
    if (err) {
      cb(err);
    } else {
      Fs.writeFile(path, data, cb);
    }
  });
}
/**
 * [walk description]
 * @param  {Path}   path [description]
 * @param  {RegExp}   expr file match this expr will pass to
 * @param  {Function} cb  (err, stat, done)
 * @return {[type]}        [description]
 */
function walk(path, expr, cb, done, _each) {
  if (typeof expr === 'function') {
    done = cb;
    cb = expr;
    expr = null;
  }
  Fs.stat(path, function (err, stat) {
    if (err) {
      return cb(err, null, _each ? _each : function () {});
    }
    if (stat.isDirectory()) {
      Fs.readdir(path, function (err, flist) {
        if (err) {
          return cb(err);
        }
        var len = flist.length;
        var count = 0;
        function each() {
          if (count >= len) {
            return done();
          }
          walk(Path.join(path, flist[count]), expr, cb, function () {
            if (count >= len) {
              return done();
            } else {
              each();
            }
          }, each);
          count ++;
        }
        each();
      });
    } else if(stat.isFile()) {
      if (expr) {
        if (expr.test(path)) {
          cb(null, path, _each);
        } else {
          _each();
        }
      } else {
        cb(null, path, _each);
      }
    }
  });
}
