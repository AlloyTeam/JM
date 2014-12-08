exports.formatCoverage = function (n) {
  var str = Math.floor(n * 10000)/100 + '%';
  return str;
};

var symbols = {
  ok: '✓',
  warn: '⁍',
  err: '✱'
};
// With node.js on Windows: use symbols available in terminal default fonts
if ('win32' === process.platform) {
  symbols.ok = '\u221A';
  symbols.warn = '\u204D';
  symbols.err = '\u2731';
}

exports.getType = function (covlevel, coverage) {
  var type;
  var head;
  if (coverage >= covlevel.high) {
      type = 'GREEN';
      head = symbols.ok;
    } else if (coverage >= covlevel.middle) {
      type = null;
      head = symbols.ok;
    } else if (coverage >= covlevel.low) {
      type = 'YELLOW';
      head = symbols.warn;
    } else {
      type = 'RED';
      head = symbols.err;
    }
  return [type, head];
};
exports.colorful = function (str, type) {
  if (!type) {
    return str;
  }
  var head = '\x1B[', foot = '\x1B[0m';
  var color = {
    LINENUM : 36,
    GREEN  : 32,
    YELLOW  : 33,
    RED : 31,
    DEFAULT: 0
  };
  return head + color[type] + 'm' + str + foot;
};