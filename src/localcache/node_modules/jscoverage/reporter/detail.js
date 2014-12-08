/*!
 * jscoverage: reporter/detail.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2014-04-10 16:23:23
 * CopyRight 2014 (c) Fish And Other Contributors
 */
var originConsole = console;
var DEBUG;
console = {
  log: function () {
    if (DEBUG === true) {
      return; //do not print things
    } else {
      originConsole.log.apply(originConsole, Array.prototype.slice.apply(arguments));
    }
  }
};
/**
 * print detail coverage info in console
 * @param  {Object} _$jscoverage [description]
 * @param  {Object} stats        [description]
 * @param  {Number} covlevel       [description]
 */
exports.process = function (_$jscoverage, stats, covlevel, debug) {
  var file;
  var tmp;
  var source;
  var lines;
  var allcovered;
  DEBUG = debug === true ? true : false;
  for (var i in _$jscoverage) {
    file = i;
    tmp = _$jscoverage[i];
    if (typeof tmp === 'function' || tmp.length === undefined) {
      continue;
    }
    source = tmp.source;
    allcovered = true;
    //console.log('[JSCOVERAGE]',file);

    lines = [];
    for (var n = 0, len = source.length; n < len ; n++) {
      if (tmp[n] === 0) {
        lines[n] = 1;
        allcovered = false;
      } else {
        lines[n] = 0;
      }
    }
    if (allcovered) {
      console.log(file, colorful('\t100% covered', 'GREEN'));
    } else {
      console.log('[UNCOVERED CODE]', file);
      printCoverageDetail(lines, source);
    }
    console.log('\n\n');
  }
};

function processLinesMask(lines) {
  function processLeft3(arr, offset) {
    var prev1 = offset - 1;
    var prev2 = offset - 2;
    var prev3 = offset - 3;
    if (prev1 < 0) {
      return;
    }
    arr[prev1] = arr[prev1] === 1 ? arr[prev1] : 2;
    if (prev2 < 0) {
      return;
    }
    arr[prev2] = arr[prev2] === 1 ? arr[prev2] : 2;
    if (prev3 < 0) {
      return;
    }
    arr[prev3] = arr[prev3] ? arr[prev3] : 3;
  }
  function processRight3(arr, offset) {
    var len = arr.length;
    var next1 = offset;
    var next2 = offset + 1;
    var next3 = offset + 2;
    if (next1 >= len || arr[next1] === 1) {
      return;
    }
    arr[next1] = arr[next1] ? arr[next1] : 2;
    if (next2 >= len || arr[next2] === 1) {
      return;
    }
    arr[next2] = arr[next2] ? arr[next2] : 2;
    if (next3 >= len || arr[next3] === 1) {
      return;
    }
    arr[next3] = arr[next3] ? arr[next3] : 3;
  }
  var offset = 0;
  var now;
  var prev = 0;
  while (offset < lines.length) {
    now = lines[offset];
    now =  now !== 1 ? 0 : 1;
    if (now !== prev) {
      if (now === 1) {
        processLeft3(lines, offset);
      } else if (now === 0) {
        processRight3(lines, offset);
      }
    }
    prev = now;
    offset ++;
  }
  return lines;
}
/**
 * printCoverageDetail
 * @param  {Array} lines [true] 1 means no coveraged
 * @return {}
 */
function printCoverageDetail(lines, source) {
  var len = lines.length;
  lines = processLinesMask(lines);
  console.log('-- START --');
  //console.log(lines);
  for (var i = 1; i < len; i++) {
    if (lines[i] !== 0) {
      if (lines[i] === 3) {
        console.log('......');
      } else if (lines[i] === 2) {
        echo(i, source[i - 1], false);
      } else {
        echo(i, source[i - 1], true);
      }
    }
  }
  function echo(lineNum, str, bool) {
    console.log(colorful(lineNum, 'LINENUM') + '|' + colorful(str, bool ? 'YELLOW' : 'GREEN'));
  }
  console.log('-- END --');
}
/**
 * colorful display
 * @param  {} str
 * @param  {} type
 * @return {}
 */
function colorful(str, type) {
  var head = '\x1B[', foot = '\x1B[0m';
  var color = {
    LINENUM : 36,
    GREEN  : 32,
    YELLOW  : 33,
    RED : 31
  };
  return head + color[type] + 'm' + str + foot;
}