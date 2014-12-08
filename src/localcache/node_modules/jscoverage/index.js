/*!
 * jscoverage: index.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2014-04-03 15:20:13
 * CopyRight 2014 (c) Fish And Other Contributors
 *
 */
require('coffee-script').register();
var debug = require('debug')('jscoverage');
var fs = require('xfs');
var path = require('path');
var argv = require('optimist').argv;
var patch = require('./lib/patch');
var rptUtil = require('./reporter/util');
var cmd = argv['$0'];
var MODE_MOCHA = false;
process.__MOCHA_PREPARED = false;
var FLAG_LOCK = false;
if (/mocha/.test(cmd)) {
  MODE_MOCHA = true;
}

if (MODE_MOCHA) {
  prepareMocha();
}
var COV_REPORT_NAME = argv.name || 'jscoverage reporter';
/**
 * prepare env for mocha test
 * @covignore
 */
function prepareMocha() {
  var covIgnore = argv.covignore;
  var cwd = process.cwd();
  var covlevel = argv.coverage;
  if (process.__MOCHA_PREPARED) {
    return;
  }
  process.__MOCHA_PREPARED = true;
  if (covlevel) {
    var tmp = covlevel.split(',');
    covlevel = {
      high: parseInt(tmp[0], 10) / 100,
      middle: parseInt(tmp[1], 10) / 100,
      low: parseInt(tmp[2], 10) / 100
    };
  } else {
    covlevel = {
      high: 0.9,
      middle: 0.7,
      low: 0.3
    };
  }
  debug('covlevel', covlevel);
  /**
   * add after hook
   * @return {[type]} [description]
   */
  var supportReporters = ['list', 'spec', 'tap'];
  process.nextTick(function () {
    try {
      after(function () {
        if (FLAG_LOCK) {
          return;
        }
        FLAG_LOCK = true;
        if (typeof _$jscoverage === 'undefined') {
          return;
        }
        try {
          if (argv.covout === 'none') {
            return;
          }
          if (!argv.covout) {
            var mochaR = argv.reporter || argv.R;
            if (supportReporters.indexOf(mochaR) !== -1) {
              argv.covout = mochaR;
            } else {
              argv.covout = 'list';
            }
          }
          var reporter;
          if (/^\w+$/.test(argv.covout)) {
            reporter = require('./reporter/' + argv.covout);
          } else {
            reporter = require(argv.covout);
          }
          reporter.process(_$jscoverage, exports.coverageStats(), covlevel, COV_REPORT_NAME, rptUtil);
        } catch (e) {
          console.error('jscoverage reporter error', e, e.stack);
        }
      });
    } catch (e) {
      // do nothing
    }
  });
  if (argv.covinject) {
    debug('covinject enabled');
    patch.enableInject(true);
  }
  if (!covIgnore) {
    try {
      var stat = fs.statSync('.covignore');
      stat && (covIgnore = '.covignore');
      debug('.covignore file found!');
    } catch (e) {
      return;
    }
  }
  try {
    covIgnore = fs.readFileSync(covIgnore).toString().split(/\r?\n/g);
    debug('loading .covignore file!');
  } catch (e) {
    throw new Error('jscoverage loading covIgnore file error:' + covIgnore);
  }
  var _ignore = [];
  covIgnore.forEach(function (v, i, a) {
    if (!v) {
      return;
    }
    if (v.indexOf('/') === 0) {
      v = '^' + cwd + v;
    }
    _ignore.push(new RegExp(v.replace(/\./g, '\\.').replace(/\*/g, '.*')));
  });

  patch.setCovIgnore(_ignore, argv.overrideIgnore ? true : false);
}

var jscoverage = require('./lib/jscoverage');

/**
 * enableInject description
 * @param {Boolean} true or false
 */
exports.enableInject = patch.enableInject;
/**
 * config the inject function names
 * @param  {Object} obj  {get, replace, call, reset}
 * @example
 *
 *  jsc.config({get:'$get', replace:'$replace'});
 *
 *  =====================
 *
 *  testMod = require('testmodule');
 *  testMod.$get('name');
 *  testMod.$replace('name', obj);
 */
exports.config = function (obj) {
  var inject_functions = patch.getInjectFunctions();
  for (var i in obj) {
    inject_functions[i] = obj[i];
  }
};
/**
 * process Code, inject the coverage code to the input Code string
 * @param {String} filename  jscoverage file flag
 * @param {Code} content
 * @return {Code} instrumented code
 */
exports.process = jscoverage.process;

/**
 * processFile, instrument singfile
 * @sync
 * @param  {Path} source  absolute Path
 * @param  {Path} dest    absolute Path
 * @param  {Object} option  [description]
 */
exports.processFile = function (source, dest, option) {
  var content;
  var stats;
  // test source is file or dir, or not a file
  try {
    stats = fs.statSync(source);
    if (stats.isDirectory()) {
      throw new Error('path is dir');
    } else if (!stats.isFile()) {
      throw new Error('path is not a regular file');
    }
  } catch (e) {
    throw new Error('source file error' + e);
  }

  fs.sync().mkdir(path.dirname(dest));

  content = fs.readFileSync(source).toString();
  var sheBang = false;
  if (content.charCodeAt(0) === 65279) {
    content = content.substr(1);
  }
  // cut the shebang
  if (content.indexOf('#!') === 0) {
    var firstLineEnd = content.indexOf('\n');
    sheBang = content.substr(0, firstLineEnd + 1);
    content = content.substr(firstLineEnd + 1);
  }
  // check if coffee script
  var ext = path.extname(source);
  if (ext === '.coffee' || ext === '.litcoffee') {
    var CoffeeScript = require('coffee-script');
    content = CoffeeScript.compile(content, {
      filename: source
    });
  }
  content = this.process(source, content);
  if (sheBang) {
    content = sheBang + content;
  }
  fs.writeFileSync(dest, content);
};

function fixData(num) {
  return Math.round(num * 10000) / 10000;
}
/**
 * sum the coverage rate
 * @public
 */
exports.coverageStats = function () {
  var file;
  var tmp;
  var lineTotal;
  var lineHits;
  var branchTotal;
  var branchHits;
  var n, len;
  var stats = {};
  var branches, branchesMap, branch;
  var line, start, offset;
  if (typeof _$jscoverage === 'undefined') {
    return;
  }
  for (var i in _$jscoverage) {
    file = i;
    tmp = _$jscoverage[i];
    if (!tmp.length) {
      continue;
    }
    // reset the counters;
    lineTotal = lineHits = 0;
    branchTotal = branchHits = 0;

    for (n = 0, len = tmp.length; n < len; n++) {
      if (tmp[n] !== undefined) {
        lineTotal ++;
        if (tmp[n] > 0) {
          lineHits ++;
        }
      }
    }
    // calculate the branches coverage
    branches = tmp.condition;
    branchesMap = {};
    for (n in branches) {
      if (branches[n] === 0) {
        branch = n.split('_');
        line = branch[0];
        start = parseInt(branch[1], 10);
        offset = parseInt(branch[2], 10);
        if (!branchesMap[line]) {
          branchesMap[line] = [];
        }
        branchesMap[line].push([start, offset]);
      } else {
        branchHits ++;
      }
      branchTotal ++;
    }
    stats[file] = {
      lineSloc: lineTotal,
      lineHits: lineHits,
      lineCoverage: lineTotal ? fixData(lineHits / lineTotal) : 1,
      branchSloc: branchTotal,
      branchHits: branchHits,
      branchCoverage: branchTotal ? fixData(branchHits / branchTotal) : 1,
      branches: branchesMap
    };
  }
  return stats;
};

/**
 * get lcov report
 * @return {[type]} [description]
 */
exports.getLCOV = function () {
  var tmp;
  var total;
  var touched;
  var n, len;
  var lcov = '';
  if (typeof _$jscoverage === 'undefined') {
    return;
  }
  Object.keys(_$jscoverage).forEach(function (file) {
    lcov += 'SF:' + file + '\n';
    tmp = _$jscoverage[file];
    if (!tmp.length) {
      return;
    }
    total = touched = 0;
    for (n = 0, len = tmp.length; n < len; n++) {
      if (tmp[n] !== undefined) {
        lcov += 'DA:' + n + ',' + tmp[n] + '\n';
        total ++;
        if (tmp[n] > 0) {
          touched++;
        }
      }
    }
    lcov += 'end_of_record\n';
  });
  return lcov;
};
