/*!
 * jscoverage: reporter/summary.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2014-04-10 16:23:23
 * CopyRight 2014 (c) Fish And Other Contributors
 */

/**
 * summary reporter
 * @param  {[type]} _$jscoverage coverage object
 * @param  {[type]} stats        coverage stats
 * @param  {Object} covmin       coverage level {high, middle, low}
 */
exports.process = function (_$jscoverage, stats, covlevel, name, utils) {
  var arr = [];
  var files = Object.keys(stats);
  var colorful = utils.colorful;
  var maxFileName = maxStr(files);
  files.forEach(function (file) {
    var coverage = stats[file].lineCoverage;
    var type;
    if (coverage >= covlevel.high) {
      type = 'GREEN';
    } else if (coverage >= covlevel.middle) {
      type = null;
    } else if (coverage >= covlevel.low) {
      type = 'YELLOW';
    } else {
      type = 'RED';
    }
    var msg =
      'Coverage ' + fillStr(file, maxFileName) +
        ' line[' + colorful(formatPercent(stats[file].lineCoverage), type) + '] ' +
        ' branch[' + colorful(formatPercent(stats[file].branchCoverage), type) + ']';
    msg = '  ' + colorful('\u204D', type) + ' ' +  colorful(msg, 'DEFAULT');
    arr.push(msg);
  });
  console.log('\n');
  console.log(arr.join('\n'));
};

function formatPercent(n) {
  var str = Math.floor(n * 100) + '%';
  var maxLen = 4;
  var rest = maxLen - str.length;
  return fix(rest, ' ') + str;
}

function maxStr(arr){
  var max = 0;
  arr.forEach(function(a) {
    if (a.length > max) {
      max = a.length;
    }
  });
  max = (13 + max) / 8;
  if (max < Math.ceil(max)) {
    return Math.ceil(max);
  } else {
    return max + 1;
  }
}
function fix(n, fill) {
  var str = [];
  fill = fill || '\t';
  for (var i = 0; i < n; i++) {
    str.push(fill);
  }
  return str.join('');
}
function fillStr(str, len) {
  var n = Math.floor( (13+ str.length) / 8);
  return str + fix(len - n);
}