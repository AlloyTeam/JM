/*!
 * jscoverage: lib/instrument.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2014-04-03 15:20:13
 * CopyRight 2014 (c) Fish And Other Contributors
 */
/**
 * instrument code
 * @example
 *   var ist = new Instrument();
 *   var resCode = ist.process(str);
 */
var debug = require('debug')('cov:instrument');
var Uglify = require('uglify-js');

function Instrument() {
  /**
   * filename needed
   * @type {String}
   */
  this.filename = null;
  /**
   * store injected code
   * @type {String}
   */
  this.code = null;
  /**
   * 储存line信息
   * @type {Array}
   */
  this.lines = [];
  /**
   * 储存condition信息
   * @type {Object}
   */
  this.conds = {};
  /**
   * source code in array
   * @type {Array}
   */
  this.source = null;
}

Instrument.prototype = {
  // 行类型
  T_LINE: 'line',
  T_COND: 'cond',
  /**
   * process code
   * @public
   * @param  {String} code source code
   * @return {String} injected code
   */
  process: function (filename, code) {
    if (!filename) {
      throw new Error('[jscoverage]instrument need filename!');
    }

    var ist = this;
    // parse ast
    var ast = Uglify.parse(code);

    this.filename = filename;
    this.source = code.split(/\r?\n/);

    // init walker
    var walker = new Uglify.TreeWalker(function (node) {
      if (ist.checkIfIgnore(node, walker.stack)) {
        return;
      }
      var parent = this.parent();
      if (node instanceof Uglify.AST_Conditional) { // 三元判断
        debug('node type:', node.TYPE, 'parent type:', parent && parent.TYPE);
        node.consequent = ist.inject('cond', node.consequent.start.line, node.consequent);
        node.alternative = ist.inject('cond', node.alternative.start.line, node.alternative);
      } else if (node.TYPE === 'Binary') {
        debug('node type:', node.TYPE, 'parent type:', parent && parent.TYPE);
        if (node.operator && ['||', '&&'].indexOf(node.operator) === -1) {
          return;
        }
        if (!(node.left instanceof Uglify.AST_Constant)) {
          node.left = ist.inject('cond', node.left.start.line, node.left);
        }
        if (!(node.right instanceof Uglify.AST_Constant)) {
          node.right = ist.inject('cond', node.right.start.line, node.right);
        }
      }

      else if (node instanceof Uglify.AST_If) {
        debug('node type:', node.TYPE, 'parent type:', parent && parent.TYPE);
        node.condition = ist.inject('cond', node.condition.start.line, node.condition);
      }

      var len = node.body ? node.body.length : 0;
      if (len) {
        var res = [];
        var subNode;
        for (var i = 0; i < len; i++) {
          subNode = node.body[i];
          if (ist.checkIfIgnore(subNode, walker.stack)) {
            res.push(subNode);
            continue;
          }
          if (subNode instanceof Uglify.AST_Statement) {
            if (ist.ifExclude(subNode)) {
              res.push(subNode);
              continue;
            }
            res.push(ist.inject('line', subNode.start.line));
          } else if (subNode instanceof Uglify.AST_Var) {
            res.push(ist.inject('line', subNode.start.line));
          }
          res.push(subNode);
        }
        node.body = res;
      }
    });
    // figure_out_scope
    ast.figure_out_scope();
    // walk process
    ast.walk(walker);

    var out = Uglify.OutputStream({
      preserve_line : true,
      comments: 'all',
      beautify: true
    });
    // rebuild file
    ast.print(out);
    this.code = out.toString();
    return this;
  },
  /**
   * 注入覆盖率查询方法
   * @private
   * @param  {String} type  inject type, line | conds
   * @param  {Number} line  line number
   * @param  {Object} expr  any expression, or node, or statement
   * @return {AST_Func} Object
   */
  inject: function (type, line, expr) {
    var args = [];
    if (type === this.T_LINE) {
      this.lines.push(line);
      args = [
        new Uglify.AST_String({value: this.filename}),
        new Uglify.AST_String({value: type}),
        new Uglify.AST_Number({value: line})
      ];
    } else if (type === this.T_COND) {
      var start = expr.start.col;
      var offset = expr.end.endpos - expr.start.pos;
      var key = line + '_' + start + '_' + offset;  // 编码
      this.conds[key] = 0;
      args = [
        new Uglify.AST_String({value: this.filename}),
        new Uglify.AST_String({value: type}),
        new Uglify.AST_String({value: key}),
        expr
      ];
    }

    var call = new Uglify.AST_Call({
      expression: new Uglify.AST_SymbolRef({name: '_$jscmd'}),
      //end: new Uglify.AST_
      args: args
    });

    if (type === this.T_LINE) {
      return new Uglify.AST_SimpleStatement({
        body: call,
        end: new Uglify.AST_Token({value: ';'})
      });
    } else {
      return call;
    }
  },
  /**
   * check if need inject
   * @param  {AST_Node} node
   * @return {Boolean}
   */
  ifExclude: function (node) {
    if (node instanceof Uglify.AST_LoopControl) {
      return false;
    }
    if (
      node instanceof Uglify.AST_IterationStatement ||
      node instanceof Uglify.AST_StatementWithBody ||
      node instanceof Uglify.AST_Block
    ) {
      return true;
    }
  },
  checkIfIgnore: function (node, stack) {
    var cmt;
    if (node.start && node.start.comments_before.length) {
      cmt = node.start.comments_before[node.start.comments_before.length - 1];
      if (/@covignore/.test(cmt.value) && !(node instanceof Uglify.AST_Toplevel)) {
        node.__covignore = true;
      }
    }
    if (node.__covignore) {
      return true;
    }
    if (stack) {
      for (var i = stack.length - 1; i > 0; i--) {
        if (stack[i].__covignore) {
          return true;
        }
      }
    }
    return false;
  }
};

module.exports = Instrument;