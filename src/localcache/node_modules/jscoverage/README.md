jscoverage
==========
![logo](https://raw.github.com/fishbar/jscoverage/master/logo.png)

jscoverage tool, both node.js or javascript support

[![Build Status](https://travis-ci.org/fishbar/jscoverage.svg)](https://travis-ci.org/fishbar/jscoverage)
[![NPM version](https://badge.fury.io/js/jscoverage.svg)](http://badge.fury.io/js/jscoverage)


### install

```sh
npm install jscoverage
```

### changelog

from v0.5.0， jscoverage start using uglify2, and enhance the coverage range.
now, jscoverage will find out which branch you missed!

### Get start

using mocha loading the jscoverage module, then it's work:
```sh
mocha -r jscoverage test/
```

jscoverage will append coverage info when you select `list` or `spec` or `tap` reporter in mocha
```sh
mocha -r jscoverage -R spec test/
```

besides, you can use `--covout` to specify the reporter， like `html`, `detail`.
the `detail` reporter will print the uncovered code in the console directly.

### using jscoverage with mocha

full modelł:
```sh
mocha -r jscoverage --covignore .covignore --covout=html --covinject=true --coverage=90,85,75 test
```
the cmd above means:
  * mocha run test case with jscoverage module
  * jscoverage will ignore files while list in .covignore file
  * jscoverage will output a report in html format
  * jscoverage will inject a group of function to your module.exports (_get, _set, _reset, _replace);
  * jscoverage will switch the colorful output:  90%+ is greate, 85%+ is ok, lower then 75% coverage is terrible

jscoverage can recognise all options below:

```
 --covignore [filepath] # like gitignore, tell jscoverage to ignore these files
 --overrideIgnore [boolean] # set if override the build-in ignore rules
 --covout [output report] # can be:  spec, list, tap, detail, html
 --coverage [high,middle,low] # coverage level, default is: 90,70,30 , means 90% is high, 30% is low
 --covinject [boolean] # switch if inject code for easytest(exports._get, exports._replace, exports._reset)
```

default jscoverage will search .covignore in the project root

### using jscoverage as cli command

```shell
jscoverage
# print help info
jscoverage source.js
# convert source.js to source-cov.js
jscoverage source.js dest.js
# convert source.js to dest.js
jscoverage sourcedir destdir --exclude a.js,b.js,c.js,*.min.js
# convert all files in sourcedir to destdir, exclude list will be ignored
```
jscoverage will copy exclude file from source dir to dest dir

### using inject api for node.js test

```js
var testMod = require('module/for/test.js');

testMod._get('name');
testMod._replace('name', value);
testMod._reset();
testMod._call();
```
### inline ignore annotation

using bellow comment, jscoverage will ignore the following block/statement

```js
  /* @covignore */
```

### using jscoverage programmatically

comming soon

### mocha global leaks detect

The follow object will be detected, all of them are created by jscoverage.

  * _$jscoverage
  * _$jscmd

