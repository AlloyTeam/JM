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
  var lineSloc = 0, branchSloc = 0;
  var lineHits =0, branchHits = 0;
  var formatCoverage = utils.formatCoverage;
  Object.keys(stats).forEach(function (file) {
    var coverage = stats[file].lineCoverage;
    var type = utils.getType(covlevel, coverage)[0];
    var msg = 'Coverage ' + file + ': line[' + utils.colorful(formatCoverage(stats[file].lineCoverage), type) + ']' +
      ', branch[' + utils.colorful(formatCoverage(stats[file].branchCoverage), type) + ']';
    msg = '#  ' + utils.colorful('\u204D', type) + ' ' +  utils.colorful(msg, 'DEFAULT');
    arr.push(msg);
    lineSloc += stats[file].lineSloc;
    lineHits += stats[file].lineHits;
    branchSloc += stats[file].branchSloc;
    branchHits += stats[file].branchHits;
  });
  console.log('\n');
  console.log(arr.join('\n'));
  var lineCoverage = formatCoverage(lineHits / lineSloc);
  var branchCoverage = formatCoverage(branchHits / branchSloc);

  console.log('# coverage line %s, branch %s', lineCoverage, branchCoverage);
};