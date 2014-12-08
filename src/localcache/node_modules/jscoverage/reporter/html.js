/*!
 * jscoverage: reporter/html.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2014-04-10 16:23:23
 * CopyRight 2014 (c) Fish And Other Contributors
 */

/**
 * Module dependencies.
 */

var fs = require('xfs');
var ejs = require('ejs');
var path = require('path');

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @param {Boolean} output
 * @api public
 */

exports.process = function (_$jscoverage, stats, covlevel, name, utils) {
  var result = map(_$jscoverage, stats);
  var tplMain = path.join(__dirname, '/templates/coverage.ejs');
  var tplEachFile = path.join(__dirname, '/templates/eachfile.ejs');
  var tplOverview = path.join(__dirname, '/templates/overview.ejs');
  tplMain = fs.readFileSync(tplMain, 'utf8').toString();
  tplEachFile = fs.readFileSync(tplEachFile, 'utf8').toString();
  tplOverview = fs.readFileSync(tplOverview, 'utf8').toString();
  result.instrumentation = name;

  function covClass(n) {
    // n = n;
    if (n >= covlevel.high) {
      return 'high';
    }
    if (n >= covlevel.middle) {
      return 'medium';
    }
    if (n >= covlevel.low) {
      return 'low';
    }
    return 'terrible';
  }
  var main = ejs.render(tplMain, {
    debug: false,
    cov: result,
    coverageClass: covClass,
    formatCoverage:utils.formatCoverage,
    filename: path.join(__dirname, './templates/cached.ejs')
  });
  fs.sync().save(process.cwd() + '/covreporter/index.html', main);

  var overview = ejs.render(tplOverview, {
    debug: false,
    cov: result,
    coverageClass: covClass,
    formatCoverage:utils.formatCoverage,
    filename: path.join(__dirname, './templates/cached.ejs')
  });
  fs.sync().save(process.cwd() + '/covreporter/overview.js',
    'displayFile(' + JSON.stringify(overview) + ');');

  result.files.forEach(function (file) {
    var ff = ejs.render(tplEachFile, {
      debug: false,
      file: file,
      coverageClass: covClass,
      formatCoverage:utils.formatCoverage,
      cov: covClass
    });
    fs.sync().save(process.cwd() + '/covreporter/' + file.filename,
      'displayFile(' + JSON.stringify(ff) + ');');
  });

  console.log('[REPORTER]: ', process.cwd() + '/covreporter');
};

/**
 * Map jscoverage data to a JSON structure
 * suitable for reporting.
 *
 * @param {Object} cov
 * @return {Object}
 * @api private
 */

function map(cov, stats) {
  var ret = {
    lineSloc: 0,
    lineHits: 0,
    lineMisses: 0,
    lineCoverage: 1,
    branchSloc: 0,
    branchHits: 0,
    branchMisses: 0,
    branchCoverage: 1,
    files: []
  };

  for (var filename in cov) {
    if (!cov[filename] || !cov[filename].length) {
      continue;
    }
    var data = coverage(filename, cov[filename], stats[filename]);
    ret.files.push(data);
    ret.lineHits += data.lineHits;
    ret.lineMisses += data.lineMisses;
    ret.lineSloc += data.lineSloc;
    ret.branchHits += data.branchHits;
    ret.branchMisses += data.branchMisses;
    ret.branchSloc += data.branchSloc;
  }

  ret.files.sort(function(a, b) {
    return a.filename.localeCompare(b.filename);
  });

  if (ret.lineSloc > 0) {
    ret.lineCoverage = Math.round(ret.lineHits / ret.lineSloc * 10000) / 100;
  }
  if (ret.branchSloc > 0) {
    ret.branchCoverage = Math.round(ret.branchHits / ret.branchSloc * 10000) / 100;
  }
  return ret;
}

/**
 * Map jscoverage data for a single source file
 * to a JSON structure suitable for reporting.
 *
 * @param {String} filename name of the source file
 * @param {Object} data jscoverage coverage data
 * @return {Object}
 * @api private
 */

function coverage(filename, data, stats) {
  var ret = {
    filename: filename,
    lineCoverage: stats.lineCoverage,
    lineHits: stats.lineHits,
    lineMisses: stats.lineSloc - stats.lineHits,
    lineSloc: stats.lineSloc,
    branchCoverage: stats.branchCoverage,
    branchHits: stats.branchHits,
    branchMisses: stats.branchSloc - stats.branchHits,
    branchSloc: stats.branchSloc,
    source: []
  };
  data.source.forEach(function(line, num){
    num++;
    var branches = stats.branches[num];
    var splits = [];
    if (branches) {
      branches.forEach(function (v) {
        if (!splits[v[0]]) {
          splits[v[0]] = {start:[], end:[]};
        }
        if (!splits[v[0] + v[1]]) {
          splits[v[0] + v[1]] = {start: [], end: []};
        }
        splits[v[0]].start.push('<i class="cond-miss">');
        splits[v[0] + v[1]].end.push('</i>');
      });
      var res = [];
      var offset = 0;
      splits.forEach(function (v, i) {
        if (!v) {
          return;
        }
        res.push(line.substr(offset, i - offset));
        res.push(v.end.join(''));
        res.push(v.start.join(''));
        offset = i;
      });
      res.push(line.substr(offset));
      line = res.join('');
    }
    ret.source[num] = {
      source: line,
      coverage: data[num] === undefined ? '' : data[num],
      branches: branches && branches.length ? true : false
    };
  });
  return ret;
}
