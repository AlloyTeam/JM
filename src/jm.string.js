//string
J.$package(function(J){
    
    var cache = {};
    var template = function(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            template(document.getElementById(str).innerHTML) :
          
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
        
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
    J.string = J.string || {};
    J.string.template = template;

    //html正文编码：对需要出现在HTML正文里(除了HTML属性外)的不信任输入进行编码
    var encodeHtml = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        return sStr;
    };

    J.string.encodeHtml = encodeHtml;

    /**
     * 判断是否是一个可接受的 url 串
     * 
     * @method isURL
     * @memberOf string
     * 
     * @param {String} str 要检测的字符串
     * @return {Boolean} 如果是可接受的 url 则返回 true
     */
    var isURL = function(str) {
        return isURL.RE.test(str);
    };
        
    /**
     * @ignore
     */
    isURL.RE = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;


    /**
     * 分解 URL 为一个对象，成员为：scheme, user, pass, host, port, path, query, fragment
     * 
     * @method parseURL
     * @memberOf string
     * 
     * @param {String} str URL 地址
     * @return {Object} 如果解析失败则返回 null
     */
    var parseURL = function(str) {
        var ret = null;

        if (null !== (ret = parseURL.RE.exec(str))) {
            var specObj = {};
            for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
                var curSpec = parseURL.SPEC[i];
                specObj[curSpec] = ret[i + 1];
            }
            ret = specObj;
            specObj = null;
        }

        return ret;
    };


    /**
     * 将一个对象（成员为：scheme, user, pass, host, port, path, query, fragment）重新组成为一个字符串
     * 
     * @method buildURL
     * @memberOf string
     * 
     * @param {Object} obj URl 对象
     * @return {String} 如果是可接受的 url 则返回 true
     */
    var buildURL = function(obj) {
        var ret = '';

        // prefix & surffix
        var prefix = {},
            surffix = {};

        for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
            var curSpec = parseURL.SPEC[i];
            if (!obj[curSpec]) {
                continue;
            }
            switch (curSpec) {
            case 'scheme':
                surffix[curSpec] = '://';
                break;
            case 'pass':
                prefix[curSpec] = ':';
            case 'user':
                prefix['host'] = '@';
                break;
            //case 'host':
            case 'port':
                prefix[curSpec] = ':';
                break;
            //case 'path':
            case 'query':
                prefix[curSpec] = '?';
                break;
            case 'fragment':
                prefix[curSpec] = '#';
                break;
            }

            // rebuild
            if (curSpec in prefix) {
                ret += prefix[curSpec];
            }
            if (curSpec in obj) {
                ret += obj[curSpec];
            }
            if (curSpec in surffix) {
                ret += surffix[curSpec];
            }
        }

        prefix = null;
        surffix = null;
        obj = null;

        return ret;
    };
    
    /**
     * @ignore
     */
    parseURL.SPEC = ['scheme', 'user', 'pass', 'host', 'port', 'path', 'query', 'fragment'];
    parseURL.RE = /^([^:]+):\/\/(?:([^:@]+):?([^@]*)@)?(?:([^/?#:]+):?(\d*))([^?#]*)(?:\?([^#]+))?(?:#(.+))?$/;
    
    J.string.parseURL = parseURL;
    J.string.buildURL = buildURL;

});