define(function () {

    // 定义全局变量
    JM = function (selector, context) {
        if (!(this instanceof JM)) return new JM(selector, context);

        // context 可以是JM对象或原生DOM对象
        if(context)
            context = context instanceof JM ? context[0] : context;
        else
            context = document;

        this.context = context;

        var elements = [];
        if(typeof selector == 'string') {
            this.selector = selector;
            elements = context.querySelectorAll(selector);
        }else if(selector.version){
            return selector;
        }else{
            elements = elements.concat(selector)
        }

        for(var i = 0, l = elements.length; i < l; i++){
            this.push(elements[i])
        }
    }

    // Object.create 兼容性
    // @see https://github.com/AlloyTeam/Mars/blob/master/tools/es5-mobile-compat-table.md
    JM.fn = JM.prototype = Object.create(Array.prototype, {
        // 版本值，通过构建工具替换
        version:  { writable: false, value: "@VERSION" },

        // 初始选择器
        selector: { writable: true, value: "" }
    });

    $ = JM;

})
