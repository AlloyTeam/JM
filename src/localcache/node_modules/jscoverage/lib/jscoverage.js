/*!
 * jscoverage: lib/jscoverage.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2014-04-03 15:20:13
 * CopyRight 2014 (c) Fish And Other Contributors
 */
var Instrument = require('./instrument');

/**
 * do not exec this function
 * the function body will insert into instrument files
 *
 * _$jscoverage = {
 *   filename : {
 *     line1: 0
 *     line2: 1
 *     line3: undefined
 *     ....
 *     source: [],
 *     condition: [
 *       line_start_offset
 *     ]
 *   }
 * }
 * @covignore
 */
function jscFunctionBody() {
  // instrument by jscoverage, do not modifly this file
  (function (file, lines, conds, source) {
    var BASE;
    if (typeof global === 'object') {
      BASE = global;
    } else if (typeof window === 'object') {
      BASE = window;
    } else {
      throw new Error('[jscoverage] unknow ENV!');
    }
    if (BASE._$jscoverage) {
      BASE._$jscmd(file, 'init', lines, conds, source);
      return;
    }
    var cov = {};
    /**
     * jsc(file, 'init', lines, condtions)
     * jsc(file, 'line', lineNum)
     * jsc(file, 'cond', lineNum, expr, start, offset)
     */
    function jscmd(file, type, line, express, start, offset) {
      var storage;
      switch (type) {
        case 'init':
          if(cov[file]){
            storage = cov[file];
          } else {
            storage = [];
            for (var i = 0; i < line.length; i ++) {
              storage[line[i]] = 0;
            }
            var condition = express;
            var source = start;
            storage.condition = condition;
            storage.source = source;
          }
          cov[file] = storage;
          break;
        case 'line':
          storage = cov[file];
          storage[line] ++;
          break;
        case 'cond':
          storage = cov[file];
          storage.condition[line] ++;
          return express;
      }
    }

    BASE._$jscoverage = cov;
    BASE._$jscmd = jscmd;
    jscmd(file, 'init', lines, conds, source);
  })('$file$', $lines$, $conds$, $source$);
}
/**
 * gen coverage head
 */
function genCodeCoverage(instrObj) {
  if (!instrObj) {
    return '';
  }
  var code = [];
  var filename = instrObj.filename;
  // Fix windows path
  filename = filename.replace(/\\/g, '/');
  var lines = instrObj.lines;
  var conditions = instrObj.conds;
  var src = instrObj.source;
  var jscfArray = jscFunctionBody.toString().split('\n');
  jscfArray = jscfArray.slice(1, jscfArray.length - 1);
  var ff = jscfArray.join('\n').replace(/(^|\n) {2}/g, '\n')
    .replace(/\$(\w+)\$/g, function (m0, m1){
      switch (m1) {
        case 'file':
          return filename;
        case 'lines':
          return JSON.stringify(lines);
        case 'conds':
          return JSON.stringify(conditions);
        case 'source':
          return JSON.stringify(src);
      }
    });
  code.push(ff);
  code.push(instrObj.code);
  return code.join('\n');
}

exports.process = function (filename, content) {
  if (!filename) {
    throw new Error('jscoverage.process(filename, content), filename needed!');
  }
  filename = filename.replace(/\\/g, '/');
  if (!content) {
    return '';
  }
  var pwd = process.cwd();
  var fname;
  if (filename.indexOf(pwd) === 0) {
    fname = filename.substr(pwd.length + 1);
  } else {
    fname = filename;
  }
  var instrObj;
  var ist = new Instrument();
  instrObj = ist.process(fname, content);
  return genCodeCoverage(instrObj);
};
