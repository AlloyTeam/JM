
var indents = 1;
function indent() {
  return Array(indents).join('  ');
}

exports.process = function (_$jscoverage, stats, covlevel, name, utils) {
  var arr = [];
  var colorful = utils.colorful;
  console.log('\n');
  console.log(colorful('%s%s', 'DEFAULT'), indent(), 'Coverage result');
  indents ++;
  var files = Object.keys(stats);
  var maxFileLength = maxStr(files);
  files.forEach(function (file) {
    var coverage = stats[file].lineCoverage;
    var type = utils.getType(covlevel, coverage);
    var head = type[1];
    type = type[0];
    var msg = fillStr(file, maxFileLength) +
      'line[' + colorful(formatPercent(stats[file].lineCoverage), type) + ']' +
      '  branch[' + colorful(formatPercent(stats[file].branchCoverage), type) + ']';
    msg = indent() + colorful(head, type) + ' ' + colorful(msg, 'DEFAULT');
    arr.push(msg);
  });
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
  var len = indent().length + 2;
  max = (len + max) / 8;
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
  var prefix = indent().length + 2;
  var n = Math.floor( (prefix+ str.length) / 8);
  return str + fix(len - n);
}
